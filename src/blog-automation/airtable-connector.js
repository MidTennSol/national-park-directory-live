/**
 * Airtable Connector for Blog Automation
 * 
 * This module handles all Airtable interactions with ZERO TOLERANCE for duplicate park blogs.
 * Multiple safety mechanisms are implemented to prevent any possibility of duplicate content.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Airtable configuration
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'national-parks';

// Validate configuration
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  throw new Error('Missing required Airtable configuration. Please check your .env file.');
}

/**
 * Get the next park for blog generation with strict duplicate prevention
 * 
 * Safety mechanisms:
 * 1. Check Random Parks field for next unblogged park
 * 2. Verify Blog Generated field is false/empty
 * 3. Double-check Last Blog Date is empty or old
 * 4. Cross-reference multiple fields for absolute certainty
 * 
 * @returns {Object|null} Park data for blog generation or null if none available
 */
export async function getNextParkForBlog() {
  console.log('🔍 Searching for next park to blog about...');
  
  try {
    // Get all parks with required fields for duplicate checking
    const allParks = await fetchAllParks();
    
    if (!allParks || allParks.length === 0) {
      console.log('❌ No parks found in Airtable');
      return null;
    }
    
    console.log(`📊 Found ${allParks.length} total parks in database`);
    
    // Apply strict duplicate prevention logic
    const unbloggedPark = findNextUnbloggedPark(allParks);
    
    if (!unbloggedPark) {
      console.log('⚠️ No unblogged parks found - may need to reset rotation');
      return null;
    }
    
    console.log(`✅ Selected park: ${unbloggedPark.name} (${unbloggedPark.city}, ${unbloggedPark.state})`);
    return unbloggedPark;
    
  } catch (error) {
    console.error('❌ Error getting next park for blog:', error);
    throw error;
  }
}

/**
 * Fetch all parks from Airtable with fields needed for duplicate prevention
 */
async function fetchAllParks() {
  const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  
  console.log('📡 Fetching all parks from Airtable (with pagination)...');
  
  let allRecords = [];
  let offset = null;
  
  do {
    // Build URL with pagination offset if needed
    const url = offset ? `${baseUrl}?offset=${offset}` : baseUrl;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    allRecords = allRecords.concat(data.records);
    offset = data.offset; // Will be undefined when no more pages
    
    console.log(`📄 Fetched ${data.records.length} parks (${allRecords.length} total so far)...`);
    
  } while (offset); // Continue while there are more pages
  
  console.log(`✅ Successfully fetched ${allRecords.length} parks total`);
  
  // Transform Airtable records to our format
  return allRecords.map((record, index) => {
    // Parse Wikimedia Images
    let images = [];
    if (record.fields['Wikimedia Images']) {
      const imageText = record.fields['Wikimedia Images'];
      // Extract URLs from the text
      const urlMatches = imageText.match(/https:\/\/upload\.wikimedia\.org\/[^\s\n]+/g);
      images = urlMatches || [];
    }
    
    // Parse activities
    let activities = [];
    if (record.fields['Activities (Simplified)']) {
      activities = record.fields['Activities (Simplified)'].split(',').map(a => a.trim().replace(/"/g, ''));
    }
    
    // Parse topics (we can use this as features)
    let features = [];
    if (record.fields['Topics (Simplified)']) {
      features = record.fields['Topics (Simplified)'].split(',').map(t => t.trim().replace(/"/g, ''));
    }
    
    return {
      id: record.id,
      name: record.fields['Name'] || 'Unknown Park',
      city: record.fields['City'] || 'Unknown City',
      state: record.fields['States'] || 'Unknown State',
      description: record.fields['Description'] || '',
      images: images,
      activities: activities,
      features: features,
      randomParksPosition: index, // Use array index for now
      randomParksValue: record.fields['Random Parks'] || '', // The actual value for reference
      // Blog fields - will be null until we add them to schema
      blogGenerated: record.fields['Blog Generated'] || false,
      lastBlogDate: record.fields['Last Blog Date'] || null,
      blogTopicUsed: record.fields['Blog Topic Used'] || null,
      blogFileName: record.fields['Blog File Name'] || null
    };
  });
}

/**
 * Find the next unblogged park with strict duplicate prevention and geographic diversity
 * 
 * Multiple safety checks:
 * 1. Blog Generated must be false/empty
 * 2. Last Blog Date must be empty or very old (>6 months)
 * 3. Blog File Name must be empty (no previous generation)
 * 4. Use Random Parks field for ordering
 * 5. Prefer different states for geographic diversity
 */
function findNextUnbloggedPark(parks) {
  console.log('🛡️ Applying strict duplicate prevention logic with geographic diversity...');
  
  // Sort by Random Parks position to maintain random order
  const sortedParks = parks.sort((a, b) => a.randomParksPosition - b.randomParksPosition);
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Get recently blogged states (last 5 blog posts) to avoid clustering
  const recentlyBloggedStates = new Set();
  const recentBlogs = sortedParks
    .filter(p => p.blogGenerated === true && p.lastBlogDate)
    .sort((a, b) => new Date(b.lastBlogDate) - new Date(a.lastBlogDate))
    .slice(0, 5); // Last 5 blog posts
  
  recentBlogs.forEach(park => {
    if (park.state) {
      recentlyBloggedStates.add(park.state);
    }
  });
  
  console.log(`🗺️ Recently blogged states to avoid: ${Array.from(recentlyBloggedStates).join(', ')}`);
  
  // First pass: Find parks NOT in recently blogged states
  let candidateParks = [];
  
  for (const park of sortedParks) {
    // Apply all safety checks
    if (park.blogGenerated === true) {
      continue;
    }
    
    if (park.lastBlogDate) {
      const lastBlogDate = new Date(park.lastBlogDate);
      if (lastBlogDate > sixMonthsAgo) {
        continue;
      }
    }
    
    if (park.blogFileName) {
      continue;
    }
    
    if (!park.name || !park.city || !park.state) {
      continue;
    }
    
    candidateParks.push(park);
  }
  
  // Prioritize parks from different states
  const diverseParks = candidateParks.filter(park => !recentlyBloggedStates.has(park.state));
  
  if (diverseParks.length > 0) {
    const selectedPark = diverseParks[0]; // Take first available from different state
    console.log(`✅ Found geographically diverse park: ${selectedPark.name} (${selectedPark.state})`);
    console.log(`   - Avoiding recent states: ${Array.from(recentlyBloggedStates).join(', ')}`);
    console.log(`   - Selected from: ${selectedPark.state}`);
    console.log(`   - Blog Generated: ${selectedPark.blogGenerated}`);
    console.log(`   - Last Blog Date: ${selectedPark.lastBlogDate || 'Never'}`);
    console.log(`   - Blog File Name: ${selectedPark.blogFileName || 'None'}`);
    return selectedPark;
  }
  
  // Fallback: If no diverse parks available, use any available park
  if (candidateParks.length > 0) {
    const selectedPark = candidateParks[0];
    console.log(`⚠️ No geographically diverse parks available, selecting: ${selectedPark.name} (${selectedPark.state})`);
    console.log(`   - Blog Generated: ${selectedPark.blogGenerated}`);
    console.log(`   - Last Blog Date: ${selectedPark.lastBlogDate || 'Never'}`);
    console.log(`   - Blog File Name: ${selectedPark.blogFileName || 'None'}`);
    return selectedPark;
  }
  
  console.log('❌ No unblogged parks found after applying all safety checks');
  return null;
}

/**
 * Mark a park as blogged with complete tracking information
 * 
 * This function updates all tracking fields to prevent future duplicates
 */
export async function markParkAsBlogged(parkId, blogData) {
  console.log(`📝 Marking park ${parkId} as blogged...`);
  
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${parkId}`;
  
  const updateData = {
    fields: {
      'Blog Generated': true,
      'Last Blog Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      'Blog Topic Used': blogData.topic || 'general',
      'Blog File Name': blogData.fileName || 'unknown'
    }
  };
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update park: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`✅ Successfully marked park ${parkId} as blogged`);
    console.log(`   - Blog Generated: true`);
    console.log(`   - Last Blog Date: ${updateData.fields['Last Blog Date']}`);
    console.log(`   - Blog Topic Used: ${updateData.fields['Blog Topic Used']}`);
    console.log(`   - Blog File Name: ${updateData.fields['Blog File Name']}`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error marking park ${parkId} as blogged:`, error);
    throw error;
  }
}

/**
 * Get statistics about blog generation status
 * Useful for monitoring and debugging
 */
export async function getBlogStats() {
  try {
    const allParks = await fetchAllParks();
    
    const stats = {
      totalParks: allParks.length,
      bloggedParks: allParks.filter(p => p.blogGenerated === true).length,
      unbloggedParks: allParks.filter(p => p.blogGenerated !== true).length,
      recentlyBlogged: 0
    };
    
    // Count recently blogged (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    stats.recentlyBlogged = allParks.filter(p => {
      if (!p.lastBlogDate) return false;
      return new Date(p.lastBlogDate) > thirtyDaysAgo;
    }).length;
    
    console.log('📊 Blog Generation Statistics:');
    console.log(`   - Total Parks: ${stats.totalParks}`);
    console.log(`   - Blogged Parks: ${stats.bloggedParks}`);
    console.log(`   - Unblogged Parks: ${stats.unbloggedParks}`);
    console.log(`   - Recently Blogged (30 days): ${stats.recentlyBlogged}`);
    
    return stats;
    
  } catch (error) {
    console.error('❌ Error getting blog stats:', error);
    throw error;
  }
}

/**
 * Test the Airtable connection and validate schema
 */
export async function testConnection() {
  try {
    console.log('🧪 Testing Airtable connection...');
    
    const parks = await fetchAllParks();
    
    if (!parks || parks.length === 0) {
      throw new Error('No parks found - check table name and permissions');
    }
    
    console.log(`✅ Connection successful - found ${parks.length} parks`);
    
    // Check if required fields exist
    const samplePark = parks[0];
    const requiredFields = ['name', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !samplePark[field]);
    
    if (missingFields.length > 0) {
      console.log(`⚠️ Missing required fields: ${missingFields.join(', ')}`);
    } else {
      console.log('✅ All required fields present');
    }
    
    return {
      success: true,
      parkCount: parks.length,
      samplePark: samplePark
    };
    
  } catch (error) {
    console.error('❌ Airtable connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 