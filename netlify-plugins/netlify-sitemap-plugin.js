/**
 * Netlify plugin to create a proper sitemap.xml file during build
 */
module.exports = {
  onPostBuild: async ({ utils }) => {
    console.log('Creating sitemap.xml file...');
    
    const fs = require('fs');
    const path = require('path');
    
    // Make sure we're generating the file in the publish directory
    const publishDir = process.env.PUBLISH_DIR || 'dist';
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://nationalparkdirectory.com/sitemap-index.xml</loc>
  </sitemap>
</sitemapindex>`;
    
    // Write the sitemap.xml file
    try {
      fs.writeFileSync(path.join(publishDir, 'sitemap.xml'), sitemapContent);
      console.log('✅ Successfully created sitemap.xml');
    } catch (error) {
      console.error('❌ Error creating sitemap.xml:', error.message);
      utils.build.failBuild('Failed to create sitemap.xml file');
    }
  }
}; 