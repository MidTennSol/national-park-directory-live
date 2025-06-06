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
      max_tokens: 6000,  // Reduced to fit within GPT-4's 8192 token limit (8192 - 1808 prompt tokens = ~6384 available)
      presence_penalty: 0.7, // Encourage more original ideas and topics
      frequency_penalty: 0.4  // Reduce repetitive language more aggressively
    });
    
    const generatedContent = response.choices[0].message.content;
    
    // Parse and structure the AI response
    const structuredContent = parseAIResponse(generatedContent, park, options);
    
    // Validate content length to ensure quality
    const wordCount = structuredContent.content.split(' ').length;
    console.log('✅ Blog post generated successfully');
    console.log(`   - Title: ${structuredContent.title}`);
    console.log(`   - Word count: ${wordCount} words`);
    console.log(`   - Meta description: ${structuredContent.description.length} characters`);
    
    // Warning if content is shorter than expected
    if (wordCount < 1000) {
      console.log(`⚠️ Warning: Content is only ${wordCount} words (minimum 1000 expected)`);
    }
    
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
  return `You are a professional travel writer for National Geographic. You MUST write comprehensive, detailed blog posts that are AT LEAST 1200 words. 

CRITICAL: Look at this SUCCESSFUL EXAMPLE of the quality expected:
- Title: "Waco Mammoth National Monument Mastery: Waco, Texas Insiders Guide"
- Word count: 1500+ words
- Detailed sections with specific information
- Comprehensive practical advice
- Multiple paragraphs per section

YOU MUST MATCH OR EXCEED THIS QUALITY AND LENGTH.

ABSOLUTE REQUIREMENTS:
- MINIMUM 1200 words (count as you write)
- Write EXACTLY like the Waco Mammoth example
- Include extensive specific details in every paragraph
- Never write generic advice - everything must be park-specific
- Each section must be multiple paragraphs with detailed information

STRUCTURE REQUIREMENTS:
Write these sections with MINIMUM word counts:

## Introduction (300+ words)
Write a compelling 300+ word introduction that:
- Uses vivid, descriptive language to set the scene
- Explains what makes this park unique and special
- Provides historical or geological context
- Includes the exact location and regional significance
- Previews what visitors will discover in this comprehensive guide
- Uses the primary keyword naturally 2-3 times

## Historical/Cultural/Geological Background (400+ words)  
Write 400+ words covering:
- Detailed formation story or historical significance
- Specific dates, names, and historical events
- Geological processes or cultural importance
- Connection to broader regional or national context
- Interesting facts most visitors never learn
- Multiple detailed paragraphs with rich information

## Comprehensive Activities Guide (450+ words)
Write 450+ words covering:
- 8-12 specific activities with detailed descriptions
- Exact trail names, distances, and difficulty levels
- Specific timing: "this hike takes 2-3 hours"
- Equipment needed and skill requirements
- Best viewpoints with specific directions
- Photography opportunities with timing advice
- Hidden gems and insider spots
- Activities for different fitness levels
- Seasonal variations and availability

## Essential Visitor Information (300+ words)
Write 300+ words covering:
- Detailed hours, entrance fees, and reservation requirements
- Comprehensive seasonal considerations
- Specific parking information: locations, costs, busy times
- What to bring: detailed packing lists for different seasons
- Visitor center amenities and services
- Accessibility information
- Cell service and emergency information
- Permits or passes required

## Personalized Tips for Different Visitors (400+ words)
Write 400+ words covering:
- Families with children: specific activities and safety tips
- Photography enthusiasts: exact locations and lighting advice
- Hikers: challenging trails and skill requirements
- First-time visitors: must-see attractions and time management
- Accessibility needs: detailed mobility information
- Senior visitors: comfortable activities and amenities
- Seasonal considerations: spring, summer, fall, winter

## Regional Context and Beyond (250+ words)
Write 250+ words covering:
- Nearby attractions with specific recommendations
- Regional travel logistics and drive times
- Cultural attractions and local experiences
- Connection to other parks in the area
- Accommodation and dining recommendations
- Local events and festivals

## Conclusion (150+ words)
Write 150+ words:
- Inspiring summary of why this park deserves a visit
- Emotional connection to the visitor experience
- Practical next steps for planning
- Final location mention
- Memorable closing thought

CRITICAL EXECUTION RULES:
1. Count your words as you write - you MUST exceed 1200 words total
2. Write multiple detailed paragraphs for each section
3. Include specific names, numbers, distances, and concrete details
4. Use vivid, descriptive language throughout
5. Make every sentence informative and valuable
6. Include the park name and location naturally throughout
7. Write with the expertise of someone who has spent extensive time at the park
8. Never use filler content - every word must add value

REMEMBER: You are writing the DEFINITIVE guide that visitors will use to plan their entire trip. Make it comprehensive, detailed, and authoritative.`;
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
  
  // Target word count (varying between 1100-1400)
  const targetWordCount = Math.floor(Math.random() * 300) + 1100;
  
  return `WRITE A COMPREHENSIVE 1200+ WORD BLOG POST about ${park.name} in ${park.city}, ${park.state}.

USE THIS SUCCESSFUL EXAMPLE AS YOUR TEMPLATE:
"Waco Mammoth National Monument Mastery: Waco, Texas Insiders Guide" - 1500+ words of detailed, comprehensive content.

YOU MUST WRITE EXACTLY LIKE THAT EXAMPLE:
- Target: ${targetWordCount} words minimum (NEVER LESS THAN 1200 words)
- Multiple detailed paragraphs per section
- Specific trail names, distances, timing, and practical details
- Historical context with dates and names
- Comprehensive visitor information
- Regional context and nearby attractions

WRITE THESE EXACT SECTIONS:

**TITLE:** Create a compelling SEO title that avoids formulaic patterns. Examples: "[Park Name] Discovery: [City], [State] Adventure Guide" or "Exploring [Park Name]: [City], [State] Hidden Treasures" or "[Park Name] Unveiled: [City], [State] Natural Wonder" (DO NOT use "Complete Visitor Experience" or "Ultimate Guide")

**DESCRIPTION:** Meta description (150-160 characters) with park name and location

**EXCERPT:** 1-2 sentences for social sharing

**CONTENT:** (MUST BE ${targetWordCount}+ WORDS)

## Discover [Creative Descriptive Name] 
Write 300+ words covering:
- Vivid opening that captures the park's essence
- What makes ${park.name} special and unique
- Location context: ${park.city}, ${park.state}
- Preview of the comprehensive guide
- Historical or geological significance
- Use "Visit ${park.name} in ${park.city}, ${park.state}" naturally

## [Historical/Geological/Cultural] Heritage: [Creative Name]
Write 400+ words covering:
- Detailed formation story or historical significance
- Specific dates, names, and events
- Connection to broader regional context
- Interesting facts visitors don't know
- Multiple detailed paragraphs

## Adventures & Experiences: [Creative Name based on park features]
Write 450+ words covering:
- 8-12 specific activities with detailed descriptions
- Trail names, distances, difficulty levels
- "This trail takes 2-3 hours" type specifics
- Best viewpoints and photo spots
- Equipment needed and skill requirements
- Hidden gems and insider tips
- Seasonal activity variations

## Visitor Information: [Creative Name]
Write 300+ words covering:
- Hours, fees, reservation requirements
- Parking details (locations, costs, busy times)
- What to bring for different seasons
- Visitor center amenities
- Accessibility information
- Cell service and emergency info

## Tips for Different Visitors: [Creative Name]
Write 400+ words covering:
- Families with children (activities, safety)
- Photographers (best spots, lighting, equipment)
- Hikers (challenging trails, skill levels)
- First-time visitors (must-sees, time management)
- Accessibility needs (mobility assistance)
- Seasonal considerations (spring, summer, fall, winter)

## Beyond the Park: [Creative Name]
Write 250+ words covering:
- Nearby attractions and recommendations
- Regional travel logistics
- Dining and accommodation options
- Drive times to other parks
- Local events and festivals

## Final Thoughts: [Creative Name]
Write 150+ words:
- Why ${park.name} deserves a visit
- Emotional connection to the experience
- Next steps for planning
- Final mention of ${park.city}, ${park.state}
- Inspiring closing thought

**FAQS:** You MUST generate exactly 5 frequently asked questions with detailed answers. This section is REQUIRED and cannot be skipped. Format EXACTLY as shown:

FAQ: What are the operating hours and admission fees for ${park.name}?
ANSWER: [Write a detailed 2-3 sentence answer based on typical national park information]

FAQ: How long should I plan for a visit to ${park.name}?
ANSWER: [Write a detailed 2-3 sentence answer suggesting visit duration based on activities]

FAQ: What should I bring when visiting ${park.name}?
ANSWER: [Write a detailed 2-3 sentence answer with specific items for this park's activities]

FAQ: What is the best time to visit ${park.name}?
ANSWER: [Write a detailed 2-3 sentence answer about seasonal considerations]

FAQ: Is ${park.name} accessible for visitors with mobility needs?
ANSWER: [Write a detailed 2-3 sentence answer about accessibility features]

CRITICAL: You MUST write actual detailed answers for each FAQ. Do not leave placeholders. Do not skip this section. Always include all 5 FAQs with complete answers.

**TAGS:** 8 relevant tags including ${park.name}, ${park.state}, activities

CRITICAL REQUIREMENTS:
- COUNT YOUR WORDS - must exceed ${targetWordCount} words
- Use specific details: trail names, distances, times, costs
- Write multiple paragraphs per section
- Include ${park.name} naturally throughout (12-15 times)
- Use vivid, descriptive language
- Make every sentence valuable and informative
- Write as an expert who knows every corner of ${park.name}
- TITLE must be compelling and SEO-friendly (NOT starting with "Introduction")

PARK DETAILS TO INCLUDE:
- Location: ${park.city}, ${park.state}
- Activities: ${activities}
- Features: ${features}
- Description: ${park.description}

WRITE EXACTLY ${targetWordCount}+ WORDS. This is NON-NEGOTIABLE.`;
}

/**
 * Parse FAQ content from AI response
 */
function parseFAQContent(faqContent) {
  const faqs = [];
  
  try {
    console.log('🔍 Raw FAQ content received:', faqContent.substring(0, 200) + '...');
    
    // Split by FAQ: or similar patterns  
    const faqSections = faqContent.split(/(?:^|\n)(?:FAQ:|Q:|Question:)/i);
    
    console.log(`📝 Found ${faqSections.length - 1} potential FAQ sections`);
    
    for (let i = 1; i < faqSections.length; i++) { // Skip first empty section
      const section = faqSections[i].trim();
      console.log(`   Processing section ${i}: ${section.substring(0, 100)}...`);
      
      // Look for ANSWER: pattern to separate question and answer
      const answerMatch = section.match(/^(.*?)\s*(?:ANSWER:|A:|Answer:)\s*(.*?)$/is);
      
      if (answerMatch) {
        let question = answerMatch[1].trim();
        const answer = answerMatch[2].trim();
        
        // Clean up question - remove any remaining formatting
        question = question.replace(/^\*\*|\*\*$/g, '').trim();
        if (!question.endsWith('?')) {
          question += '?';
        }
        
        // Clean up answer - remove formatting and section breaks
        const cleanAnswer = answer
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/^TAGS:.*$/gm, '')
          .replace(/\n\n\n+/g, '\n\n')
          .trim()
          .split('\n\n')[0]; // Take only the first paragraph to avoid pulling in other sections
        
        if (question.length > 10 && cleanAnswer.length > 20) { // Basic validation
          faqs.push({
            question: question,
            answer: cleanAnswer
          });
          console.log(`   ✅ Added FAQ: ${question.substring(0, 50)}...`);
        } else {
          console.log(`   ⚠️ Skipped short FAQ: Q=${question.length} chars, A=${cleanAnswer.length} chars`);
        }
      } else {
        console.log(`   ⚠️ No ANSWER: pattern found in section ${i}`);
      }
    }
    
    console.log(`✅ Successfully parsed ${faqs.length} FAQs from AI response`);
    return faqs;
    
  } catch (error) {
    console.error('⚠️ Error parsing FAQ content:', error);
    console.error('FAQ content that failed:', faqContent);
    return [];
  }
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
    let faqs = [];
    
    let contentStarted = false;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (section.startsWith('TITLE:') || section.startsWith('**TITLE:**')) {
        title = section.replace(/^\*\*TITLE:\*\*\s*/i, '').replace(/^TITLE:\s*/i, '').trim();
      } else if (section.startsWith('DESCRIPTION:') || section.startsWith('**DESCRIPTION:**')) {
        description = section.replace(/^\*\*DESCRIPTION:\*\*\s*/i, '').replace(/^DESCRIPTION:\s*/i, '').trim();
      } else if (section.startsWith('EXCERPT:') || section.startsWith('**EXCERPT:**')) {
        excerpt = section.replace(/^\*\*EXCERPT:\*\*\s*/i, '').replace(/^EXCERPT:\s*/i, '').trim();
      } else if (section.startsWith('CONTENT:')) {
        contentStarted = true;
        continue;
      } else if (section.toLowerCase().includes('faq') && (section.startsWith('FAQS:') || section.startsWith('**FAQS:**') || section.match(/^\*\*FAQ/i))) {
        // Extract FAQ content - be more flexible with FAQ section detection
        let faqContent = section.replace(/^\*\*FAQS?:\*\*\s*/i, '').replace(/^FAQS?:\s*/i, '').trim();
        
        // If the FAQ section doesn't have content, look for it in subsequent sections
        if (faqContent.length < 50) {
          console.log('⚠️ FAQ section appears empty, searching for FAQ content in remaining sections...');
          for (let j = i + 1; j < sections.length; j++) {
            const nextSection = sections[j].trim();
            if (nextSection.toLowerCase().includes('faq:') || nextSection.toLowerCase().includes('question:')) {
              faqContent += '\n\n' + nextSection;
            } else if (nextSection.startsWith('TAGS:')) {
              break; // Stop at tags section
            }
          }
        }
        
        if (faqContent.length > 20) {
          faqs = parseFAQContent(faqContent);
        } else {
          console.log('⚠️ FAQ content still appears empty after extended search');
        }
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
      
      // Try to extract title from headers (but skip section headers like "Introduction:", "Discover", etc.)
      const lines = aiResponse.split('\n');
      for (const line of lines) {
        if (line.startsWith('#') && !title) {
          const headerText = line.replace(/#/g, '').trim();
          // Skip section headers - we want the main blog title, not section headers
          if (!headerText.toLowerCase().startsWith('introduction:') && 
              !headerText.toLowerCase().startsWith('discover ') && 
              !headerText.toLowerCase().startsWith('activities ') && 
              !headerText.toLowerCase().startsWith('visitor ') && 
              !headerText.toLowerCase().startsWith('tips ') && 
              !headerText.toLowerCase().startsWith('beyond ') && 
              !headerText.toLowerCase().startsWith('final ') &&
              !headerText.toLowerCase().includes('heritage:') &&
              !headerText.toLowerCase().includes('background:')) {
            title = headerText;
            break;
          }
        }
      }
      
      // Use full response as content if no CONTENT: section found
      if (!content) {
        content = aiResponse;
      }
      
      // Generate fallbacks
      if (!title) {
        title = `Ultimate Guide to ${park.name}: ${park.city}, ${park.state} Complete Visitor Experience`;
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
    
    // Remove any remaining formatting artifacts from content
    content = content
      .replace(/^\*\*TITLE:\*\*.*$/gm, '') // Remove title lines
      .replace(/^\*\*DESCRIPTION:\*\*.*$/gm, '') // Remove description lines  
      .replace(/^\*\*EXCERPT:\*\*.*$/gm, '') // Remove excerpt lines
      .replace(/^\*\*CONTENT:\*\*.*$/gm, '') // Remove content labels
      .replace(/^\*\*TAGS:\*\*.*$/gm, '') // Remove tags lines
      .replace(/^\*\*FAQS:\*\*.*$/gm, '') // Remove FAQ section headers
      .replace(/^FAQS:.*$/gm, '') // Remove unformatted FAQ headers
      .replace(/^FAQ:.*$/gm, '') // Remove individual FAQ lines
      .replace(/^ANSWER:.*$/gm, '') // Remove answer lines
      .replace(/^Q:.*$/gm, '') // Remove Q: lines
      .replace(/^A:.*$/gm, '') // Remove A: lines
      .replace(/^Question:.*$/gm, '') // Remove Question: lines
      .replace(/^Answer:.*$/gm, '') // Remove Answer: lines
      .replace(/^TITLE:.*$/gm, '') // Remove unformatted title lines
      .replace(/^DESCRIPTION:.*$/gm, '') // Remove unformatted description lines
      .replace(/^EXCERPT:.*$/gm, '') // Remove unformatted excerpt lines
      .replace(/^CONTENT:.*$/gm, '') // Remove unformatted content labels
      .replace(/^TAGS:.*$/gm, '') // Remove unformatted tags lines
      .replace(/^\*\*Title:\*\*.*$/gmi, '') // Remove formatted title lines (case insensitive)
      .replace(/^\*\*Description:\*\*.*$/gmi, '') // Remove formatted description lines
      .replace(/^\*\*Excerpt:\*\*.*$/gmi, '') // Remove formatted excerpt lines
      .replace(/^Title:.*$/gmi, '') // Remove unformatted title lines (case insensitive)
      .replace(/^Description:.*$/gmi, '') // Remove unformatted description lines  
      .replace(/^Excerpt:.*$/gmi, '') // Remove unformatted excerpt lines
      .replace(/^\*\*Meta Description:\*\*.*$/gmi, '') // Remove meta description lines
      .replace(/^Meta Description:.*$/gmi, '') // Remove unformatted meta description lines
      .replace(/\n\n\n+/g, '\n\n') // Clean up multiple line breaks
      .trim();

    // Clean up standalone FAQ headers with no content
    content = content
      .replace(/^FAQs?\s*:?\s*$/gm, '') // Remove standalone FAQ headers
      .replace(/^\*\*FAQs?\*\*\s*:?\s*$/gm, '') // Remove formatted FAQ headers  
      .replace(/^##\s*FAQs?\s*$/gm, '') // Remove markdown FAQ headers
      .replace(/^###\s*FAQs?\s*$/gm, '') // Remove h3 FAQ headers
      .replace(/\n\n\s*FAQs?\s*:?\s*$/gm, '') // Remove FAQ headers at end preceded by double newline
      .replace(/\n\s*FAQs?\s*:\s*\n/gm, '\n') // Remove FAQ headers between newlines
      .replace(/\n\s*FAQs?\s*:\s*$/gm, '') // Remove FAQ headers at very end of content
      .replace(/\n\n\n+/g, '\n\n') // Clean up resulting multiple line breaks
      .trim();
    
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
    
    // Ensure FAQs are always present - add fallbacks if none were generated
    if (faqs.length === 0) {
      console.log('⚠️ No FAQs generated by AI, adding fallback FAQs...');
      faqs = [
        {
          question: `What are the operating hours and admission fees for ${park.name}?`,
          answer: `${park.name} is typically open year-round, though specific hours may vary by season. Most national parks charge an entrance fee, but some sites are free to visit. Check the official NPS website for current hours and fee information.`
        },
        {
          question: `How long should I plan for a visit to ${park.name}?`,
          answer: `A typical visit to ${park.name} can range from a few hours to a full day, depending on your interests and the activities you choose. Allow extra time for hiking, photography, and exploring visitor centers.`
        },
        {
          question: `What should I bring when visiting ${park.name}?`,
          answer: `Essential items include comfortable walking shoes, water, snacks, sunscreen, and weather-appropriate clothing. Bring a camera to capture the scenic views and consider binoculars for wildlife viewing.`
        },
        {
          question: `What is the best time to visit ${park.name}?`,
          answer: `The best time to visit depends on your preferences and the activities you plan to enjoy. Spring and fall often offer pleasant weather and fewer crowds, while summer provides the longest daylight hours.`
        },
        {
          question: `Is ${park.name} accessible for visitors with mobility needs?`,
          answer: `Many areas of ${park.name} are accessible to visitors with mobility needs, including paved trails and accessible facilities. Contact the park directly for specific accessibility information and current conditions.`
        }
      ];
    }
    
    return {
      title: title.replace(/['"*]/g, '').replace(/^(Title|TITLE):\s*/i, '').trim(), // Clean quotes, asterisks, and title prefixes
      description: description.replace(/['"*]/g, '').replace(/^(Description|DESCRIPTION):\s*/i, '').trim(),
      excerpt: excerpt.replace(/['"*]/g, '').replace(/^(Excerpt|EXCERPT):\s*/i, '').trim(),
      content: content,
      tags: tags,
      faqs: faqs,
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