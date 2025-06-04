/**
 * Park Data Integration for Blog Automation
 * 
 * This module safely reads from your existing park data without modifying
 * any existing files or interfering with your current setup.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { automationConfig } from '../config.js';

// Load environment variables
dotenv.config();

/**
 * Check what park data sources are available in the existing system
 */
export async function detectParkDataSources() {
  const sources = [];
  
  // Check for existing park data files
  const possibleSources = [
    { type: 'airtable-env', path: '.env', check: () => checkForAirtableCredentials() },
    { type: 'json-data', path: 'src/data/parks.json', check: () => fs.existsSync('src/data/parks.json') },
    { type: 'astro-integration', path: 'src/integrations', check: () => fs.existsSync('src/integrations') }
  ];
  
  for (const source of possibleSources) {
    try {
      if (await source.check()) {
        sources.push(source);
      }
    } catch (error) {
      console.log(`Could not check ${source.type}:`, error.message);
    }
  }
  
  return sources;
}

/**
 * Check if Airtable credentials exist (without exposing them)
 */
function checkForAirtableCredentials() {
  try {
    // Check if environment variables are loaded
    const token = process.env.AIRTABLE_TOKEN;
    const base = process.env.AIRTABLE_BASE_ID;
    
    console.log(`🔍 Checking Airtable credentials...`);
    console.log(`📊 AIRTABLE_TOKEN: ${token ? '✅ Found' : '❌ Missing'}`);
    console.log(`📊 AIRTABLE_BASE_ID: ${base ? '✅ Found' : '❌ Missing'}`);
    
    return !!(token && base);
  } catch {
    return false;
  }
}

/**
 * Safely get park data from your existing system
 * This is read-only and won't modify anything
 */
export async function getParkData() {
  try {
    // First, check if we can use existing integrations
    const sources = await detectParkDataSources();
    
    if (sources.find(s => s.type === 'airtable-env')) {
      console.log('📊 Using existing Airtable integration...');
      return await getParksFromAirtable();
    }
    
    if (sources.find(s => s.type === 'json-data')) {
      console.log('📊 Using existing JSON data...');
      return await getParksFromJSON();
    }
    
    // Fallback: create sample data for testing
    console.log('📊 No existing data source found, using sample data for testing...');
    return getSampleParkData();
    
  } catch (error) {
    console.error('Error getting park data:', error);
    return getSampleParkData();
  }
}

/**
 * Get parks from Airtable using direct API call
 */
async function getParksFromAirtable() {
  try {
    console.log('📊 Fetching all parks from Airtable using direct API...');
    
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'national-parks';
    
    if (!token || !baseId) {
      throw new Error('Missing Airtable credentials');
    }
    
    console.log(`📊 Using base: ${baseId}, table: ${tableName}`);
    
    // Build the API URL
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=100&sort[0][field]=Name&sort[0][direction]=asc`;
    
    console.log('📊 Making Airtable API request...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📊 Received ${data.records ? data.records.length : 0} records from Airtable`);
    
    if (!data.records || data.records.length === 0) {
      throw new Error('No records returned from Airtable');
    }
    
    // Parse the Airtable records into our format
    const parks = data.records.map(record => {
      const fields = record.fields;
      
      // Generate slug if it doesn't exist
      let slug = fields.Slug;
      if (!slug && fields.Name) {
        slug = fields.Name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
      
      // Extract images
      let images = [];
      if (fields['Wikimedia Images']) {
        if (Array.isArray(fields['Wikimedia Images'])) {
          images = fields['Wikimedia Images'];
        } else if (typeof fields['Wikimedia Images'] === 'string') {
          // Try to extract URLs from string
          const matches = fields['Wikimedia Images'].match(/(https?:\/\/[^\s"']+)/g);
          if (matches) {
            images = matches;
          }
        }
      }
      
      return {
        name: fields.Name || 'Unknown Park',
        slug: slug || 'unknown-park',
        type: fields.Designation || 'National Park',
        state: fields.States || 'Unknown',
        region: inferRegion(fields.States),
        description: fields.Description || '',
        images: images,
        activities: extractActivities(fields.Activities || ''),
        features: extractFeatures(fields.Topics || ''),
        historicalSignificance: !!(fields['Historical Significance']),
        
        // Additional metadata for blog generation
        metadata: {
          familyFriendly: checkFamilyFriendly(fields),
          photographySpots: checkPhotographySpots(fields),
          seasonalHighlights: extractSeasonalHighlights(fields),
          accessibility: checkAccessibility(fields),
          wildlife: extractWildlife(fields)
        }
      };
    });
    
    console.log(`📊 Successfully processed ${parks.length} parks from Airtable`);
    return parks;
    
  } catch (error) {
    console.log('⚠️ Could not use Airtable integration:', error.message);
    console.log('📊 Using sample park data instead...');
    return getSampleParkData();
  }
}

/**
 * Get parks from JSON file
 */
async function getParksFromJSON() {
  try {
    const jsonPath = 'src/data/parks.json';
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const parks = JSON.parse(rawData);
    return normalizeParkData(parks);
  } catch (error) {
    console.log('Could not read JSON data:', error.message);
    return getSampleParkData();
  }
}

/**
 * Normalize park data to consistent format for blog generation
 */
function normalizeParkData(rawParks) {
  const mapping = automationConfig.dataIntegration.fieldMappings;
  
  return rawParks.map(park => ({
    name: park[mapping.parkName] || park.name,
    slug: park[mapping.parkSlug] || generateSlug(park.name),
    type: park[mapping.parkType] || park.designation || 'National Park',
    state: park[mapping.state] || park.state,
    region: park[mapping.region] || inferRegion(park.state),
    description: park[mapping.description] || park.description || '',
    images: extractImages(park[mapping.images] || park.images || []),
    activities: extractActivities(park[mapping.activities] || park.activities || []),
    features: extractFeatures(park[mapping.features] || park.features || []),
    historicalSignificance: park[mapping.historicalSignificance] || false,
    
    // Additional metadata for blog generation
    metadata: {
      familyFriendly: checkFamilyFriendly(park),
      photographySpots: checkPhotographySpots(park),
      seasonalHighlights: extractSeasonalHighlights(park),
      accessibility: checkAccessibility(park),
      wildlife: extractWildlife(park)
    }
  }));
}

/**
 * Helper functions for data extraction
 */
function extractImages(images) {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') return [images];
  if (images && images.url) return [images.url];
  return [];
}

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Helper functions for processing Airtable data
 */
function inferRegion(states) {
  if (!states) return 'Unknown';
  
  const state = states.toLowerCase();
  const regionMap = {
    'california': 'West',
    'nevada': 'West',
    'oregon': 'West',
    'washington': 'West',
    'utah': 'West',
    'arizona': 'West',
    'colorado': 'West',
    'wyoming': 'West',
    'montana': 'West',
    'idaho': 'West',
    'alaska': 'West',
    'hawaii': 'West',
    'texas': 'South',
    'florida': 'South',
    'south carolina': 'South',
    'north carolina': 'South',
    'tennessee': 'South',
    'kentucky': 'South',
    'virginia': 'South',
    'west virginia': 'South',
    'arkansas': 'South',
    'maine': 'Northeast',
    'new york': 'Northeast',
    'massachusetts': 'Northeast',
    'ohio': 'Midwest',
    'michigan': 'Midwest',
    'minnesota': 'Midwest',
    'north dakota': 'Midwest',
    'south dakota': 'Midwest'
  };
  
  return regionMap[state] || 'Unknown';
}

function extractActivities(activitiesText) {
  if (!activitiesText) return [];
  
  // Handle both string and array inputs
  if (Array.isArray(activitiesText)) return activitiesText;
  if (typeof activitiesText === 'string') {
    // First try comma separation for simple lists
    if (activitiesText.includes(',')) {
      return activitiesText.split(',').map(a => a.trim());
    }
    
    // Then try intelligent keyword extraction
    const commonActivities = [
      'hiking', 'camping', 'wildlife viewing', 'photography', 'backpacking',
      'rock climbing', 'fishing', 'boating', 'swimming', 'scenic driving',
      'ranger programs', 'stargazing', 'bird watching', 'horseback riding'
    ];
    
    const activities = [];
    const text = activitiesText.toLowerCase();
    
    commonActivities.forEach(activity => {
      if (text.includes(activity)) {
        activities.push(activity);
      }
    });
    
    return activities.length > 0 ? activities : ['hiking', 'wildlife viewing', 'photography'];
  }
  
  return ['hiking', 'wildlife viewing', 'photography'];
}

function extractFeatures(topicsText) {
  if (!topicsText) return [];
  
  // Handle both string and array inputs
  if (Array.isArray(topicsText)) return topicsText;
  if (typeof topicsText === 'string') {
    // First try comma separation for simple lists
    if (topicsText.includes(',')) {
      return topicsText.split(',').map(f => f.trim());
    }
    
    // Then try intelligent keyword extraction
    const commonFeatures = [
      'geysers', 'hot springs', 'mountains', 'canyons', 'forests', 'lakes',
      'rivers', 'waterfalls', 'desert', 'glaciers', 'volcanic features',
      'rock formations', 'wildlife', 'historical sites', 'caves'
    ];
    
    const features = [];
    const text = topicsText.toLowerCase();
    
    commonFeatures.forEach(feature => {
      if (text.includes(feature) || text.includes(feature.slice(0, -1))) {
        features.push(feature);
      }
    });
    
    return features.length > 0 ? features : ['natural beauty', 'scenic landscapes'];
  }
  
  return ['natural beauty', 'scenic landscapes'];
}

function checkFamilyFriendly(fields) {
  const text = (fields.Activities || '').toLowerCase();
  return text.includes('family') || text.includes('children') || text.includes('kid');
}

function checkPhotographySpots(fields) {
  const text = (fields.Topics || '').toLowerCase();
  return text.includes('scenic') || text.includes('vista') || text.includes('photograph');
}

function extractSeasonalHighlights(fields) {
  return {
    spring: 'wildflowers and mild weather',
    summer: 'full access and warm temperatures',
    fall: 'changing colors and comfortable temperatures',
    winter: 'snow-covered landscapes and solitude'
  };
}

function checkAccessibility(fields) {
  const text = (fields.Activities || '').toLowerCase();
  return text.includes('accessible') || text.includes('wheelchair');
}

function extractWildlife(fields) {
  const text = (fields.Topics || '').toLowerCase();
  const wildlife = [];
  
  const animals = ['bear', 'elk', 'deer', 'bird', 'fish', 'bison', 'wolf', 'moose'];
  animals.forEach(animal => {
    if (text.includes(animal)) {
      wildlife.push(animal);
    }
  });
  
  return wildlife.length > 0 ? wildlife : ['various wildlife species'];
}

/**
 * Sample park data for testing when no existing data is available
 */
function getSampleParkData() {
  return [
    {
      name: 'Yellowstone National Park',
      slug: 'yellowstone-national-park',
      type: 'National Park',
      state: 'WY',
      region: 'Midwest',
      description: 'America\'s first national park, famous for geysers, hot springs, and wildlife.',
      images: ['/images/parks/yellowstone.jpg'],
      activities: ['hiking', 'wildlife viewing', 'photography', 'camping'],
      features: ['geysers', 'hot springs', 'wildlife', 'mountains'],
      historicalSignificance: true,
      metadata: {
        familyFriendly: true,
        photographySpots: true,
        seasonalHighlights: { spring: true, summer: true, fall: true, winter: true },
        accessibility: true,
        wildlife: ['bison', 'bear', 'elk']
      }
    },
    {
      name: 'Grand Canyon National Park',
      slug: 'grand-canyon-national-park',
      type: 'National Park',
      state: 'AZ',
      region: 'Southwest',
      description: 'One of the world\'s most spectacular natural wonders.',
      images: ['/images/parks/grand-canyon.jpg'],
      activities: ['hiking', 'photography', 'scenic drives', 'stargazing'],
      features: ['canyon', 'overlooks', 'desert', 'geology'],
      historicalSignificance: false,
      metadata: {
        familyFriendly: true,
        photographySpots: true,
        seasonalHighlights: { spring: true, summer: false, fall: true, winter: true },
        accessibility: true,
        wildlife: ['deer', 'birds']
      }
    }
  ];
}

export default {
  getParkData,
  detectParkDataSources,
  normalizeParkData
}; 