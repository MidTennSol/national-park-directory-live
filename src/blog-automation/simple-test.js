#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'national-parks';

async function simpleTest() {
  console.log('🧪 Simple Airtable Test');
  console.log('TOKEN:', AIRTABLE_TOKEN ? 'Present' : 'Missing');
  console.log('BASE_ID:', AIRTABLE_BASE_ID || 'Missing');
  console.log('TABLE_NAME:', AIRTABLE_TABLE_NAME);
  
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error('❌ Missing credentials');
    return;
  }
  
  // Simple fetch without specifying fields to see what we get
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=1`;
  
  try {
    console.log('\n📡 Fetching first record to see available fields...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    
    if (data.records && data.records.length > 0) {
      const firstRecord = data.records[0];
      console.log('✅ Success! Found record:', firstRecord.id);
      console.log('\n📋 Available fields:');
      
      Object.keys(firstRecord.fields).forEach(field => {
        const value = firstRecord.fields[field];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`   - ${field}: ${type}`);
      });
      
      console.log('\n📄 Sample record data:');
      console.log(JSON.stringify(firstRecord.fields, null, 2));
      
    } else {
      console.log('⚠️ No records found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simpleTest(); 