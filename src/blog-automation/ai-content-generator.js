/**
 * AI Content Generator for Blog Automation
 * 
 * Generates high-quality, SEO-optimized blog posts using OpenAI GPT-4
 * with strict adherence to user requirements for content structure and SEO
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
let openai = null;

function initializeOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

/**
 * Generate a complete blog post for a national park
 * 
 * @param {Object} park - Park data from Airtable
 * @param {Object} options - Generation options
 * @returns {Object} Generated blog content
 */
export async function generateBlogPost(park, options = {}) {
  console.log(`🤖 Generating AI blog post for ${park.name}...`);
  
  try {
    const ai = initializeOpenAI();
    
    // Build comprehensive prompt for SEO-optimized content
    const prompt = buildBlogPrompt(park, options);
    
    console.log('📝 Sending request to OpenAI GPT-4...');
    
    // Generate the content using OpenAI GPT-4
    const response = await ai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9, // Higher creativity for more varied content
      max_tokens: 8000,  // Increased significantly for longer content
      presence_penalty: 0.7, // Encourage more original ideas and topics
      frequency_penalty: 0.4  // Reduce repetitive language more aggressively
    });
    
    const generatedContent = response.choices[0].message.content;
    
    // Parse and structure the AI response
    const structuredContent = parseAIResponse(generatedContent, park, options);
    
    console.log('✅ Blog post generated successfully');
    console.log(`   - Title: ${structuredContent.title}`);
    console.log(`   - Word count: ~${structuredContent.content.split(' ').length} words`);
    console.log(`   - Meta description: ${structuredContent.description.length} characters`);
    
    return structuredContent;
    
  } catch (error) {
    console.error('❌ Error generating blog post:', error.message);
    throw error;
  }
}

/**
 * Build system prompt for consistent, high-quality content generation
 */
function buildSystemPrompt() {
  return `You are an expert travel writer and national park specialist creating comprehensive, SEO-optimized blog content. Your writing must follow these EXACT requirements:

CRITICAL WORD COUNT REQUIREMENTS:
- MINIMUM 600 words - NEVER write less than 600 words
- MAXIMUM 1200 words  
- VARY the length: sometimes 650 words, sometimes 900 words, sometimes 1100 words
- Word count is CRITICAL - if you write less than 600 words, the content will be rejected
- Count your words as you write and ensure you meet the minimum

CONTENT QUALITY REQUIREMENTS:
- Write completely original, unique content with deep expertise
- Include extensive practical advice and specific recommendations  
- Write comprehensive, detailed content that provides exceptional value
- Add insider tips and local knowledge that shows you know the park intimately
- Include specific details about trails, viewpoints, facilities, and experiences
- Write with engaging, enthusiastic but professional tone
- Create content so detailed and helpful that visitors could plan their entire trip from your guide

SEO REQUIREMENTS (CRITICAL):
- Park name must appear in title and naturally throughout content (8-12 times)
- City and state must appear in title and be mentioned in first, middle, and last paragraphs  
- Use primary keyword pattern: "Visit [park name] in [city], [state]" naturally
- Include related long-tail keywords throughout the content
- Create meta description 150-160 characters with park name and location
- Include compelling 1-2 sentence excerpt for social media previews

TITLE CREATIVITY (IMPORTANT - VARY THESE PATTERNS):
Create varied, engaging titles using different patterns each time:
- "Discover [Park Name]: A Complete Guide to [City], [State]"
- "[Park Name] Adventures: Your [City], [State] Travel Guide"  
- "Exploring [Park Name]: Hidden Gems in [City], [State]"
- "[Park Name] Unveiled: [City], [State]'s Natural Wonder"
- "Journey to [Park Name]: [City], [State]'s Must-See Destination"
- "[Park Name] Experience: [City], [State] Adventure Guide"
- "Secrets of [Park Name]: Your [City], [State] Explorer's Guide"
- "[Park Name] Mastery: [City], [State] Insider's Guide"
- "Into the Wild: [Park Name], [City], [State]"
- "[Park Name] Deep Dive: [City], [State] Nature Guide"

AVOID these overused patterns completely:
- "Ultimate Guide to..." 
- "The Ultimate..."
- "Complete Guide to..."
- Use creative, engaging alternatives instead

MANDATORY CONTENT STRUCTURE (To ensure 600+ words):
Your response MUST follow this exact format:

TITLE: [Creative, varied title with park name, city, and state]

DESCRIPTION: [Meta description 150-160 characters with park name and location]

EXCERPT: [1-2 compelling sentences summarizing the blog topic for social media]

CONTENT:
[Full blog post content with markdown formatting - MUST be 600-1200 words]

REQUIRED SECTIONS (each section must be detailed and comprehensive):
## Introduction: [Creative Hook Name] (150-250 words)
- Engaging opening that immediately captures attention
- Location context and why this park is special
- What readers will discover in this comprehensive guide
- Include primary keyword naturally

## [Historical/Cultural/Geological] Significance: [Creative Section Name] (200-300 words) 
- Deep dive into the park's background, formation, or cultural importance
- Interesting facts and stories that most visitors don't know
- Connection to broader regional or national significance
- Specific details that show expertise

## Top Activities & Attractions: [Creative Section Name] (250-350 words)
- Detailed descriptions of 5-8 specific activities
- Difficulty levels, time requirements, what to expect
- Best spots for different interests (families, photographers, hikers, nature lovers)
- Insider tips for getting the most out of each activity
- Specific trail names, viewpoint locations, facility details

## Practical Visitor Information: [Creative Section Name] (150-250 words)
- Detailed hours, entrance fees, best times to visit
- Seasonal considerations and weather tips
- What to bring, parking information, accessibility notes
- Reservation requirements, permits needed
- Visitor center amenities and services

## Tips for Different Types of Visitors (200-300 words)
- Families with children: specific recommendations and safety tips
- Photography enthusiasts: best viewpoints, lighting conditions, equipment tips
- Hikers and adventurers: trail recommendations, difficulty levels, hidden gems
- First-time visitors: essential experiences not to miss
- Accessibility information for visitors with mobility needs

## Beyond the Park: [Regional Attractions/Accommodations] (100-200 words)
- Nearby attractions, restaurants, and accommodations
- Regional context and other things to do in the area
- Travel logistics and planning tips
- Connection to other parks or attractions in the region

## Conclusion: [Creative Call-to-Action Name] (100-150 words)
- Compelling summary of why this park is worth visiting
- Inspirational call-to-action encouraging readers to plan their visit
- Include location (city, state) one final time
- End with memorable, inspiring final thought

TAGS: [8 specific, relevant tags including park name, state, and varied activities]

ABSOLUTE REQUIREMENTS:
1. Content MUST be 600-1200 words - count as you write
2. Include specific, actionable details throughout 
3. Write as if you've personally visited and know every trail, viewpoint, and secret spot
4. Vary section lengths to create natural reading flow
5. Include numbers, specific names, and concrete details
6. Make every paragraph valuable and informative
7. NEVER use generic travel advice - everything must be park-specific
8. End word count should be clearly 600+ words when complete`;
}

/**
 * Build detailed prompt for specific park content generation
 */
function buildBlogPrompt(park, options = {}) {
  const topic = options.topic || 'complete visitor guide';
  const season = options.season || 'year-round';
  
  // Build primary keyword
  const primaryKeyword = `Visit ${park.name} in ${park.city}, ${park.state}`;
  
  // Extract image info for content ideas
  const imageCount = park.images.length;
  const hasImages = imageCount > 0;
  
  // Build activity suggestions from park data
  const activities = park.activities.length > 0 ? park.activities.join(', ') : 'hiking, sightseeing, photography';
  const features = park.features.length > 0 ? park.features.join(', ') : 'natural beauty, outdoor recreation';
  
  return `Create an SEO-optimized, comprehensive blog post about ${park.name} for the topic: "${topic}".

CRITICAL WORD COUNT REQUIREMENT: 
- The blog post content MUST be between 600-1200 words
- NEVER write less than 600 words - this is absolutely essential
- Vary the length: aim for ${Math.floor(Math.random() * 600) + 600} words for this post
- Count your words as you write to ensure you meet the minimum

PARK INFORMATION:
- Name: ${park.name}
- Location: ${park.city}, ${park.state}
- Description: ${park.description}
- Available Activities: ${activities}
- Key Features: ${features}
- Images Available: ${hasImages ? `Yes (${imageCount} images)` : 'No'}
- Season Focus: ${season}

PRIMARY KEYWORD: "${primaryKeyword}"
CONTENT THEME: ${topic}

MANDATORY DETAILED REQUIREMENTS:
1. Write 600-1200 words of original, comprehensive content (MINIMUM 600 words - count as you write)
2. Include "${primaryKeyword}" naturally in the content (8-12 times)
3. Mention ${park.city} and ${park.state} in introduction, middle sections, and conclusion
4. Include extensive, specific, actionable advice for visitors
5. Write for travelers who want a complete, expert-level guide to ${park.name}
6. Include detailed practical tips, insider knowledge, and specific recommendations
7. Use compelling headers and subheaders (minimum 6 main sections as outlined in system prompt)
8. Make it feel like expert travel advice from someone who has extensively explored ${park.name}
9. Include specific details about facilities, trails, viewpoints, timing, and logistics
10. Add unique insights that distinguish this from generic travel content

CONTENT DEPTH REQUIREMENTS (to ensure 600+ words):
- Introduction with location context and compelling hook (150-250 words)
- Historical/cultural/geological background with specific details (200-300 words)
- Comprehensive activities guide with specific recommendations (250-350 words)
- Detailed practical visitor information with insider tips (150-250 words)
- Specialized advice for different visitor types (200-300 words)
- Regional context and nearby attractions (100-200 words)
- Inspiring conclusion with specific call-to-action (100-150 words)

SPECIFIC CONTENT TO INCLUDE:
- Exact trail names, distances, and difficulty levels where applicable
- Specific viewpoint locations and what makes them special
- Detailed facility information (visitor centers, restrooms, parking, accessibility)
- Seasonal considerations and best times for different activities
- What to bring and how to prepare for visits
- Photography tips with specific locations and timing
- Family-friendly activities with age recommendations
- Safety considerations and important regulations
- Nearby dining, lodging, and other attractions
- Transportation and parking details
- Permit or reservation requirements
- Hidden gems and lesser-known features
- Local wildlife and plant life visitors might encounter
- Historical anecdotes and interesting facts
- Tips for avoiding crowds and finding solitude

LONG-TAIL KEYWORDS TO INCLUDE NATURALLY:
- "things to do at ${park.name}"
- "best time to visit ${park.name}"
- "${park.name} hiking trails" (if applicable)
- "${park.name} photography spots" (if applicable)  
- "visiting ${park.name} with family" (if appropriate)
- "${park.name} entrance fees"
- "${park.name} visitor center"
- "${park.name} camping" (if applicable)
- "how to get to ${park.name}"
- "${park.name} wildlife viewing"

REMEMBER: 
- The content must be comprehensive, detailed, and expert-level
- Write as if you're creating the most complete guide to ${park.name} available online
- Include specific details, practical advice, and insider tips that show deep knowledge
- The final content MUST be at least 600 words - count your words to verify
- Vary your writing to keep readers engaged throughout the entire piece
- Make every sentence valuable and informative for potential visitors`;
}

/**
 * Parse AI response into structured blog content
 */
function parseAIResponse(aiResponse, park, options) {
  console.log('🔍 Parsing AI response into structured format...');
  
  try {
    const sections = aiResponse.split('\n\n');
    let title = '';
    let description = '';
    let excerpt = '';
    let content = '';
    let tags = [];
    
    let contentStarted = false;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (section.startsWith('TITLE:')) {
        title = section.replace('TITLE:', '').trim();
      } else if (section.startsWith('DESCRIPTION:')) {
        description = section.replace('DESCRIPTION:', '').trim();
      } else if (section.startsWith('EXCERPT:')) {
        excerpt = section.replace('EXCERPT:', '').trim();
      } else if (section.startsWith('CONTENT:')) {
        contentStarted = true;
        continue;
      } else if (section.startsWith('TAGS:')) {
        const tagString = section.replace('TAGS:', '').trim();
        tags = tagString.split(',').map(tag => tag.trim()).slice(0, 8);
        break; // Stop processing after tags
      } else if (contentStarted && !section.startsWith('TAGS:')) {
        content += section + '\n\n';
      }
    }
    
    // Fallback extraction if structured format wasn't perfectly followed
    if (!title || !content) {
      console.log('⚠️ AI response format not perfect, applying fallback parsing...');
      
      // Try to extract title from headers
      const lines = aiResponse.split('\n');
      for (const line of lines) {
        if (line.startsWith('#') && !title) {
          title = line.replace(/#/g, '').trim();
          break;
        }
      }
      
      // Use full response as content if no CONTENT: section found
      if (!content) {
        content = aiResponse;
      }
      
      // Generate fallbacks
      if (!title) {
        title = `Discover ${park.name}: Your Complete Guide to ${park.city}, ${park.state}`;
      }
      if (!description) {
        description = `Explore ${park.name} in ${park.city}, ${park.state} with our comprehensive visitor guide featuring activities, tips, and local insights.`;
      }
      if (!excerpt) {
        excerpt = `Discover everything you need to know about visiting ${park.name} in ${park.city}, ${park.state}.`;
      }
    }
    
    // Ensure tags include essential elements
    if (tags.length === 0) {
      tags = [
        park.name,
        park.state,
        'National Parks',
        'Travel Guide',
        park.city,
        'Outdoor Recreation',
        'Family Travel',
        'Adventure'
      ];
    }
    
    // Clean up content
    content = content.trim();
    
    // Validate content length
    const wordCount = content.split(' ').length;
    if (wordCount < 500) {
      console.log(`⚠️ Content seems short (${wordCount} words), but proceeding...`);
    }
    
    // Validate description length
    if (description.length > 160) {
      console.log(`⚠️ Meta description too long (${description.length} chars), truncating...`);
      description = description.substring(0, 157) + '...';
    }
    
    return {
      title: title.replace(/['"]/g, ''), // Clean quotes
      description: description.replace(/['"]/g, ''),
      excerpt: excerpt.replace(/['"]/g, ''),
      content: content,
      tags: tags,
      wordCount: wordCount,
      topic: options.topic || 'visitor-guide',
      generatedBy: 'AI',
      model: 'gpt-4',
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Test AI connection and capabilities
 */
export async function testAIConnection() {
  try {
    console.log('🧪 Testing AI connection...');
    
    const ai = initializeOpenAI();
    
    const response = await ai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Write a brief test response confirming you can generate travel content. Respond with exactly: "AI content generation is working correctly for national park blog posts."'
        }
      ],
      max_tokens: 50
    });
    
    const result = response.choices[0].message.content.trim();
    console.log('✅ AI Response:', result);
    
    return {
      success: true,
      message: result,
      model: 'gpt-4'
    };
    
  } catch (error) {
    console.error('❌ AI connection test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a blog post file name from title and park
 */
export function generateBlogFileName(title, park) {
  // Create URL-friendly slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Add date prefix for uniqueness
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `${date}-${slug}.md`;
}

export default {
  generateBlogPost,
  testAIConnection,
  generateBlogFileName
}; 