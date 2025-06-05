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
      temperature: 0.8, // High creativity while maintaining coherence
      max_tokens: 6000,  // Increased to allow for comprehensive 800-1200 word content
      presence_penalty: 0.6, // Encourage original ideas
      frequency_penalty: 0.3  // Reduce repetitive language
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
  return `You are an expert travel writer and national park specialist creating SEO-optimized blog content. Your writing must follow these EXACT requirements:

CONTENT REQUIREMENTS:
- Write EXACTLY 800-1200 words (this is CRITICAL - do not write less)
- Create completely original, unique content
- Use engaging, enthusiastic but professional tone
- Include practical advice and specific recommendations
- Write comprehensive, detailed content that provides real value

SEO REQUIREMENTS (CRITICAL):
- Park name must appear in title and naturally throughout content
- City and state must appear in title and be mentioned in first and last paragraphs  
- Use primary keyword pattern: "Visit [park name] in [city], [state]"
- Include related long-tail keywords naturally
- Create meta description under 160 characters
- Include 1-2 sentence excerpt for previews

TITLE CREATIVITY (IMPORTANT):
Create varied, engaging titles using different patterns:
- "Discover [Park Name]: A Complete Guide to [City], [State]"
- "[Park Name] Adventures: Your [City], [State] Travel Guide"
- "Exploring [Park Name]: Hidden Gems in [City], [State]"
- "[Park Name] Unveiled: [City], [State]'s Natural Wonder"
- "Journey to [Park Name]: [City], [State]'s Must-See Destination"
- "[Park Name] Experience: [City], [State] Adventure Guide"
- "Secrets of [Park Name]: Your [City], [State] Explorer's Guide"

AVOID these overused patterns:
- "Ultimate Guide to..."
- "The Ultimate..."
- "Complete Guide to..."
- Use creative, engaging alternatives instead

CONTENT STRUCTURE:
Your response MUST follow this exact format:

TITLE: [Creative, varied title with park name, city, and state]

DESCRIPTION: [Meta description 150-160 characters with park name and location]

EXCERPT: [1-2 sentences summarizing the blog topic]

CONTENT:
[Full blog post content with markdown formatting - MUST be 800-1200 words]
- Use ## for main headers (at least 4-5 sections)
- Use ### for subheaders  
- Include specific activities, tips, and recommendations
- Add detailed practical information (hours, fees, best times to visit)
- Mention nearby attractions when relevant
- Include comprehensive visitor information
- Add insider tips and local knowledge
- End with compelling call-to-action

TAGS: [8 relevant tags including park name, state, and activities]

IMPORTANT: 
- The content MUST be 800-1200 words - this is non-negotiable
- Make content completely unique and engaging
- Avoid generic travel advice
- Include specific details that show expertise about this particular park
- Write as if you've personally visited and know the park intimately
- VARY your title patterns - be creative and avoid repetition`;
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
  
  return `Create an SEO-optimized blog post about ${park.name} for the topic: "${topic}".

CRITICAL REQUIREMENT: The blog post content MUST be 800-1200 words. This is absolutely essential. Do not write less than 800 words.

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

DETAILED REQUIREMENTS:
1. Write 800-1200 words of original, engaging content (MINIMUM 800 words)
2. Include "${primaryKeyword}" naturally in the content
3. Mention ${park.city} and ${park.state} in first and last paragraphs
4. Include specific, actionable advice for visitors
5. Write for travelers interested in national parks
6. Include practical tips and insider knowledge
7. Use compelling headers and subheaders (at least 5 main sections)
8. Make it feel like expert travel advice from someone who knows ${park.name}

CONTENT SECTIONS TO INCLUDE (to reach 800+ words):
- Introduction with location and overview (150-200 words)
- Historical/Cultural significance (150-200 words)
- Top activities and attractions (200-250 words)
- Practical visitor information (hours, fees, best times) (100-150 words)
- Tips for different types of visitors (families, hikers, photographers) (150-200 words)
- Nearby attractions and accommodations (100-150 words)
- Conclusion with call-to-action (50-100 words)

LONG-TAIL KEYWORDS TO INCLUDE NATURALLY:
- "things to do at ${park.name}"
- "best time to visit ${park.name}"
- "${park.name} hiking trails" (if applicable)
- "${park.name} photography spots" (if applicable)
- "visiting ${park.name} with family" (if appropriate)
- "${park.name} entrance fees"
- "${park.name} visitor center"

REMEMBER: The content must be comprehensive and detailed. Write as if you're creating the definitive guide to ${park.name}. Include specific details, practical advice, and insider tips that show deep knowledge of the park. The final content MUST be at least 800 words.`;
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