module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking for content directory...');
    const fs = require('fs');
    const path = require('path');
    
    // Check content directory
    const contentDir = path.join(process.cwd(), 'src/content/blog');
    if (fs.existsSync(contentDir)) {
      console.log('✅ BLOG DEBUG: Content directory exists at', contentDir);
      
      // List content files
      const files = fs.readdirSync(contentDir);
      console.log(`✅ BLOG DEBUG: Found ${files.length} blog content files:`);
      files.forEach(file => console.log(`   - ${file}`));
    } else {
      console.log('❌ BLOG DEBUG: Content directory MISSING at', contentDir);
      
      // Try to create the directory
      console.log('🔧 BLOG DEBUG: Attempting to create content directory...');
      try {
        fs.mkdirSync(contentDir, { recursive: true });
        console.log('✅ BLOG DEBUG: Created content directory');
      } catch (err) {
        console.log('❌ BLOG DEBUG: Failed to create content directory:', err.message);
      }
    }
  },
  
  onBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking Astro build configuration...');
    const fs = require('fs');
    const path = require('path');
    
    // Check Astro config
    const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');
    if (fs.existsSync(astroConfigPath)) {
      console.log('✅ BLOG DEBUG: Astro config exists');
      const astroConfig = fs.readFileSync(astroConfigPath, 'utf8');
      console.log('📋 BLOG DEBUG: Astro config content:');
      console.log(astroConfig);
    } else {
      console.log('❌ BLOG DEBUG: Astro config MISSING');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    console.log('🔍 BLOG DEBUG: Checking build output...');
    const fs = require('fs');
    const path = require('path');
    
    // Check blog directory in build output
    const blogOutputDir = path.join(process.cwd(), 'dist/blog');
    if (fs.existsSync(blogOutputDir)) {
      console.log('✅ BLOG DEBUG: Blog directory exists in build output');
      
      // List blog output
      const files = fs.readdirSync(blogOutputDir);
      console.log(`✅ BLOG DEBUG: Found ${files.length} items in blog output directory:`);
      files.forEach(file => console.log(`   - ${file}`));
    } else {
      console.log('❌ BLOG DEBUG: Blog directory MISSING in build output!');
    }
  }
}; 