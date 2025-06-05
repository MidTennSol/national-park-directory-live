/**
 * Health Check Module for Blog Automation
 * 
 * Performs comprehensive system health checks to ensure all components
 * are working properly before attempting blog generation
 */

import { getBlogStats, testConnection } from './airtable-connector.js';
import { testAIConnection } from './ai-content-generator.js';
import fs from 'fs/promises';

/**
 * Run comprehensive health check
 */
export async function runHealthCheck() {
  console.log('🏥 Running Blog Automation Health Check...');
  console.log('==================================================');
  
  const results = {
    airtable: false,
    ai: false,
    fileSystem: false,
    overall: false
  };
  
  try {
    // Test 1: Airtable Connection
    console.log('1️⃣ Testing Airtable connection...');
    const airtableTest = await testConnection();
    if (airtableTest.success) {
      const stats = await getBlogStats();
      results.airtable = true;
      console.log(`✅ Airtable: ${stats.totalParks} parks, ${stats.unbloggedParks} unblogged`);
    } else {
      console.log(`❌ Airtable: ${airtableTest.error}`);
    }
    
    // Test 2: AI Connection
    console.log('2️⃣ Testing AI connection...');
    const aiTest = await testAIConnection();
    results.ai = aiTest.success;
    if (aiTest.success) {
      console.log(`✅ AI: Connected (${aiTest.model})`);
    } else {
      console.log(`❌ AI: ${aiTest.error || 'Connection failed'}`);
    }
    
    // Test 3: File System
    console.log('3️⃣ Testing file system...');
    try {
      await fs.access('src/content/blog');
      results.fileSystem = true;
      console.log('✅ File System: Blog directory accessible');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⚠️ File System: Blog directory will be created');
        results.fileSystem = true; // We can create it
      } else {
        console.log(`❌ File System: ${error.message}`);
      }
    }
    
    results.overall = results.airtable && results.ai && results.fileSystem;
    
    console.log('🎯 Health Check Summary:');
    console.log(`   📊 Airtable: ${results.airtable ? '✅' : '❌'}`);
    console.log(`   🤖 AI: ${results.ai ? '✅' : '❌'}`);
    console.log(`   📁 File System: ${results.fileSystem ? '✅' : '❌'}`);
    console.log(`   🏥 Overall: ${results.overall ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return results;
  }
}

export default { runHealthCheck }; 