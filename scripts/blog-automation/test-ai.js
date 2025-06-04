#!/usr/bin/env node

/**
 * Test AI Integration for Blog Generation
 * 
 * Verifies that OpenAI API is properly configured and working
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { testAI } from '../../src/automation/blog-generator.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('🧪 Testing AI Integration for Blog Generation');
  console.log('=' .repeat(50));

  try {
    const result = await testAI();
    
    if (result.success) {
      console.log('\n✅ AI INTEGRATION TEST PASSED');
      console.log('-'.repeat(30));
      console.log(`🤖 Model: ${result.model}`);
      console.log(`📝 Response: ${result.message}`);
      console.log('\n🎉 Your AI-powered blog generation is ready!');
      console.log('\n📋 Next Steps:');
      console.log('1. Generate your first AI blog post:');
      console.log('   npm run generate-blog-post -- --preview');
      console.log('2. Generate a real blog post:');
      console.log('   npm run generate-blog-post');
      
    } else {
      console.log('\n❌ AI INTEGRATION TEST FAILED');
      console.log('-'.repeat(30));
      console.log(`Error: ${result.error}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check that OPENAI_API_KEY is set in your .env file');
      console.log('2. Verify your OpenAI API key is valid and has credits');
      console.log('3. Ensure you have internet connectivity');
      console.log('\n📝 Add this to your .env file:');
      console.log('OPENAI_API_KEY=your_openai_api_key_here');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 UNEXPECTED ERROR');
    console.error('-'.repeat(30));
    console.error('Error:', error.message);
    console.error('\n🔍 Debug info:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.error('\n💥 UNCAUGHT EXCEPTION');
  console.error(error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n💥 UNHANDLED REJECTION');
  console.error(reason);
  process.exit(1);
});

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 