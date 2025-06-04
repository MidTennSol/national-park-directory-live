/**
 * Main Blog Generator for Automated Daily Posts
 * 
 * This is the core automation engine that creates blog posts using AI
 * and park data. It safely adds new content without modifying existing files.
 */

import fs from 'fs';
import path from 'path';
import { automationConfig, getCurrentSeason, validateConfig } from './config.js';
import { getParkData } from './utils/park-data-integration.js';
import { generateAIContent, testAIConnection } from './utils/ai-content-generator.js';

// Import all available content templates (used for guidance and fallback)
import * as seasonalSpotlightModule from './content-templates/seasonal-spotlight.js';
import * as hiddenGemsModule from './content-templates/hidden-gems.js';
import * as historicalDeepDiveModule from './content-templates/historical-deep-dive.js';
import * as wildlifeEncountersModule from './content-templates/wildlife-encounters.js';
import * as adventurePlanningModule from './content-templates/adventure-planning.js';
import * as photographyFocusModule from './content-templates/photography-focus.js';
import * as familyFunModule from './content-templates/family-fun.js';
import * as geologicalWondersModule from './content-templates/geological-wonders.js';
import * as culturalHeritageModule from './content-templates/cultural-heritage.js';
import * as accessibilitySpotlightModule from './content-templates/accessibility-spotlight.js';

// Template registry
const AVAILABLE_TEMPLATES = {
  'seasonal-spotlight': seasonalSpotlightModule,
  'hidden-gems': hiddenGemsModule,
  'historical-deep-dive': historicalDeepDiveModule,
  'wildlife-encounters': wildlifeEncountersModule,
  'adventure-planning': adventurePlanningModule,
  'photography-focus': photographyFocusModule,
  'family-fun': familyFunModule,
  'geological-wonders': geologicalWondersModule,
  'cultural-heritage': culturalHeritageModule,
  'accessibility-spotlight': accessibilitySpotlightModule
};

/**
 * Main blog generation function
 */
export async function generateBlogPost(options = {}) {
  console.log('🤖 Starting AI-powered blog post generation...');
  
  try {
    // Validate configuration first
    const configValidation = validateConfig();
    if (!configValidation.isValid) {
      throw new Error(`Configuration validation failed: ${configValidation.issues.join(', ')}`);
    }
    
    // Test AI connection if enabled
    if (!options.skipAITest) {
      console.log('🔍 Testing AI connection...');
      const aiTest = await testAIConnection();
      if (!aiTest.success) {
        console.log('⚠️ AI connection failed, will use template fallback');
        console.log(`Error: ${aiTest.error}`);
      } else {
        console.log('✅ AI connection successful');
      }
    }
    
    // Get park data
    console.log('📊 Loading park data...');
    const parks = await getParkData();
    
    if (!parks || parks.length === 0) {
      throw new Error('No park data available');
    }
    
    // Select park for today's post
    console.log('🎯 Selecting park for blog post...');
    const selectedPark = await selectParkForPost(parks, options);
    
    // Select appropriate template for guidance
    console.log('📝 Selecting content template for guidance...');
    const selectedTemplate = selectTemplate(selectedPark, options);
    
    // Generate content using AI (with template fallback)
    console.log('✨ Generating AI-powered blog content...');
    const blogContent = await generateContent(selectedPark, selectedTemplate, options);
    
    // Create blog post file
    console.log('💾 Creating blog post file...');
    const filePath = await createBlogPostFile(blogContent, options);
    
    console.log('✅ AI-powered blog post generated successfully!');
    return {
      success: true,
      park: selectedPark.name,
      template: selectedTemplate.template.name,
      title: blogContent.title,
      filePath: filePath,
      generatedBy: blogContent.generatedBy || 'AI',
      model: blogContent.model || 'gpt-4',
      previewMode: options.previewMode || automationConfig.schedule.previewMode
    };
    
  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Select a park for today's blog post
 */
async function selectParkForPost(parks, options = {}) {
  // If park is manually specified
  if (options.parkSlug) {
    const manualPark = parks.find(p => p.slug === options.parkSlug);
    if (manualPark) {
      console.log(`🎯 Using manually selected park: ${manualPark.name}`);
      return manualPark;
    }
    console.log(`⚠️ Manual park "${options.parkSlug}" not found, using algorithm`);
  }
  
  // Get recently featured parks to avoid repetition
  const recentlyFeatured = await getRecentlyFeaturedParks();
  
  // Filter out recently featured parks
  const availableParks = parks.filter(park => 
    !recentlyFeatured.includes(park.slug)
  );
  
  if (availableParks.length === 0) {
    console.log('⚠️ All parks recently featured, resetting rotation');
    return selectParkByAlgorithm(parks, options);
  }
  
  return selectParkByAlgorithm(availableParks, options);
}

/**
 * Smart park selection algorithm
 */
function selectParkByAlgorithm(parks, options = {}) {
  const config = automationConfig.parkSelection;
  const currentSeason = getCurrentSeason();
  
  // Score each park based on various criteria
  const scoredParks = parks.map(park => {
    let score = 1.0;
    
    // Seasonal relevance scoring
    if (config.seasonalAdaptation.enabled) {
      const seasonalFeatures = config.seasonalAdaptation[currentSeason] || [];
      const parkText = JSON.stringify(park).toLowerCase();
      
      seasonalFeatures.forEach(feature => {
        if (parkText.includes(feature.replace('_', ' '))) {
          score += 0.3;
        }
      });
    }
    
    // Geographic distribution scoring
    if (config.regionRotation.enabled) {
      const recentRegions = getRecentRegions();
      if (!recentRegions.includes(park.region)) {
        score += 0.2;
      }
    }
    
    // Park type diversity scoring
    if (config.typeRotation.enabled) {
      const recentTypes = getRecentParkTypes();
      if (!recentTypes.includes(park.type)) {
        score += 0.2;
      }
    }
    
    // Add some randomness to prevent predictability
    score += Math.random() * 0.3;
    
    return { park, score };
  });
  
  // Sort by score and select the top candidate
  scoredParks.sort((a, b) => b.score - a.score);
  
  const selectedPark = scoredParks[0].park;
  console.log(`🎯 Selected ${selectedPark.name} (${selectedPark.region}, ${selectedPark.type})`);
  
  return selectedPark;
}

/**
 * Select appropriate template for guidance
 */
function selectTemplate(park, options = {}) {
  // If template is manually specified
  if (options.templateId && AVAILABLE_TEMPLATES[options.templateId]) {
    console.log(`📝 Using manually selected template: ${options.templateId}`);
    return AVAILABLE_TEMPLATES[options.templateId];
  }
  
  // Get available templates that are suitable for this park
  const suitableTemplates = Object.values(AVAILABLE_TEMPLATES).filter(template => {
    return isTemplateSuitable(template, park);
  });
  
  if (suitableTemplates.length === 0) {
    console.log('⚠️ No suitable templates found, using seasonal-spotlight');
    return AVAILABLE_TEMPLATES['seasonal-spotlight'];
  }
  
  // Select template based on weights and recent usage
  const recentTemplates = getRecentTemplates();
  const weightedTemplates = suitableTemplates.map(templateModule => {
    let weight = templateModule.template.weight || 1.0;
    
    // Reduce weight if recently used
    if (recentTemplates.includes(templateModule.template.id)) {
      weight *= 0.5;
    }
    
    return { templateModule, weight };
  });
  
  // Weighted random selection
  const totalWeight = weightedTemplates.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of weightedTemplates) {
    random -= item.weight;
    if (random <= 0) {
      console.log(`📝 Selected template: ${item.templateModule.template.name}`);
      return item.templateModule;
    }
  }
  
  // Fallback
  return suitableTemplates[0];
}

/**
 * Check if a template is suitable for a park
 */
function isTemplateSuitable(templateModule, park) {
  const suitability = templateModule.template?.suitability;
  
  if (!suitability) return true;
  
  // Check park type requirements
  if (suitability.parkTypes && !suitability.parkTypes.includes(park.type)) {
    return false;
  }
  
  // Check seasonal requirements
  const currentSeason = getCurrentSeason();
  if (suitability.preferredSeasons && !suitability.preferredSeasons.includes(currentSeason)) {
    return false;
  }
  
  // Check feature requirements
  if (suitability.minimumFeatures && park.features.length < suitability.minimumFeatures) {
    return false;
  }
  
  return true;
}

/**
 * Generate blog content using AI (with template fallback)
 */
async function generateContent(park, templateModule, options = {}) {
  const generationOptions = {
    season: options.season || getCurrentSeason(),
    useAI: options.useAI !== false, // Default to true unless explicitly disabled
    ...options
  };
  
  // Try AI generation first (if enabled)
  if (generationOptions.useAI) {
    try {
      const aiContent = await generateAIContent(park, templateModule, generationOptions);
      if (aiContent && aiContent.title && aiContent.content) {
        // Add template metadata for tracking
        return {
          ...aiContent,
          template: templateModule.template.id,
          author: options.author || automationConfig.userPreferences.authorName,
          publishDate: options.publishDate || new Date(),
          park: park.name
        };
      }
    } catch (error) {
      console.log('⚠️ AI generation failed, falling back to template...');
      console.log(`Error: ${error.message}`);
    }
  }
  
  // Fallback to template-based generation
  console.log('📝 Using template-based content generation...');
  const title = templateModule.generateTitle(park, generationOptions);
  const description = templateModule.generateDescription(park, generationOptions);
  const content = templateModule.generateContent(park, generationOptions);
  const tags = templateModule.generateTags(park, generationOptions);
  
  // Select best image for the post
  const image = selectBestImage(park, templateModule, generationOptions);
  
  return {
    title,
    description,
    content,
    tags: tags.slice(0, 8), // Limit to 8 tags
    image,
    author: options.author || automationConfig.userPreferences.authorName,
    publishDate: options.publishDate || new Date(),
    park: park.name,
    template: templateModule.template.id,
    generatedBy: 'Template',
    model: 'fallback'
  };
}

/**
 * Select the best image for the blog post
 */
function selectBestImage(park, templateModule, options = {}) {
  if (!park.images || park.images.length === 0) {
    return '/images/park-placeholder.svg'; // Fallback to existing placeholder
  }
  
  // For now, select the first available image
  // Later we can add smarter selection based on template type
  return park.images[0];
}

/**
 * Generate a unique slug for the blog post
 */
function generatePostSlug(title, park) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Ensure uniqueness by checking existing files
  const blogDir = automationConfig.paths.blogContentDir;
  let finalSlug = baseSlug;
  let counter = 1;
  
  while (fs.existsSync(path.join(blogDir, `${finalSlug}.md`))) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
}

/**
 * Create the blog post markdown file
 */
async function createBlogPostFile(blogContent, options = {}) {
  const blogDir = automationConfig.paths.blogContentDir;
  
  // Ensure directory exists
  if (!fs.existsSync(blogDir)) {
    throw new Error(`Blog content directory does not exist: ${blogDir}`);
  }
  
  // Generate slug if not provided
  if (!blogContent.slug) {
    blogContent.slug = generatePostSlug(blogContent.title, blogContent.park);
  }
  
  // Create frontmatter
  const frontmatterData = createFrontmatter(blogContent, blogContent.park, blogContent.template, options);
  const frontmatter = formatFrontmatter(frontmatterData);
  
  // Combine frontmatter and content
  const fullContent = `---\n${frontmatter}\n---\n\n${blogContent.content}`;
  
  // Write file
  const fileName = `${blogContent.slug}.md`;
  const filePath = path.join(blogDir, fileName);
  
  fs.writeFileSync(filePath, fullContent, 'utf8');
  
  // Track this post for future reference
  await trackGeneratedPost(blogContent);
  
  console.log(`📝 Blog post written to: ${filePath}`);
  return filePath;
}

/**
 * Create the blog post frontmatter
 */
function createFrontmatter(generatedContent, park, template, options = {}) {
  const publishDate = new Date().toISOString().split('T')[0];
  const author = options.author || automationConfig.userPreferences.authorName;
  
  // Get the primary image from park data if available
  let imageUrl = null;
  if (park.images && park.images.length > 0) {
    imageUrl = park.images[0];
  }
  
  const frontmatter = {
    title: generatedContent.title,
    description: generatedContent.description,
    publishDate: publishDate,
    author: author,
    tags: generatedContent.tags,
    featured: false,
    draft: false,
    generatedBy: generatedContent.generatedBy || 'AI',
    aiModel: generatedContent.model || 'gpt-4'
  };
  
  // Only add image field if we have a valid image URL
  if (imageUrl && imageUrl !== 'undefined' && imageUrl.startsWith('http') && imageUrl.includes('upload.wikimedia.org')) {
    frontmatter.image = imageUrl;
  }
  
  return frontmatter;
}

/**
 * Track generated posts for rotation and analytics
 */
async function trackGeneratedPost(blogContent) {
  const trackingDir = automationConfig.paths.trackingDir;
  
  // Ensure tracking directory exists
  if (!fs.existsSync(trackingDir)) {
    fs.mkdirSync(trackingDir, { recursive: true });
  }
  
  // Update tracking files
  const trackingData = {
    date: new Date().toISOString(),
    park: blogContent.park,
    template: blogContent.template,
    slug: blogContent.slug,
    title: blogContent.title,
    generatedBy: blogContent.generatedBy || 'AI',
    model: blogContent.model || 'unknown'
  };
  
  // Append to history file
  const historyFile = path.join(trackingDir, 'generation-history.json');
  let history = [];
  
  if (fs.existsSync(historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    } catch (error) {
      console.log('⚠️ Could not read history file, starting fresh');
    }
  }
  
  history.push(trackingData);
  
  // Keep only last 100 entries
  if (history.length > 100) {
    history = history.slice(-100);
  }
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

/**
 * Helper functions for tracking recent activity
 */
async function getRecentlyFeaturedParks() {
  const trackingFile = path.join(automationConfig.paths.trackingDir, 'generation-history.json');
  
  if (!fs.existsSync(trackingFile)) {
    return [];
  }
  
  try {
    const history = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - automationConfig.parkSelection.recentParkAvoidance);
    
    return history
      .filter(entry => new Date(entry.date) > cutoffDate)
      .map(entry => entry.park);
  } catch {
    return [];
  }
}

function getRecentRegions() {
  // Placeholder - implement based on tracking data
  return [];
}

function getRecentParkTypes() {
  // Placeholder - implement based on tracking data
  return [];
}

function getRecentTemplates() {
  // Placeholder - implement based on tracking data
  return [];
}

/**
 * Preview function to see what would be generated
 */
export async function previewBlogPost(options = {}) {
  console.log('👀 Generating AI-powered blog post preview...');
  
  const result = await generateBlogPost({
    ...options,
    previewMode: true
  });
  
  if (result.success) {
    console.log('\n📋 PREVIEW:');
    console.log(`🏞️ Park: ${result.park}`);
    console.log(`📝 Template: ${result.template}`);
    console.log(`📰 Title: ${result.title}`);
    console.log(`🤖 Generated by: ${result.generatedBy} (${result.model})`);
    console.log(`📁 Would be saved to: ${result.filePath}`);
  }
  
  return result;
}

/**
 * Test AI capabilities
 */
export async function testAI() {
  console.log('🧪 Testing AI content generation capabilities...');
  return await testAIConnection();
}

/**
 * Format frontmatter as YAML
 */
function formatFrontmatter(frontmatter) {
  const formatValue = (value) => {
    if (typeof value === 'string') {
      // Special handling for dates - don't quote them
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }
      // Escape quotes and wrap in quotes if needed
      if (value.includes('"') || value.includes("'") || value.includes(':')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return `"${value}"`;
    }
    if (Array.isArray(value)) {
      return `[${value.map(item => `"${item}"`).join(', ')}]`;
    }
    return value;
  };
  
  return Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join('\n');
}

export default {
  generateBlogPost,
  previewBlogPost,
  testAI,
  AVAILABLE_TEMPLATES
}; 