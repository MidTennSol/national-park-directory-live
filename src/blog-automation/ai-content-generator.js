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
      max_tokens: 6000,  // Increased to allow for longer responses
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
    
    // Always print current working directory and raw AI response for debugging
    console.log(`🗂️ Current working directory: ${process.cwd()}`);
    console.log('📝 Raw AI response from OpenAI:');
    console.log(generatedContent);
    // Always attempt to write debug file
    try {
      const fs = await import('fs/promises');
      const debugFile = `debug-short-ai-response-${park.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      await fs.writeFile(debugFile, generatedContent, 'utf-8');
      console.log(`⚠️ Saved AI response for debugging: ${debugFile}`);
    } catch (err) {
      console.error('❌ Failed to write debug file:', err);
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
  return `You are a professional travel writer. Write comprehensive, detailed, and engaging blog posts about national parks. Each post must be at least 1200 words, well-structured, and provide practical, park-specific information. Use vivid language, include specific details, and organize the post into clear sections. Always include a section with 5 detailed FAQs at the end.`;
}

/**
 * Build detailed prompt for specific park content generation
 */
function buildBlogPrompt(park, options = {}) {
  const topic = options.topic || 'complete visitor guide';
  const targetWordCount = Math.floor(Math.random() * 300) + 1100;
  return `Write a ${targetWordCount}+ word blog post about ${park.name} in ${park.city}, ${park.state}.

Requirements:
- The main blog title must be a single Markdown H1 (#) and must be unique, creative, and engaging. Do NOT use generic patterns like 'Ultimate Guide to...'.
- The meta description (150-160 characters) and excerpt (1-2 sentences) must be included.
- The main content must be organized into the following sections, each with a Markdown H2 (##) header and bolded section name (e.g., ## **Introduction**):
  * Introduction
  * Historical/Cultural/Geological Background
  * Activities Guide
  * Visitor Information
  * Tips for Different Visitors
  * Regional Context
  * Conclusion
- Do NOT use plain text section headers with colons (e.g., 'Introduction:').
- At the end, include a section labeled 'FAQs' with 5 detailed Q&A pairs, but do NOT include the FAQs in the main content body.
- After FAQs, include a section labeled 'Tags' with 8 relevant tags.

IMPORTANT: The main body of the post MUST be under a section labeled 'CONTENT:' (all caps, on its own line). If you do not include a CONTENT: section, the post will be rejected. Do NOT put FAQs or tags inside the CONTENT section.

Use vivid, specific details and organize each section with multiple paragraphs. Do not use placeholders. Make the post practical and authoritative.`;
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
    if (!title || title.toLowerCase() === 'content' || title.toLowerCase() === 'content:') {
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
              !headerText.toLowerCase().includes('background:') &&
              headerText.toLowerCase() !== 'content' &&
              headerText.toLowerCase() !== 'content:') {
            title = headerText;
            break;
          }
        }
      }
      // Use park name and location as fallback if still missing or invalid
      if (!title || title.toLowerCase() === 'content' || title.toLowerCase() === 'content:') {
        title = `Ultimate Guide to ${park.name}: ${park.city}, ${park.state} Complete Visitor Experience`;
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
    
    // Aggressively remove any 'CONTENT' header in any form
    content = content.replace(/^\s*(\*\*|#*)?\s*CONTENT:?\s*(\*\*|#*)?\s*$/gim, '');

    // Extract everything up to and including the 'Conclusion' section, strip everything after
    const conclusionRegex = /((?:.|\n)*?)(^#+\s*(\*\*)?Conclusion(\*\*)?.*?(?:\n|$)(?:.|\n)*?)(?=^#+|$)/gim;
    let match = conclusionRegex.exec(content);
    if (match) {
      // Keep everything up to and including the conclusion section
      content = match[1] + match[2];
    }

    // Defensive hybrid extraction of main content
    let contentStart = aiResponse.search(/^CONTENT:|\*\*CONTENT:\*\*/im);
    let contentEnd = aiResponse.search(/^FAQS?:|\*\*FAQS?:\*\*|^TAGS:|\*\*TAGS:\*\*/im);
    if (contentStart !== -1) {
      // Find the end of the CONTENT section
      if (contentEnd !== -1 && contentEnd > contentStart) {
        content = aiResponse.substring(contentStart, contentEnd).replace(/^CONTENT:|\*\*CONTENT:\*\*/im, '').trim();
      } else {
        content = aiResponse.substring(contentStart).replace(/^CONTENT:|\*\*CONTENT:\*\*/im, '').trim();
      }
    } else {
      // Fallback: extract between EXCERPT and FAQ/Tags
      let excerptIdx = aiResponse.search(/^EXCERPT:|\*\*EXCERPT:\*\*/im);
      if (excerptIdx !== -1) {
        let afterExcerpt = aiResponse.indexOf('\n', excerptIdx);
        if (afterExcerpt !== -1) {
          if (contentEnd !== -1 && contentEnd > afterExcerpt) {
            content = aiResponse.substring(afterExcerpt, contentEnd).trim();
          } else {
            content = aiResponse.substring(afterExcerpt).trim();
          }
        }
      }
    }
    // Only remove lines that are clearly FAQ Q&A pairs or headers
    content = content
      .replace(/^\s*(\*\*|#*)?\s*FAQs?:?\s*(\*\*|#*)?\s*$/gim, '')
      .replace(/^\s*(\*\*|#*)?\s*FAQ:?\s*(\*\*|#*)?\s*$/gim, '')
      .replace(/^\s*Q\d*[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\s*A\d*[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\s*Q[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\s*A[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\s*Question[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\s*Answer[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\d+\.\s*Q[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/^\d+\.\s*A[:\.]?\s*(\*\*|#*)?.*$/gim, '')
      .replace(/\n{3,}/g, '\n\n');
    // Fallback: If the parser would remove all content, log a warning and keep the original content for debugging
    if (!content || content.trim().length < 50) {
      console.warn('⚠️ Defensive parser removed all content. Keeping original content for debugging.');
      content = aiResponse;
    }
    
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
    
    if (!content || content.trim().length < 100) {
      console.log('⚠️ No main content found using CONTENT: marker. Attempting fallback extraction...');
      // Try to extract everything between EXCERPT and FAQS/TAGS
      const excerptIdx = aiResponse.search(/EXCERPT:|\*\*EXCERPT:\*/i);
      let startIdx = -1;
      if (excerptIdx !== -1) {
        // Find the end of the excerpt line
        startIdx = aiResponse.indexOf('\n', excerptIdx);
      }
      let endIdx = aiResponse.length;
      const faqIdx = aiResponse.search(/FAQS?:|\*\*FAQS?:\*/i);
      const tagsIdx = aiResponse.search(/TAGS:|\*\*TAGS:\*/i);
      if (faqIdx !== -1 && faqIdx < endIdx) endIdx = faqIdx;
      if (tagsIdx !== -1 && tagsIdx < endIdx) endIdx = tagsIdx;
      if (startIdx !== -1 && endIdx > startIdx) {
        content = aiResponse.substring(startIdx, endIdx).trim();
        console.log('⚠️ Fallback content extraction result:', content.substring(0, 200));
      } else {
        console.log('❌ Fallback extraction failed. No main content found.');
      }
    }
    
    // Add extra logging if content is still missing or very short
    if (!content || content.split(' ').length < 100) {
      console.log('❌ Main content is missing or extremely short after all extraction attempts.');
    }
    
    // Convert any plain section headings (e.g., 'Introduction:') to Markdown headers (e.g., '## **Introduction**').
    content = content.replace(/^Introduction:.*$/gm, '## **Introduction**');
    content = content.replace(/^Historical\/Cultural\/Geological Background:.*$/gm, '## **Historical/Cultural/Geological Background**');
    content = content.replace(/^Activities Guide:.*$/gm, '## **Activities Guide**');
    content = content.replace(/^Visitor Information:.*$/gm, '## **Visitor Information**');
    content = content.replace(/^Tips for Different Visitors:.*$/gm, '## **Tips for Different Visitors**');
    content = content.replace(/^Regional Context:.*$/gm, '## **Regional Context**');
    content = content.replace(/^Conclusion:.*$/gm, '## **Conclusion**');
    
    // If the title is generic, prepend a random adjective or phrase for uniqueness.
    if (/^ultimate guide to/i.test(title)) {
      const adjectives = ['The Ultimate', 'The Complete', 'The Best', 'The Perfect', 'The Essential'];
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      title = `${randomAdjective} Guide to ${park.name}: ${park.city}, ${park.state} Complete Visitor Experience`;
      console.log('⚠️ Generic title detected. Updated to:', title);
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