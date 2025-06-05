#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'national-parks';

async function minimalTest() {
  console.log('🔬 Minimal Test - Using exact same approach as simple-test.js');
  
  // This URL format worked in simple-test.js
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=3`;
  
  console.log('URL:', url);
  
  try {
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
    console.log(`✅ Success! Got ${data.records.length} records`);
    
    // Now let's try to extract the data we need for blog generation
    const parks = data.records.map((record, index) => {
      // Parse Wikimedia Images
      let images = [];
      if (record.fields['Wikimedia Images']) {
        const imageText = record.fields['Wikimedia Images'];
        const urlMatches = imageText.match(/https:\/\/upload\.wikimedia\.org\/[^\s\n]+/g);
        images = urlMatches || [];
      }
      
      return {
        id: record.id,
        name: record.fields['Name'] || 'Unknown Park',
        city: record.fields['City'] || 'Unknown City',
        state: record.fields['States'] || 'Unknown State',
        description: record.fields['Description'] || '',
        images: images,
        randomPosition: index
      };
    });
    
    console.log('\n📊 Processed park data:');
    parks.forEach(park => {
      console.log(`- ${park.name} (${park.city}, ${park.state})`);
      console.log(`  Images: ${park.images.length} available`);
      console.log(`  Description: ${park.description.substring(0, 100)}...`);
    });
    
    return parks;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

minimalTest(); 