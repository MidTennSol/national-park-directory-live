#!/usr/bin/env node

/**
 * Command-line interface for generating automated blog posts
 * 
 * Usage examples:
 * node scripts/blog-automation/generate-blog-post.js
 * node scripts/blog-automation/generate-blog-post.js --preview
 * node scripts/blog-automation/generate-blog-post.js --park="yellowstone-national-park"
 * node scripts/blog-automation/generate-blog-post.js --template="seasonal-spotlight"
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateBlogPost, previewBlogPost } from '../../src/automation/blog-generator.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    preview: false,
    parkSlug: null,
    templateId: null,
    season: null,
    author: null,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--preview' || arg === '-p') {
      options.preview = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('--park=')) {
      options.parkSlug = arg.split('=')[1];
    } else if (arg.startsWith('--template=')) {
      options.templateId = arg.split('=')[1];
    } else if (arg.startsWith('--season=')) {
      options.season = arg.split('=')[1];
    } else if (arg.startsWith('--author=')) {
      options.author = arg.split('=')[1];
    }
  }

  return options;
}

// Display help information
function showHelp() {
  console.log(`
🤖 AI-Powered Blog Post Generator

USAGE:
  node scripts/blog-automation/generate-blog-post.js [options]

NEW: AI-POWERED CONTENT GENERATION
  This system now uses OpenAI GPT-4 to generate completely original, unique content
  for each blog post while maintaining the framework of proven templates.

OPTIONS:
  --preview, -p              Preview the blog post without creating files
  --park=SLUG               Force specific park (e.g., --park=yellowstone-national-park)
  --template=ID             Force specific template (e.g., --template=seasonal-spotlight)
  --season=SEASON           Force specific season (spring, summer, fall, winter)
  --author=NAME             Override author name
  --help, -h                Show this help message

EXAMPLES:
  # Test AI integration first
  npm run test-ai

  # Generate an AI-powered blog post automatically
  npm run generate-blog-post

  # Preview what would be generated
  npm run generate-blog-post -- --preview

  # Generate post for specific park
  npm run generate-blog-post -- --park=grand-canyon-national-park

  # Generate seasonal post for summer
  npm run generate-blog-post -- --season=summer --template=seasonal-spotlight

AI CONTENT TEMPLATES:
  - seasonal-spotlight      Focus on seasonal activities and timing
  - hidden-gems             Focus on lesser-known attractions and secret spots
  - historical-deep-dive    Focus on historical and cultural significance
  - wildlife-encounters     Focus on wildlife viewing, animal behavior, and safety
  - adventure-planning      Focus on trip planning and logistics
  - photography-focus       Focus on photography opportunities and techniques
  - family-fun              Focus on family-friendly activities and experiences
  - geological-wonders      Focus on geological features and earth processes
  - cultural-heritage       Focus on cultural significance and heritage
  - accessibility-spotlight Focus on accessibility and inclusive experiences

AI FEATURES:
  ✨ Completely original content for each post (no duplication)
  🎯 SEO-optimized with natural keyword integration
  📝 Varied writing styles and narrative approaches
  🤖 GPT-4 powered for highest quality output
  🔄 Automatic fallback to templates if AI fails
  📊 Content tracking and analytics

REQUIREMENTS:
  - OpenAI API key in .env file (OPENAI_API_KEY=your_key_here)
  - Internet connectivity for AI generation
  - Valid OpenAI account with available credits

NOTES:
  - The system automatically avoids recently featured parks
  - Templates guide AI content direction and suitability
  - All generated content respects your existing blog structure
  - Files are created in src/content/blog/ directory
  - Each post is completely unique and original
`);
}

// Main execution function
async function main() {
  const options = parseArguments();

  if (options.help) {
    showHelp();
    return;
  }

  console.log('🚀 National Park Directory - Automated Blog Generator');
  console.log('=' .repeat(60));

  try {
    let result;

    if (options.preview) {
      console.log('👀 PREVIEW MODE - No files will be created\n');
      result = await previewBlogPost(options);
    } else {
      console.log('✨ GENERATION MODE - Creating new blog post\n');
      result = await generateBlogPost(options);
    }

    if (result.success) {
      console.log('\n🎉 SUCCESS!');
      console.log('-'.repeat(40));
      console.log(`🏞️  Park: ${result.park}`);
      console.log(`📝 Template: ${result.template}`);
      console.log(`📰 Title: ${result.title}`);
      
      if (!options.preview && !result.previewMode) {
        console.log(`📁 File: ${result.filePath}`);
        console.log('\n📋 Next Steps:');
        console.log('1. Review the generated content');
        console.log('2. Make any necessary edits');
        console.log('3. Commit and push to deploy');
        console.log('\n💡 Commands:');
        console.log(`   git add "${result.filePath}"`);
        console.log('   git commit -m "Add automated blog post"');
        console.log('   git push origin main');
      } else {
        console.log('📁 File location: Would be saved to src/content/blog/');
        console.log('\n💡 To generate for real:');
        console.log('   node scripts/blog-automation/generate-blog-post.js');
      }

    } else {
      console.log('\n❌ GENERATION FAILED');
      console.log('-'.repeat(40));
      console.log(`Error: ${result.error}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check that your park data is available');
      console.log('2. Verify the blog content directory exists');
      console.log('3. Ensure proper file permissions');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 UNEXPECTED ERROR');
    console.error('-'.repeat(40));
    console.error('Error:', error.message);
    console.error('\n🐛 Debug info:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.error('\n💥 UNCAUGHT EXCEPTION');
  console.error(error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n💥 UNHANDLED REJECTION');
  console.error(reason);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 