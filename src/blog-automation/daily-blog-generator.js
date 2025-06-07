#!/usr/bin/env node

/**
 * Daily Blog Generator - Dual Post Generation
 * 
 * Generates two blog posts per day:
 * 1. Current/future date post
 * 2. Back-dated post (progressively further back each day)
 */

import { getNextParkForBlog, markParkAsBlogged, getBlogStats } from './airtable-connector.js';
import { generateCompleteBlogPost } from './blog-orchestrator.js';
import fs from 'fs/promises';
import path from 'path';

// Campaign configuration - using a counter system for reliable progression
const CAMPAIGN_START_DATE = '2025-06-05'; // Reference date for calculating dates
const COUNTER_FILE = '.campaign-counter.json';

/**
 * Get or initialize the campaign counter
 */
async function getCampaignCounter() {
  try {
    const counterData = await fs.readFile(COUNTER_FILE, 'utf8');
    const data = JSON.parse(counterData);
    return data.dayCount || 0;
  } catch (error) {
    // File doesn't exist, start at 0
    return 0;
  }
}

/**
 * Increment and save the campaign counter
 */
async function incrementCampaignCounter() {
  try {
    let currentCount = await getCampaignCounter();
    currentCount++;
    
    const data = {
      dayCount: currentCount,
      lastRun: new Date().toISOString(),
      totalRuns: currentCount
    };
    
    await fs.writeFile(COUNTER_FILE, JSON.stringify(data, null, 2));
    return currentCount;
  } catch (error) {
    console.error('❌ Error updating campaign counter:', error);
    return 1; // Fallback to day 1
  }
}

/**
 * Calculate current and historical dates based on campaign day
 * Fixed logic: Current date progresses forward, historical date progresses backward
 */
function calculateDatesForCampaignDay(dayCount) {
  // Current date: Today's actual date (progresses forward each day)
  // Day 1: June 6, Day 2: June 7, Day 3: June 8, etc.
  const currentDate = new Date('2025-06-06'); // Fixed start date for current posts
  currentDate.setDate(currentDate.getDate() + dayCount);
  
  // Historical date: Starts at May 18, goes backward each day
  // Day 1: May 18, Day 2: May 17, Day 3: May 16, etc.
  const historicalDate = new Date('2025-05-18'); // Fixed start date for historical posts
  historicalDate.setDate(historicalDate.getDate() - dayCount);
  
  return { currentDate, historicalDate };
}

/**
 * Generate dual blog posts - current and historical
 */
async function generateDualBlogPosts() {
  console.log('🚀 Starting dual blog post generation...');
  console.log('============================================================');
  
  const dayCount = await getCampaignCounter();
  const { currentDate, historicalDate } = calculateDatesForCampaignDay(dayCount);
  
  console.log(`📅 Campaign Day: ${dayCount + 1}`);
  console.log(`📅 Current Date Post: ${currentDate.toDateString()}`);
  console.log(`📅 Historical Date Post: ${historicalDate.toDateString()}`);
  console.log('');
  
  const results = [];
  const selectedParkIds = new Set(); // Prevent duplicate parks in same run
  
  try {
    // Generate current date post
    console.log('1️⃣ Generating CURRENT DATE blog post...');
    console.log('─────────────────────────────────────────');
    
    const currentPark = await getNextParkForBlog();
    if (!currentPark) {
      throw new Error('No parks available for current date post');
    }
    
    selectedParkIds.add(currentPark.id);
    console.log(`✅ Selected current park: ${currentPark.name} (${currentPark.city}, ${currentPark.state})`);
    
    const currentPost = await generateCompleteBlogPost(currentPark, {
      publishDate: currentDate,
      topic: 'complete visitor guide',
      dateType: 'current'
    });
    
    results.push({
      type: 'current',
      date: currentDate,
      park: currentPark,
      post: currentPost
    });
    
    console.log(`✅ Current date post generated successfully`);
    console.log('');
    
    // Generate historical date post (different park)
    console.log('2️⃣ Generating HISTORICAL DATE blog post...');
    console.log('─────────────────────────────────────────');
    
    let historicalPark;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Ensure we get a different park than the current one
    do {
      historicalPark = await getNextParkForBlog();
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.log('⚠️ Could not find different park, using fallback selection');
        break;
      }
    } while (selectedParkIds.has(historicalPark?.id) && attempts < maxAttempts);
    
    if (!historicalPark) {
      throw new Error('No parks available for historical date post');
    }
    
    console.log(`✅ Selected historical park: ${historicalPark.name} (${historicalPark.city}, ${historicalPark.state})`);
    console.log(`📅 Publishing as: ${historicalDate.toDateString()}`);
    
    const historicalPost = await generateCompleteBlogPost(historicalPark, {
      publishDate: historicalDate,
      topic: 'complete visitor guide',
      dateType: 'historical'
    });
    
    results.push({
      type: 'historical',
      date: historicalDate,
      park: historicalPark,
      post: historicalPost
    });
    
    console.log(`✅ Historical date post generated successfully`);
    console.log('');
    
    // Summary
    console.log('🎉 DUAL GENERATION COMPLETE!');
    console.log('============================================================');
    console.log(`📝 Generated ${results.length} blog posts:`);
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.type.toUpperCase()}: ${result.park.name} (${result.date.toDateString()})`);
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Dual blog generation failed:', error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('📅 Daily Blog Generator - DUAL MODE');
  console.log('🌟 National Park Directory Blog Automation');
  console.log('==================================================');
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('');
  
  try {
    // Run health check first
    console.log('🏥 Running quick health check...');
    const healthCheck = await import('./health-check.js');
    const health = await healthCheck.runHealthCheck();
    
    if (!health.overall) {
      throw new Error('Health check failed - aborting blog generation');
    }
    console.log('');
    
    // Get initial stats
    const initialStats = await getBlogStats();
    console.log(`📊 System Status: ${initialStats.unbloggedParks} parks remaining`);
    console.log('');
    
    // Generate dual blog posts
    const results = await generateDualBlogPosts();
    
    // Increment counter for next run (ensures progression)
    const newDayCount = await incrementCampaignCounter();
    console.log(`✅ Campaign counter incremented to: ${newDayCount}`);
    console.log(`📅 Next run will be: Day ${newDayCount + 1}`);
    console.log('');
    
    // Final stats
    const finalStats = await getBlogStats();
    console.log('📊 FINAL STATISTICS:');
    console.log(`   - Posts Generated Today: ${results.length}`);
    console.log(`   - Total Blogs: ${finalStats.bloggedParks}`);
    console.log(`   - Remaining Parks: ${finalStats.unbloggedParks}`);
    console.log('');
    
    console.log('✅ Daily dual blog generation completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Daily dual blog generation failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateDualBlogPosts, getCampaignCounter, calculateDatesForCampaignDay }; 