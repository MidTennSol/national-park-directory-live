/**
 * Netlify plugin to create a proper sitemap.xml file during build
 */
import { writeFileSync } from 'fs';
import path from 'path';

export default {
  onPostBuild: async ({ utils, constants }) => {
    console.log('🔍 Creating sitemap files with hardcoded content...');
    
    try {
      // Use Netlify environment variables for the publish directory
      const publishDir = constants.PUBLISH_DIR || process.env.PUBLISH_DIR || 'dist';
      
      // Base URL of the site
      const siteUrl = 'https://nationalparkdirectory.com';
      
      // Current date for lastmod
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Start building the sitemap content
      let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/parks</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

      // Popular National Parks - without trailing slashes
      const popularParks = [
        'yellowstone',
        'grand-canyon',
        'yosemite',
        'zion',
        'acadia',
        'olympic',
        'great-smoky-mountains',
        'rocky-mountain',
        'glacier',
        'arches',
        'bryce-canyon',
        'sequoia',
        'joshua-tree',
        'shenandoah',
        'everglades'
      ];
      
      // Add park pages
      popularParks.forEach(park => {
        sitemapContent += `
  <url>
    <loc>${siteUrl}/parks/${park}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      
      // Add states section
      sitemapContent += `
  <url>
    <loc>${siteUrl}/states</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      
      // All 50 states + DC
      const states = [
        'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 
        'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 
        'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 
        'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 
        'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 
        'new-hampshire', 'new-jersey', 'new-mexico', 'new-york', 
        'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon', 
        'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota', 
        'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 
        'west-virginia', 'wisconsin', 'wyoming', 'district-of-columbia'
      ];
      
      // Add state pages
      states.forEach(state => {
        sitemapContent += `
  <url>
    <loc>${siteUrl}/states/${state}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      
      // Add regions section
      sitemapContent += `
  <url>
    <loc>${siteUrl}/regions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      
      // Regions
      const regions = ['west', 'midwest', 'northeast', 'southeast', 'southwest'];
      
      // Add region pages
      regions.forEach(region => {
        sitemapContent += `
  <url>
    <loc>${siteUrl}/regions/${region}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      
      // Add blog section and posts
      sitemapContent += `
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/wildlife-watching-in-national-parks</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/best-hiking-trails-in-yellowstone</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/national-parks-to-visit-in-spring</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Other important pages -->
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/site-map</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${siteUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

      // Write the sitemap.xml file
      writeFileSync(path.join(publishDir, 'sitemap.xml'), sitemapContent);
      console.log(`✅ Successfully created sitemap.xml with ${popularParks.length + states.length + regions.length + 12} URLs`);
      
      console.log('🎉 Sitemap generation completed successfully');
    } catch (error) {
      console.error('❌ Error during sitemap creation:', error.message);
      // Do not fail the build - this ensures the site will deploy even if the sitemap has issues
      console.log('⚠️ Continuing build despite sitemap error to prevent site crash');
    }
  }
}; 