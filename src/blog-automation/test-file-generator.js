#!/usr/bin/env node

/**
 * Test script for File Generator
 * 
 * Tests the complete blog file generation process
 */

import { generateBlogPost } from './ai-content-generator.js';
import { getNextParkForBlog } from './airtable-connector.js';
import { generateBlogFile, generateFilePreview, listBlogFiles } from './file-generator.js';

async function main() {
  console.log('🧪 Testing File Generator');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Get Park Data
    console.log('\n1️⃣ Getting park data from Airtable...');
    const park = await getNextParkForBlog();
    
    if (!park) {
      console.error('❌ No park data available');
      process.exit(1);
    }
    
    console.log('✅ Park data retrieved:');
    console.log(`   Park: ${park.name}`);
    console.log(`   Location: ${park.city}, ${park.state}`);
    console.log(`   Images: ${park.images.length} available`);
    
    // Test 2: Generate AI Content
    console.log('\n2️⃣ Generating AI blog content...');
    console.log('⏳ This may take 30-60 seconds...');
    
    const blogContent = await generateBlogPost(park, {
      topic: 'complete visitor guide',
      season: 'year-round'
    });
    
    console.log('✅ AI content generated successfully');
    console.log(`   - Title: ${blogContent.title}`);
    console.log(`   - Word count: ${blogContent.wordCount} words`);
    console.log(`   - Tags: ${blogContent.tags.length} tags`);
    
    // Test 3: Generate File Preview
    console.log('\n3️⃣ Generating file preview...');
    const preview = generateFilePreview(blogContent, park);
    
    console.log('✅ File preview generated:');
    console.log(`   - File name: ${preview.fileName}`);
    console.log(`   - Content size: ${preview.size} characters`);
    console.log('\n📄 Preview (first 500 chars):');
    console.log(preview.preview);
    
    // Test 4: Check existing files
    console.log('\n4️⃣ Checking existing blog files...');
    const existingFiles = await listBlogFiles();
    console.log(`📁 Found ${existingFiles.length} existing blog files`);
    
    if (existingFiles.length > 0) {
      console.log('Recent files:');
      existingFiles.slice(-3).forEach(file => {
        console.log(`   - ${file}`);
      });
    }
    
    // Test 5: Generate actual file
    console.log('\n5️⃣ Generating blog file...');
    console.log('⚠️ This will create a real file in src/content/blog/');
    
    const fileResult = await generateBlogFile(blogContent, park);
    
    console.log('✅ Blog file created successfully!');
    console.log(`   - File name: ${fileResult.fileName}`);
    console.log(`   - File path: ${fileResult.filePath}`);
    console.log(`   - File size: ${fileResult.fileSize} characters`);
    console.log(`   - Word count: ${fileResult.wordCount} words`);
    
    // Test 6: Validate file structure
    console.log('\n6️⃣ Validating file structure...');
    
    // Check if the file was actually created
    const fs = await import('fs/promises');
    try {
      const fileContent = await fs.readFile(fileResult.filePath, 'utf8');
      
      const validation = {
        hasFrontmatter: fileContent.startsWith('---'),
        hasTitle: fileContent.includes('title:'),
        hasDate: fileContent.includes('date:'),
        hasImage: fileContent.includes('image:'),
        hasTags: fileContent.includes('tags:'),
        hasDescription: fileContent.includes('description:'),
        hasContent: fileContent.includes('---\n\n') && fileContent.split('---\n\n')[1]?.length > 0
      };
      
      console.log('📊 File Structure Validation:');
      console.log(`   ✅ Has frontmatter: ${validation.hasFrontmatter ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has title: ${validation.hasTitle ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has date: ${validation.hasDate ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has image: ${validation.hasImage ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has tags: ${validation.hasTags ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has description: ${validation.hasDescription ? 'Yes' : 'No'}`);
      console.log(`   ✅ Has content: ${validation.hasContent ? 'Yes' : 'No'}`);
      
      const allValid = Object.values(validation).every(v => v === true);
      console.log(`\n🎯 Overall validation: ${allValid ? '✅ PASSED' : '❌ FAILED'}`);
      
    } catch (error) {
      console.error('❌ Error reading generated file:', error.message);
    }
    
    console.log('\n✅ File Generator test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Generated blog post for: ${park.name}`);
    console.log(`   - Created file: ${fileResult.fileName}`);
    console.log(`   - File size: ${fileResult.fileSize} characters`);
    console.log(`   - Content: ${fileResult.wordCount} words`);
    console.log(`   - Location: ${fileResult.filePath}`);
    
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