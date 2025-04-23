import { promises as fs } from 'fs';
import path from 'path';

export default {
  onPreBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking for content directory...');
    
    // Check content directory
    const contentDir = path.join(process.cwd(), 'src/content/blog');
    try {
      const stat = await fs.stat(contentDir);
      if (stat.isDirectory()) {
        console.log('✅ BLOG DEBUG: Content directory exists at', contentDir);
        
        // List content files
        const files = await fs.readdir(contentDir);
        console.log(`✅ BLOG DEBUG: Found ${files.length} blog content files:`);
        files.forEach(file => console.log(`   - ${file}`));
      }
    } catch (err) {
      console.log('❌ BLOG DEBUG: Content directory MISSING at', contentDir);
      
      // Try to create the directory
      console.log('🔧 BLOG DEBUG: Attempting to create content directory...');
      try {
        await fs.mkdir(contentDir, { recursive: true });
        console.log('✅ BLOG DEBUG: Created content directory');
      } catch (err) {
        console.log('❌ BLOG DEBUG: Failed to create content directory:', err.message);
      }
    }
  },
  
  onBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking Astro build configuration...');
    
    // Check Astro config
    const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');
    try {
      const astroConfig = await fs.readFile(astroConfigPath, 'utf8');
      console.log('✅ BLOG DEBUG: Astro config exists');
      console.log('📋 BLOG DEBUG: Astro config content:');
      console.log(astroConfig);
    } catch (err) {
      console.log('❌ BLOG DEBUG: Astro config MISSING or cannot be read');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking build output...');
    
    // Check blog directory in build output
    const blogOutputDir = path.join(process.cwd(), 'dist/blog');
    try {
      const stat = await fs.stat(blogOutputDir);
      if (stat.isDirectory()) {
        console.log('✅ BLOG DEBUG: Blog directory exists in build output');
        
        // List blog output
        const files = await fs.readdir(blogOutputDir);
        console.log(`✅ BLOG DEBUG: Found ${files.length} items in blog output directory:`);
        files.forEach(file => console.log(`   - ${file}`));
      }
    } catch (err) {
      console.log('❌ BLOG DEBUG: Blog directory MISSING in build output!');
    }
  }
};