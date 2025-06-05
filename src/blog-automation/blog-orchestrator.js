/**
 * Blog Orchestrator - Main automation system
 * 
 * Coordinates all components of the blog automation system:
 * 1. Get next park from Airtable (with duplicate prevention)
 * 2. Generate AI content
 * 3. Create blog file
 * 4. Update Airtable tracking (prevent future duplicates)
 */

import { getNextParkForBlog, markParkAsBlogged, getBlogStats } from './airtable-connector.js';
import { generateBlogPost, testAIConnection } from './ai-content-generator.js';
import { generateBlogFile, checkFileExists } from './file-generator.js';

/**
 * Generate a complete blog post with full automation
 * 
 * @param {Object} options - Generation options
 * @returns {Object} Generation result
 */
export async function generateCompleteBlogPost(options = {}) {
  console.log('🚀 Starting complete blog post generation...');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Step 1: Get next park for blogging
    console.log('\n1️⃣ Getting next park for blogging...');
    const park = await getNextParkForBlog();
    
    if (!park) {
      throw new Error('No unblogged parks available. All parks may have been blogged already.');
    }
    
    console.log(`✅ Selected park: ${park.name} (${park.city}, ${park.state})`);
    console.log(`   - Images available: ${park.images.length}`);
    console.log(`   - Activities: ${park.activities.slice(0, 3).join(', ')}...`);
    
    // Step 2: Generate AI content
    console.log('\n2️⃣ Generating AI blog content...');
    console.log('⏳ This may take 30-60 seconds...');
    
    const blogContent = await generateBlogPost(park, {
      topic: options.topic || 'complete visitor guide',
      season: options.season || 'year-round'
    });
    
    console.log(`✅ AI content generated successfully`);
    console.log(`   - Title: ${blogContent.title}`);
    console.log(`   - Word count: ${blogContent.wordCount} words`);
    console.log(`   - Meta description: ${blogContent.description.length} chars`);
    
    // Step 3: Check for file conflicts
    console.log('\n3️⃣ Checking for file conflicts...');
    const fileName = generateFileName(blogContent.title, park);
    const fileExists = await checkFileExists(fileName);
    
    if (fileExists) {
      console.log(`⚠️ File already exists: ${fileName}`);
      console.log('Proceeding anyway with timestamp differentiation...');
    } else {
      console.log(`✅ File name available: ${fileName}`);
    }
    
    // Step 4: Generate blog file
    console.log('\n4️⃣ Creating blog file...');
    const fileResult = await generateBlogFile(blogContent, park, options);
    
    console.log(`✅ Blog file created successfully`);
    console.log(`   - File: ${fileResult.fileName}`);
    console.log(`   - Size: ${fileResult.fileSize} characters`);
    
    // Step 5: Update Airtable tracking (CRITICAL for duplicate prevention)
    console.log('\n5️⃣ Updating Airtable tracking...');
    
    const trackingData = {
      topic: blogContent.topic,
      fileName: fileResult.fileName
    };
    
    await markParkAsBlogged(park.id, trackingData);
    
    console.log(`✅ Airtable updated successfully`);
    console.log(`   - Park marked as blogged`);
    console.log(`   - Last blog date recorded`);
    console.log(`   - File name tracked`);
    
    // Step 6: Generate summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log('\n🎉 Blog post generation completed successfully!');
    console.log('='.repeat(60));
    
    const result = {
      success: true,
      duration: `${duration} seconds`,
      park: {
        id: park.id,
        name: park.name,
        location: `${park.city}, ${park.state}`
      },
      content: {
        title: blogContent.title,
        wordCount: blogContent.wordCount,
        tags: blogContent.tags.length,
        topic: blogContent.topic
      },
      file: {
        name: fileResult.fileName,
        path: fileResult.filePath,
        size: fileResult.fileSize
      },
      tracking: {
        parkMarkedAsBlogged: true,
        duplicatePrevention: 'Active'
      }
    };
    
    console.log('\n📊 Generation Summary:');
    console.log(`   🏞️  Park: ${result.park.name} (${result.park.location})`);
    console.log(`   📝 Title: ${result.content.title}`);
    console.log(`   📄 File: ${result.file.name}`);
    console.log(`   ⏱️  Duration: ${result.duration}`);
    console.log(`   🔒 Duplicate Prevention: ${result.tracking.duplicatePrevention}`);
    
    return result;
    
  } catch (error) {
    console.error('\n❌ Blog generation failed:', error.message);
    console.error('Full error:', error);
    
    return {
      success: false,
      error: error.message,
      duration: `${((Date.now() - startTime) / 1000).toFixed(1)} seconds`
    };
  }
}

/**
 * Run system health check
 */
export async function runHealthCheck() {
  console.log('🏥 Running Blog Automation Health Check...');
  console.log('='.repeat(50));
  
  const results = {
    airtable: false,
    ai: false,
    fileSystem: false,
    overall: false
  };
  
  try {
    // Test 1: Airtable Connection
    console.log('\n1️⃣ Testing Airtable connection...');
    const stats = await getBlogStats();
    results.airtable = true;
    console.log(`✅ Airtable: ${stats.totalParks} parks, ${stats.unbloggedParks} unblogged`);
    
    // Test 2: AI Connection
    console.log('\n2️⃣ Testing AI connection...');
    const aiTest = await testAIConnection();
    results.ai = aiTest.success;
    console.log(`✅ AI: ${aiTest.success ? 'Connected' : 'Failed'} (${aiTest.model || 'N/A'})`);
    
    // Test 3: File System
    console.log('\n3️⃣ Testing file system...');
    const fs = await import('fs/promises');
    try {
      await fs.access('src/content/blog');
      results.fileSystem = true;
      console.log('✅ File System: Blog directory accessible');
    } catch (error) {
      console.log('⚠️ File System: Blog directory needs to be created');
      results.fileSystem = true; // We can create it
    }
    
    results.overall = results.airtable && results.ai && results.fileSystem;
    
    console.log('\n🎯 Health Check Summary:');
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

/**
 * Get system statistics
 */
export async function getSystemStats() {
  try {
    const stats = await getBlogStats();
    
    // Calculate progress percentage
    const progressPercent = stats.totalParks > 0 
      ? Math.round((stats.bloggedParks / stats.totalParks) * 100)
      : 0;
    
    return {
      ...stats,
      progressPercent,
      remainingDays: stats.unbloggedParks, // One post per day
      systemStatus: stats.unbloggedParks > 0 ? 'Active' : 'Complete'
    };
    
  } catch (error) {
    console.error('❌ Error getting system stats:', error.message);
    return null;
  }
}

/**
 * Generate file name (helper function)
 */
function generateFileName(title, park) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const date = new Date().toISOString().split('T')[0];
  return `${date}-${slug}.md`;
}

export default {
  generateCompleteBlogPost,
  runHealthCheck,
  getSystemStats
}; 