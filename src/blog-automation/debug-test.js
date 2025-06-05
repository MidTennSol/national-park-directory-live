#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'national-parks';

async function debugTest() {
  console.log('🐛 Debug Test - Finding which fields cause errors');
  
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  
  const fieldsToTest = [
    'Name',
    'City', 
    'States',
    'Description',
    'Wikimedia Images',
    'Activities (Simplified)',
    'Topics (Simplified)',
    'Random Parks'
  ];
  
  console.log('\n🧪 Testing each field individually...');
  
  for (const field of fieldsToTest) {
    try {
      const params = new URLSearchParams({
        fields: field,
        maxRecords: '1'
      });
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${field}: OK`);
      } else {
        const errorText = await response.text();
        console.log(`❌ ${field}: ERROR - ${response.status} ${errorText}`);
      }
      
    } catch (error) {
      console.log(`❌ ${field}: EXCEPTION - ${error.message}`);
    }
  }
  
  console.log('\n🧪 Testing with just Name and City...');
  try {
    const params = new URLSearchParams({
      fields: 'Name,City',
      maxRecords: '3'
    });
    
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success with Name,City - got ${data.records.length} records`);
      console.log('Sample record:', data.records[0].fields);
    } else {
      const errorText = await response.text();
      console.log(`❌ Error with Name,City: ${response.status} ${errorText}`);
    }
    
  } catch (error) {
    console.log(`❌ Exception with Name,City: ${error.message}`);
  }
}

debugTest(); 