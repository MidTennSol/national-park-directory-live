/**
 * Netlify plugin to create a proper sitemap.xml file during build
 */
import { promises as fs } from 'fs';
import path from 'path';
import { writeFileSync, existsSync } from 'fs';

export default {
  onPostBuild: async ({ utils, constants }) => {
    console.log('🔍 Creating sitemap.xml file...');
    
    try {
      // Use Netlify environment variables for the publish directory
      const publishDir = constants.PUBLISH_DIR || process.env.PUBLISH_DIR || 'dist';
      
      // Base URL of the site
      const siteUrl = 'https://nationalparkdirectory.com';
      
      // Get current date in ISO format for the lastmod field
      const currentDate = new Date().toISOString();
      
      // Create a basic sitemap index that points to sitemap-index.xml
      // This is our fallback to ensure the site doesn't crash
      const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-index.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
      
      // Write out our sitemap index file - this is simple and safe
      writeFileSync(path.join(publishDir, 'sitemap.xml'), sitemapIndexContent);
      console.log('✅ Successfully created basic sitemap.xml');
      
      // Now we'll attempt to create a more detailed sitemap-0.xml file
      // but we'll do it in a way that won't crash the site if something goes wrong
      try {
        // Check if the sitemap-index.xml exists already
        const sitemapIndexPath = path.join(publishDir, 'sitemap-index.xml');
        if (existsSync(sitemapIndexPath)) {
          console.log('ℹ️ sitemap-index.xml already exists, preserving it.');
        } else {
          // Main directories to include in sitemap (adjust as needed)
          const mainSections = ['', 'parks', 'blog', 'states', 'regions'];
          
          let urls = [];
          
          // Add the main sections
          for (const section of mainSections) {
            const sectionPath = section ? `/${section}` : '/';
            urls.push(`
  <url>
    <loc>${siteUrl}${sectionPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${section ? '0.8' : '1.0'}</priority>
  </url>`);
          }
          
          // Attempt to check for HTML files in the publish directory to find actual pages
          try {
            // Get parks directory content if it exists
            const parksDir = path.join(publishDir, 'parks');
            if (existsSync(parksDir)) {
              const parkFiles = await fs.readdir(parksDir);
              for (const file of parkFiles) {
                // Only include directories (park pages)
                const filePath = path.join(parksDir, file);
                const stats = await fs.stat(filePath);
                if (stats.isDirectory()) {
                  urls.push(`
  <url>
    <loc>${siteUrl}/parks/${file}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
                }
              }
            }
            
            // Get blog directory content if it exists
            const blogDir = path.join(publishDir, 'blog');
            if (existsSync(blogDir)) {
              const blogFiles = await fs.readdir(blogDir);
              for (const file of blogFiles) {
                // Only include directories (blog posts)
                const filePath = path.join(blogDir, file);
                const stats = await fs.stat(filePath);
                if (stats.isDirectory()) {
                  urls.push(`
  <url>
    <loc>${siteUrl}/blog/${file}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
                }
              }
            }
          } catch (scanError) {
            console.log('⚠️ Warning: Could not scan all directories, but continuing:', scanError.message);
            // We continue anyway to ensure the site doesn't crash
          }
          
          // Create the sitemap with all the URLs
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;
          
          // Write sitemap-0.xml
          const sitemapPath = path.join(publishDir, 'sitemap-0.xml');
          writeFileSync(sitemapPath, sitemap);
          console.log(`✅ Successfully created detailed sitemap-0.xml with ${urls.length} URLs`);
          
          // Create sitemap-index.xml that points to the detailed sitemap
          const sitemapIndexDetailed = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-0.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
          
          // Write sitemap-index.xml
          writeFileSync(sitemapIndexPath, sitemapIndexDetailed);
          console.log('✅ Successfully created sitemap-index.xml pointing to the detailed sitemap');
        }
      } catch (detailedSitemapError) {
        console.log('⚠️ Could not create detailed sitemap, but basic sitemap.xml was created:', detailedSitemapError.message);
        // Even if this fails, we still have our basic sitemap.xml
      }
      
      console.log('🎉 Sitemap generation completed successfully');
    } catch (error) {
      console.error('❌ Error during sitemap creation:', error.message);
      // Do not fail the build - this ensures the site will deploy even if the sitemap has issues
      console.log('⚠️ Continuing build despite sitemap error to prevent site crash');
    }
  }
}; 