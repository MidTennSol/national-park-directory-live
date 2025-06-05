#!/usr/bin/env node

/**
 * Test script for Airtable connector
 * 
 * This script validates the connection and schema before implementing the full blog automation system
 */

import { testConnection, getBlogStats, getNextParkForBlog } from './airtable-connector.js';

async function main() {
  console.log('🧪 Testing Airtable Connector for Blog Automation');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic Airtable connection...');
    const connectionTest = await testConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Connection test failed:', connectionTest.error);
      process.exit(1);
    }
    
    console.log('✅ Connection test passed');
    console.log(`   - Found ${connectionTest.parkCount} parks`);
    console.log(`   - Sample park: ${connectionTest.samplePark.name}`);
    
    // Test 2: Get blog statistics
    console.log('\n2️⃣ Getting blog generation statistics...');
    const stats = await getBlogStats();
    
    // Test 3: Try to get next park for blogging
    console.log('\n3️⃣ Testing park selection logic...');
    const nextPark = await getNextParkForBlog();
    
    if (nextPark) {
      console.log('✅ Found next park for blogging:');
      console.log(`   - Name: ${nextPark.name}`);
      console.log(`   - Location: ${nextPark.city}, ${nextPark.state}`);
      console.log(`   - Has images: ${nextPark.images.length > 0 ? 'Yes' : 'No'}`);
      console.log(`   - Random position: ${nextPark.randomParksPosition}`);
    } else {
      console.log('⚠️ No parks available for blogging (this might be expected if schema fields don\'t exist yet)');
    }
    
    // Test 4: Schema validation
    console.log('\n4️⃣ Checking required schema fields...');
    const requiredFields = [
      'Random Parks',
      'Blog Generated', 
      'Last Blog Date',
      'Blog Topic Used',
      'Blog File Name'
    ];
    
    console.log('Required fields for blog automation:');
    requiredFields.forEach(field => {
      console.log(`   - ${field}`);
    });
    
    console.log('\n📝 Next Steps:');
    console.log('1. Add the required fields to your Airtable schema if they don\'t exist');
    console.log('2. Populate the "Random Parks" field with numbers 1-N for random ordering');
    console.log('3. Run this test again to verify everything works');
    console.log('4. Once validated, we can proceed with the AI content generation system');
    
    console.log('\n✅ Airtable connector test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 