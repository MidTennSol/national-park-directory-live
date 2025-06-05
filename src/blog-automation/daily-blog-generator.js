#!/usr/bin/env node

/**
 * Daily Blog Generator
 * 
 * Simple script to generate one blog post per day
 * Run this script daily to automatically create new blog content
 */

import { generateCompleteBlogPost, runHealthCheck, getSystemStats } from './blog-orchestrator.js';

async function main() {
  console.log('📅 Daily Blog Generator');
  console.log('🌟 National Park Directory Blog Automation');
  console.log('='.repeat(50));
  
  const startTime = new Date();
  console.log(`⏰ Started at: ${startTime.toLocaleString()}`);
  
  try {
    // Quick health check
    console.log('\n🏥 Running quick health check...');
    const health = await runHealthCheck();
    
    if (!health.overall) {
      console.error('❌ System health check failed. Please check your configuration.');
      process.exit(1);
    }
    
    // Get current stats
    const stats = await getSystemStats();
    console.log(`\n📊 System Status: ${stats.unbloggedParks} parks remaining`);
    
    if (stats.unbloggedParks === 0) {
      console.log('🎉 Congratulations! All parks have been blogged!');
      console.log('✅ Blog automation is complete.');
      return;
    }
    
    // Generate today's blog post
    console.log('\n🚀 Generating today\'s blog post...');
    
    const result = await generateCompleteBlogPost({
      topic: 'complete visitor guide',
      season: getCurrentSeason()
    });
    
    if (result.success) {
      console.log('\n🎉 Daily blog post generated successfully!');
      console.log('='.repeat(50));
      console.log(`🏞️  Park: ${result.park.name}`);
      console.log(`📍 Location: ${result.park.location}`);
      console.log(`📝 Title: ${result.content.title}`);
      console.log(`📄 File: ${result.file.name}`);
      console.log(`⏱️  Duration: ${result.duration}`);
      
      // Updated stats
      const newStats = await getSystemStats();
      console.log(`\n📈 Progress: ${newStats.bloggedParks}/${newStats.totalParks} parks (${newStats.progressPercent}%)`);
      console.log(`📅 Estimated completion: ${newStats.remainingDays} days remaining`);
      
    } else {
      console.error('\n❌ Daily blog generation failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Daily blog generator failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
  
  const endTime = new Date();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Daily blog generation completed in ${duration} seconds`);
  console.log(`⏰ Finished at: ${endTime.toLocaleString()}`);
}

/**
 * Get current season for seasonal content
 */
function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main as generateDailyBlog }; 