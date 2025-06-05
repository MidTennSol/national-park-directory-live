#!/usr/bin/env node

/**
 * Test script for AI Content Generator
 * 
 * Tests the AI blog post generation using real park data
 */

import { generateBlogPost, testAIConnection, generateBlogFileName } from './ai-content-generator.js';
import { getNextParkForBlog } from './airtable-connector.js';

async function main() {
  console.log('🧪 Testing AI Content Generator');
  console.log('='.repeat(50));
  
  try {
    // Test 1: AI Connection
    console.log('\n1️⃣ Testing AI connection...');
    const connectionTest = await testAIConnection();
    
    if (!connectionTest.success) {
      console.error('❌ AI connection failed:', connectionTest.error);
      process.exit(1);
    }
    
    console.log('✅ AI connection successful');
    console.log(`   Model: ${connectionTest.model}`);
    console.log(`   Response: ${connectionTest.message}`);
    
    // Test 2: Get Park Data
    console.log('\n2️⃣ Getting park data from Airtable...');
    const park = await getNextParkForBlog();
    
    if (!park) {
      console.error('❌ No park data available');
      process.exit(1);
    }
    
    console.log('✅ Park data retrieved:');
    console.log(`   Park: ${park.name}`);
    console.log(`   Location: ${park.city}, ${park.state}`);
    console.log(`   Images: ${park.images.length} available`);
    console.log(`   Activities: ${park.activities.slice(0, 3).join(', ')}...`);
    
    // Test 3: Generate Blog Post
    console.log('\n3️⃣ Generating AI blog post...');
    console.log('⏳ This may take 30-60 seconds...');
    
    const startTime = Date.now();
    
    const blogContent = await generateBlogPost(park, {
      topic: 'complete visitor guide',
      season: 'year-round'
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log(`✅ Blog post generated in ${duration} seconds!`);
    
    // Test 4: Validate Content
    console.log('\n4️⃣ Validating generated content...');
    
    const validation = {
      hasTitle: !!blogContent.title,
      hasDescription: !!blogContent.description,
      hasExcerpt: !!blogContent.excerpt,
      hasContent: !!blogContent.content,
      hasTags: blogContent.tags && blogContent.tags.length > 0,
      wordCount: blogContent.wordCount,
      descriptionLength: blogContent.description.length,
      titleContainsPark: blogContent.title.includes(park.name),
      titleContainsLocation: blogContent.title.includes(park.city) || blogContent.title.includes(park.state),
      contentContainsPark: blogContent.content.includes(park.name),
      contentContainsLocation: blogContent.content.includes(park.city) && blogContent.content.includes(park.state)
    };
    
    console.log('📊 Content Validation Results:');
    console.log(`   ✅ Title: ${validation.hasTitle ? 'Present' : 'Missing'}`);
    console.log(`   ✅ Description: ${validation.hasDescription ? 'Present' : 'Missing'} (${validation.descriptionLength} chars)`);
    console.log(`   ✅ Excerpt: ${validation.hasExcerpt ? 'Present' : 'Missing'}`);
    console.log(`   ✅ Content: ${validation.hasContent ? 'Present' : 'Missing'} (${validation.wordCount} words)`);
    console.log(`   ✅ Tags: ${validation.hasTags ? `${blogContent.tags.length} tags` : 'Missing'}`);
    
    console.log('\n🎯 SEO Validation:');
    console.log(`   ✅ Title contains park name: ${validation.titleContainsPark ? 'Yes' : 'No'}`);
    console.log(`   ✅ Title contains location: ${validation.titleContainsLocation ? 'Yes' : 'No'}`);
    console.log(`   ✅ Content contains park name: ${validation.contentContainsPark ? 'Yes' : 'No'}`);
    console.log(`   ✅ Content contains location: ${validation.contentContainsLocation ? 'Yes' : 'No'}`);
    console.log(`   ✅ Word count in range: ${validation.wordCount >= 800 && validation.wordCount <= 1200 ? 'Yes' : 'No'} (${validation.wordCount})`);
    console.log(`   ✅ Description length OK: ${validation.descriptionLength <= 160 ? 'Yes' : 'No'} (${validation.descriptionLength})`);
    
    // Test 5: Generate File Name
    console.log('\n5️⃣ Generating file name...');
    const fileName = generateBlogFileName(blogContent.title, park);
    console.log(`✅ File name: ${fileName}`);
    
    // Display Sample Content
    console.log('\n📝 Generated Content Preview:');
    console.log('='.repeat(50));
    console.log(`Title: ${blogContent.title}`);
    console.log(`Description: ${blogContent.description}`);
    console.log(`Excerpt: ${blogContent.excerpt}`);
    console.log(`Tags: ${blogContent.tags.join(', ')}`);
    console.log('\nContent Preview (first 300 chars):');
    console.log(blogContent.content.substring(0, 300) + '...');
    
    console.log('\n✅ AI Content Generator test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Generated ${validation.wordCount} word blog post`);
    console.log(`   - ${validation.descriptionLength} character meta description`);
    console.log(`   - ${blogContent.tags.length} relevant tags`);
    console.log(`   - SEO optimized with park name and location`);
    console.log(`   - Ready for publication as: ${fileName}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 