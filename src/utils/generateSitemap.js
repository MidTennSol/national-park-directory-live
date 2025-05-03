import fs from 'fs';
import path from 'path';
import { fetchNationalParks } from './airtable.js';

const SITE_URL = 'https://nationalparkdirectory.com';
const SITEMAP_DIR = 'dist/sitemaps';

// Ensure the sitemaps directory exists
function ensureSitemapDir() {
  if (!fs.existsSync(SITEMAP_DIR)) {
    fs.mkdirSync(SITEMAP_DIR, { recursive: true });
  }
}

// Generate ISO date string for today
function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

// Create XML for a single URL entry
function createUrlEntry(loc, lastmod = getTodayISO()) {
  return `
    <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>`;
}

// Create a complete sitemap XML
function createSitemap(urlEntries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('')}
</urlset>`;
}

// Create sitemap index XML
function createSitemapIndex(sitemapUrls) {
  const today = getTodayISO();
  const sitemapEntries = sitemapUrls.map(url => `
    <sitemap>
      <loc>${url}</loc>
      <lastmod>${today}</lastmod>
    </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// Generate home sitemap
function generateHomeSitemap() {
  const urls = [
    '/',
    '/parks',
    '/states',
    '/types',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service'
  ].map(path => createUrlEntry(SITE_URL + path));

  const sitemap = createSitemap(urls);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-home.xml'), sitemap);
}

// Generate states sitemap
async function generateStatesSitemap() {
  const parks = await fetchNationalParks({
    view: 'Grid view',
    filterByFormula: ''
  });

  // Get unique states
  const states = [...new Set(parks.flatMap(park => 
    park.states.split(',').map(state => state.trim())
  ))];

  const urls = states.map(state => 
    createUrlEntry(SITE_URL + '/states/' + state.toLowerCase().replace(/\s+/g, '-'))
  );

  const sitemap = createSitemap(urls);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-states.xml'), sitemap);
}

// Generate cities sitemap
async function generateCitiesSitemap() {
  const parks = await fetchNationalParks({
    view: 'Grid view',
    filterByFormula: ''
  });

  // Get unique cities (if available in the data)
  const cities = [...new Set(parks
    .filter(park => park.city)
    .map(park => park.city)
  )];

  const urls = cities.map(city => 
    createUrlEntry(SITE_URL + '/cities/' + city.toLowerCase().replace(/\s+/g, '-'))
  );

  const sitemap = createSitemap(urls);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-cities.xml'), sitemap);
}

// Generate parks sitemap
async function generateParksSitemap() {
  const parks = await fetchNationalParks({
    view: 'Grid view',
    filterByFormula: ''
  });

  const urls = parks.map(park => 
    createUrlEntry(SITE_URL + '/parks/' + park.slug)
  );

  const sitemap = createSitemap(urls);
  fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-parks.xml'), sitemap);
}

// Generate blog sitemap (if blog exists)
function generateBlogSitemap() {
  try {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(blogDir)) return;

    const blogFiles = fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

    const urls = blogFiles.map(file => {
      const slug = file.replace(/\.(md|mdx)$/, '');
      return createUrlEntry(SITE_URL + '/blog/' + slug);
    });

    if (urls.length > 0) {
      const sitemap = createSitemap(urls);
      fs.writeFileSync(path.join(SITEMAP_DIR, 'sitemap-blog.xml'), sitemap);
    }
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
  }
}

// Generate sitemap index
function generateSitemapIndex() {
  const sitemaps = [
    'sitemap-home.xml',
    'sitemap-states.xml',
    'sitemap-cities.xml',
    'sitemap-parks.xml'
  ];

  // Add blog sitemap if it exists
  if (fs.existsSync(path.join(SITEMAP_DIR, 'sitemap-blog.xml'))) {
    sitemaps.push('sitemap-blog.xml');
  }

  const sitemapUrls = sitemaps.map(filename => 
    SITE_URL + '/sitemaps/' + filename
  );

  const sitemapIndex = createSitemapIndex(sitemapUrls);
  fs.writeFileSync('dist/sitemap.xml', sitemapIndex);
}

// Main function to generate all sitemaps
export async function generateSitemaps() {
  console.log('Generating sitemaps...');
  
  try {
    ensureSitemapDir();
    
    // Generate all section sitemaps
    await Promise.all([
      generateHomeSitemap(),
      generateStatesSitemap(),
      generateCitiesSitemap(),
      generateParksSitemap(),
      generateBlogSitemap()
    ]);

    // Generate the sitemap index
    generateSitemapIndex();
    
    console.log('Sitemaps generated successfully!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    throw error;
  }
} 