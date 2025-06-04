/**
 * AI Content Generator for Original Blog Posts
 * 
 * Uses AI to generate unique, original content for each blog post
 * while maintaining consistency with park information and templates
 */

import dotenv from 'dotenv';
import OpenAI from 'openai';
import { automationConfig } from '../config.js';

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
 * Generate original blog content using AI
 */
export async function generateAIContent(park, template, options = {}) {
  console.log(`🤖 Generating original AI content for ${park.name} using ${template.template.name} template...`);
  
  try {
    const ai = initializeOpenAI();
    
    // Build comprehensive prompt for original content
    const prompt = buildContentPrompt(park, template, options);
    
    // Generate the content using OpenAI
    const response = await ai.chat.completions.create({
      model: 'gpt-4', // Use GPT-4 for highest quality
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
      max_tokens: 4000,  // Allow for comprehensive content
      presence_penalty: 0.6, // Encourage original ideas
      frequency_penalty: 0.3  // Reduce repetitive language
    });
    
    const generatedContent = response.choices[0].message.content;
    
    // Parse and structure the AI response
    const structuredContent = parseAIResponse(generatedContent, park, template, options);
    
    console.log('✅ Original AI content generated successfully');
    return structuredContent;
    
  } catch (error) {
    console.error('❌ Error generating AI content:', error.message);
    
    // Graceful fallback to template-based content
    console.log('📝 Falling back to template-based content generation...');
    return generateFallbackContent(park, template, options);
  }
}

/**
 * Build system prompt for consistent, high-quality content
 */
function buildSystemPrompt() {
  return `You are an expert travel writer and national park specialist creating original, SEO-optimized blog content. Your writing should be:

ORIGINAL & UNIQUE:
- Create completely original content that doesn't duplicate existing articles
- Use fresh perspectives, unique insights, and personal storytelling approaches
- Vary sentence structure, vocabulary, and narrative flow significantly between posts
- Include specific, researched details that demonstrate expertise

SEO-OPTIMIZED:
- Write naturally while incorporating relevant keywords
- Use clear headings and subheadings for scannability  
- Include actionable advice and specific recommendations
- Write for both search engines and human readers

ENGAGING & AUTHORITATIVE:
- Use an enthusiastic but professional tone
- Include personal anecdotes and storytelling elements
- Balance practical information with inspirational content
- Demonstrate deep knowledge of national parks and outdoor recreation

CONTENT STRUCTURE:
Please provide your response in this exact format:

TITLE: [Compelling, unique title]

DESCRIPTION: [SEO-friendly meta description, 150-160 characters]

CONTENT:
[Full blog post content with proper markdown formatting]

TAGS: [8 relevant tags separated by commas]

Make each piece of content completely unique and original while following the provided template theme and park information.`;
}

/**
 * Build detailed prompt for specific content generation
 */
function buildContentPrompt(park, template, options = {}) {
  const season = options.season || 'current season';
  const author = options.author || automationConfig.userPreferences.authorName;
  
  return `Create an original, engaging blog post about ${park.name} using the "${template.template.name}" template approach.

PARK INFORMATION:
- Name: ${park.name}
- Type: ${park.type}
- State: ${park.state}
- Region: ${park.region}
- Description: ${park.description}
- Activities: ${park.activities.join(', ')}
- Features: ${park.features.join(', ')}
- Images Available: ${park.images.length > 0 ? 'Yes' : 'No'}

TEMPLATE THEME: ${template.template.description}

CONTENT REQUIREMENTS:
- Write 1000-1500 words of completely original content
- Focus on the ${template.template.name.toLowerCase()} angle for ${park.name}
- Include specific, actionable advice for visitors
- Write for the ${season} visiting season
- Target audience: National park enthusiasts and travelers
- Incorporate personal storytelling elements
- Use an engaging, enthusiastic but informative tone
- Include practical tips and insider knowledge
- Structure with clear headings and subheadings
- Make it SEO-friendly with natural keyword integration

IMPORTANT: Make this content completely unique and original. Don't repeat common information found in typical park guides. Instead, provide fresh insights, personal perspectives, and detailed expertise that demonstrates deep knowledge of ${park.name}.

The content should feel like it was written by an experienced park ranger or travel writer who has extensive personal experience at ${park.name} and wants to share genuine insights with fellow nature lovers.

Please generate the content now following the format specified in the system prompt.`;
}

/**
 * Parse AI response into structured content
 */
function parseAIResponse(aiResponse, park, template, options) {
  try {
    // Extract sections from AI response
    const sections = aiResponse.split('\n\n');
    let title = '';
    let description = '';
    let content = '';
    let tags = [];
    
    let currentSection = '';
    let contentStarted = false;
    
    for (const section of sections) {
      const trimmed = section.trim();
      
      if (trimmed.startsWith('TITLE:')) {
        title = trimmed.replace('TITLE:', '').trim();
      } else if (trimmed.startsWith('DESCRIPTION:')) {
        description = trimmed.replace('DESCRIPTION:', '').trim();
      } else if (trimmed.startsWith('CONTENT:')) {
        contentStarted = true;
        continue;
      } else if (trimmed.startsWith('TAGS:')) {
        const tagString = trimmed.replace('TAGS:', '').trim();
        tags = tagString.split(',').map(tag => tag.trim()).slice(0, 8);
      } else if (contentStarted && !trimmed.startsWith('TAGS:')) {
        content += section + '\n\n';
      }
    }
    
    // Fallback extraction if structured format wasn't followed
    if (!title || !content) {
      const lines = aiResponse.split('\n');
      title = lines.find(line => line.includes('#'))?.replace('#', '').trim() || 
              `Discovering ${park.name}: ${template.template.name}`;
      content = aiResponse;
      description = `Explore ${park.name} with our comprehensive ${template.template.name.toLowerCase()} guide.`;
      tags = [park.name, park.state, template.template.name.toLowerCase(), 'national parks'];
    }
    
    return {
      title: title.replace(/['"]/g, ''), // Clean quotes
      description: description.replace(/['"]/g, ''),
      content: content.trim(),
      tags: tags.length > 0 ? tags : [
        park.name,
        park.state,
        template.template.name.toLowerCase(),
        'national parks',
        'travel guide',
        'outdoor recreation'
      ],
      generatedBy: 'AI',
      model: 'gpt-4'
    };
    
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return generateFallbackContent(park, template, options);
  }
}

/**
 * Fallback to template-based content if AI fails
 */
function generateFallbackContent(park, template, options) {
  console.log('📝 Using template-based fallback content generation...');
  
  return {
    title: template.generateTitle(park, options),
    description: template.generateDescription(park, options),
    content: template.generateContent(park, options),
    tags: template.generateTags(park, options),
    generatedBy: 'Template',
    model: 'fallback'
  };
}

/**
 * Generate multiple content variations for A/B testing
 */
export async function generateContentVariations(park, template, options = {}, count = 3) {
  console.log(`🎯 Generating ${count} content variations for ${park.name}...`);
  
  const variations = [];
  
  for (let i = 0; i < count; i++) {
    const variationOptions = {
      ...options,
      variation: i + 1,
      temperature: 0.7 + (i * 0.1) // Vary creativity slightly
    };
    
    const content = await generateAIContent(park, template, variationOptions);
    variations.push({
      ...content,
      variationNumber: i + 1
    });
  }
  
  return variations;
}

/**
 * Test AI connection and capabilities
 */
export async function testAIConnection() {
  try {
    console.log('🔍 Testing AI connection...');
    
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

export default {
  generateAIContent,
  generateContentVariations,
  testAIConnection
}; 