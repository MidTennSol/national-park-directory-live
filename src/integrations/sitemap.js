import { generateSitemaps } from '../utils/generateSitemap.js';

export default function sitemapIntegration() {
  return {
    name: 'sitemap-generator',
    hooks: {
      'astro:build:done': async () => {
        try {
          await generateSitemaps();
        } catch (error) {
          console.error('Error in sitemap generation:', error);
        }
      }
    }
  };
} 