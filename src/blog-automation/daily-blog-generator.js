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
import { listBlogFiles } from './file-generator.js';

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
    return data;
  } catch (error) {
    // File doesn't exist, start at 0
    return { dayCount: 0, lastHistoricalDate: null };
  }
}

/**
 * Increment and save the campaign counter
 */
async function incrementCampaignCounter(newHistoricalDate) {
  try {
    let data = await getCampaignCounter();
    data.dayCount = (data.dayCount || 0) + 1;
    data.lastRun = new Date().toISOString();
    data.totalRuns = data.dayCount;
    if (newHistoricalDate) {
      data.lastHistoricalDate = newHistoricalDate.toISOString();
    }
    await fs.writeFile(COUNTER_FILE, JSON.stringify(data, null, 2));
    return data.dayCount;
  } catch (error) {
    console.error('❌ Error updating campaign counter:', error);
    return 1; // Fallback to day 1
  }
}

/**
 * Helper to extract date from blog filename (YYYY-MM-DD-...)
 */
function extractDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (match) {
    return new Date(match[1]);
  }
  return null;
}

/**
 * Dynamically determine the oldest blog post date from existing files
 */
async function getOldestBlogDate() {
  const files = await listBlogFiles();
  let oldest = null;
  for (const file of files) {
    const date = extractDateFromFilename(file);
    if (date && (!oldest || date < oldest)) {
      oldest = date;
    }
  }
  return oldest || new Date(); // fallback to today if no files
}

/**
 * New function to get the next historical date
 */
async function getNextHistoricalDate() {
  const counter = await getCampaignCounter();
  if (counter.lastHistoricalDate) {
    // Use the last used historical date and decrement by one day
    const lastDate = new Date(counter.lastHistoricalDate);
    lastDate.setDate(lastDate.getDate() - 1);
    return lastDate;
  } else {
    // Use the oldest blog date minus one day
    const oldestBlogDate = await getOldestBlogDate();
    const nextDate = new Date(oldestBlogDate);
    nextDate.setDate(nextDate.getDate() - 1);
    return nextDate;
  }
}

/**
 * Calculate current and historical dates dynamically
 * Current date: Use today's actual date
 * Historical date: Work backwards from oldest existing blog post
 */
async function calculateDatesForCampaignDay() {
  const currentDate = new Date();
  const historicalDate = await getNextHistoricalDate();
  return { currentDate, historicalDate };
}

/**
 * Generate dual blog posts - current and historical
 */
async function generateDualBlogPosts() {
  console.log('🚀 Starting dual blog post generation...');
  console.log('============================================================');
  
  const counter = await getCampaignCounter();
  const { currentDate, historicalDate } = await calculateDatesForCampaignDay();
  
  console.log(`📅 Campaign Day: ${(counter.dayCount || 0) + 1}`);
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
    
    // After successful generation, update the counter with the new historical date
    await incrementCampaignCounter(historicalDate);
    
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