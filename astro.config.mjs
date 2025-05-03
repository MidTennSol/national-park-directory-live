// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nationalparkdirectory.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('404'),
      customPages: [
        'https://nationalparkdirectory.com',
        'https://nationalparkdirectory.com/parks',
        'https://nationalparkdirectory.com/states',
        'https://nationalparkdirectory.com/regions',
        'https://nationalparkdirectory.com/blog'
      ],
      serialize(item) {
        // Normalize URLs to remove trailing slashes
        const url = item.url.replace(/\/+$/, '');
        // Escape special characters in URLs
        const escapedUrl = url.replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/"/g, '&quot;')
                             .replace(/'/g, '&apos;');
        
        // Set priority based on URL patterns
        let priority = 0.7;
        let changefreq = 'monthly';

        // Homepage gets highest priority
        if (url === 'https://nationalparkdirectory.com') {
          priority = 1.0;
          changefreq = 'weekly';
        }
        // Main section pages get high priority
        else if (/^\/(parks|states|regions|blog)$/.test(new URL(url).pathname)) {
          priority = 0.9;
          changefreq = 'weekly';
        }
        // Individual park pages get medium-high priority
        else if (/^\/parks\/[a-z-]+$/.test(new URL(url).pathname)) {
          priority = 0.8;
          changefreq = 'monthly';
        }

        return {
          url: escapedUrl,
          changefreq,
          priority,
          lastmod: new Date().toISOString()
        };
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});