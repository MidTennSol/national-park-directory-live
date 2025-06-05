/**
 * File Generator for Blog Automation
 * 
 * Generates Astro-compatible Markdown files with proper frontmatter
 * from AI-generated blog content
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Generate and save a blog post file
 * 
 * @param {Object} blogContent - Generated blog content from AI
 * @param {Object} park - Park data from Airtable
 * @param {Object} options - Generation options
 * @returns {Object} File generation result
 */
export async function generateBlogFile(blogContent, park, options = {}) {
  console.log(`📄 Generating blog file for ${park.name}...`);
  
  try {
    // Generate the file name
    const fileName = generateFileName(blogContent.title, park);
    const filePath = path.join('src', 'content', 'blog', fileName);
    
    // Generate frontmatter
    const frontmatter = generateFrontmatter(blogContent, park, options);
    
    // Combine frontmatter and content
    const fullContent = `---
${frontmatter}
---

${blogContent.content}`;
    
    // Ensure the directory exists
    const blogDir = path.join('src', 'content', 'blog');
    await ensureDirectoryExists(blogDir);
    
    // Write the file
    await fs.writeFile(filePath, fullContent, 'utf8');
    
    console.log(`✅ Blog file created successfully: ${fileName}`);
    console.log(`   - File path: ${filePath}`);
    console.log(`   - File size: ${fullContent.length} characters`);
    
    return {
      success: true,
      fileName: fileName,
      filePath: filePath,
      fileSize: fullContent.length,
      wordCount: blogContent.wordCount
    };
    
  } catch (error) {
    console.error('❌ Error generating blog file:', error.message);
    throw error;
  }
}

/**
 * Generate Astro-compatible frontmatter
 */
function generateFrontmatter(blogContent, park, options = {}) {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Get the first image URL for the featured image
  const featuredImage = park.images.length > 0 ? park.images[0] : '';
  
  // Clean and format tags
  const tags = blogContent.tags.map(tag => `"${tag.trim()}"`).join(', ');
  
  return `title: "${blogContent.title}"
publishDate: ${currentDate}
image: "${featuredImage}"
tags: [${tags}]
description: "${blogContent.description}"
excerpt: "${blogContent.excerpt}"
author: "The NPD Team"
category: "Travel Guide"
park: "${park.name}"
state: "${park.state}"
city: "${park.city}"
coordinates: 
  lat: ${park.latitude || 0}
  lng: ${park.longitude || 0}
activities: [${park.activities.map(a => `"${a.trim()}"`).join(', ')}]
features: [${park.features.map(f => `"${f.trim()}"`).join(', ')}]
generatedBy: "${blogContent.generatedBy}"
model: "${blogContent.model}"
generatedAt: "${blogContent.generatedAt}"
topic: "${blogContent.topic}"`;
}

/**
 * Generate a clean file name from title and park
 */
function generateFileName(title, park) {
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

/**
 * Ensure directory exists, create if it doesn't
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`📁 Creating directory: ${dirPath}`);
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}

/**
 * Check if a blog file already exists
 */
export async function checkFileExists(fileName) {
  const filePath = path.join('src', 'content', 'blog', fileName);
  
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * List all existing blog files
 */
export async function listBlogFiles() {
  const blogDir = path.join('src', 'content', 'blog');
  
  try {
    const files = await fs.readdir(blogDir);
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    console.log('📁 Blog directory does not exist yet');
    return [];
  }
}

/**
 * Generate a preview of the file content without saving
 */
export function generateFilePreview(blogContent, park, options = {}) {
  const fileName = generateFileName(blogContent.title, park);
  const frontmatter = generateFrontmatter(blogContent, park, options);
  
  const fullContent = `---
${frontmatter}
---

${blogContent.content}`;
  
  return {
    fileName: fileName,
    content: fullContent,
    preview: fullContent.substring(0, 500) + '...',
    size: fullContent.length
  };
}

export default {
  generateBlogFile,
  generateFileName,
  checkFileExists,
  listBlogFiles,
  generateFilePreview
}; 