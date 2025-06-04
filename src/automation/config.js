/**
 * Blog Automation Configuration
 * 
 * This configuration is completely separate from your existing site setup
 * and only controls the automated blog post generation system.
 */

export const automationConfig = {
  // Content Generation Settings
  content: {
    // Minimum and maximum word counts for generated posts
    minWordCount: 800,
    maxWordCount: 1500,
    
    // Template rotation settings
    avoidRecentTemplates: 3, // Don't repeat templates for 3 posts
    templateWeights: {
      'seasonal-spotlight': 1.2,    // Slightly favor seasonal content
      'hidden-gems': 1.0,
      'historical-deep-dive': 0.8,  // Less frequent for heavy content
      'wildlife-encounters': 1.1,
      'adventure-planning': 1.0,
      'photography-focus': 1.2,     // Popular topic
      'family-fun': 1.0,
      'geological-wonders': 0.7,    // Less frequent for technical content
      'cultural-heritage': 0.9,
      'accessibility-spotlight': 0.8
    }
  },

  // Park Selection Settings  
  parkSelection: {
    // Avoid recently featured parks
    recentParkAvoidance: 30, // Days to avoid repeating parks
    
    // Geographic distribution preferences
    regionRotation: {
      enabled: true,
      regions: ['West', 'East', 'Southwest', 'Midwest', 'Southeast', 'Alaska', 'Hawaii'],
      maxConsecutiveFromSameRegion: 2
    },
    
    // Park type distribution
    typeRotation: {
      enabled: true,
      types: ['National Park', 'National Monument', 'National Historic Site', 
              'National Seashore', 'National Recreation Area'],
      balanceAcrossTypes: true
    },
    
    // Seasonal preferences (auto-adapts based on current date)
    seasonalAdaptation: {
      enabled: true,
      spring: ['wildflowers', 'waterfalls', 'mild_weather'],
      summer: ['camping', 'hiking', 'family_activities', 'water_activities'],
      fall: ['foliage', 'photography', 'cooler_weather'],
      winter: ['snow_activities', 'solitude', 'winter_wildlife']
    }
  },

  // Automation Schedule
  schedule: {
    frequency: 'daily', // 'daily', 'weekdays', 'custom'
    timeOfDay: '06:00', // When to generate (if automated)
    requireApproval: true, // Set to false for full automation
    previewMode: true // Generate files but don't auto-commit
  },

  // File Paths (relative to project root)
  paths: {
    // Where blog posts are created (existing blog content directory)
    blogContentDir: 'src/content/blog',
    
    // Where automation tracks its state (separate from existing system)
    trackingDir: 'src/automation/data',
    
    // Template directory
    templatesDir: 'src/automation/content-templates',
    
    // Generated images directory (if needed)
    generatedImagesDir: 'public/images/blog-automation'
  },

  // Integration with existing park data
  dataIntegration: {
    // Your existing park data source
    parkDataSource: 'airtable', // Could be 'airtable', 'json', 'api'
    
    // Field mappings for your existing data structure
    fieldMappings: {
      parkName: 'name',
      parkSlug: 'slug', 
      parkType: 'designation',
      state: 'states',
      region: 'region', // Will be inferred from states
      description: 'description',
      images: 'wikimediaImages',
      activities: 'activities',
      features: 'topics', // Using topics as features
      historicalSignificance: 'historicalSignificance' // Will be computed
    }
  },

  // Quality Control
  qualityControl: {
    enabled: true,
    checks: {
      wordCount: true,
      imagePresence: true,
      tagGeneration: true,
      duplicateContent: true,
      readabilityScore: false // Can add later
    }
  },

  // User Preferences (can be overridden)
  userPreferences: {
    preferredTemplates: [], // Empty = use all templates
    avoidedTemplates: [], // Templates to skip
    preferredRegions: [], // Empty = use all regions
    customInstructions: '', // Additional instructions for content generation
    authorName: 'National Park Directory Team' // Default author
  }
};

/**
 * Get current season based on date
 */
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';  
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

/**
 * Safe path resolution to prevent conflicts with existing files
 */
export function getAutomationPath(relativePath) {
  return `src/automation/${relativePath}`;
}

/**
 * Validation function to ensure config doesn't interfere with existing setup
 */
export function validateConfig() {
  const issues = [];
  
  // Check that we're only writing to safe directories
  const safePaths = [
    'src/content/blog',           // Existing blog content (safe to add)
    'src/automation',             // Our automation system
    'scripts/blog-automation',    // Our scripts
    'public/images/blog-automation' // Our generated images
  ];
  
  // Verify all paths are safe
  Object.values(automationConfig.paths).forEach(path => {
    const isSafe = safePaths.some(safePath => path.includes(safePath));
    if (!isSafe) {
      issues.push(`Unsafe path detected: ${path}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

export default automationConfig; 