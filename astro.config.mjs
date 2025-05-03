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
      // Customize priorities and change frequencies based on URL patterns
      transform: (config, url) => {
        // Base configuration
        let priority = 0.7;
        let changefreq = 'monthly';

        // Homepage gets highest priority
        if (url === 'https://nationalparkdirectory.com/') {
          priority = 1.0;
          changefreq = 'weekly';
        }
        // Main section pages get high priority
        else if (/^\/(parks|states|regions|blog)$/.test(new URL(url).pathname)) {
          priority = 0.9;
          changefreq = 'weekly';
        }
        // Popular park pages get medium-high priority
        else if (/^\/parks\/(yellowstone|grand-canyon|yosemite|zion|acadia|olympic|great-smoky-mountains|rocky-mountain|glacier|arches|bryce-canyon|sequoia|joshua-tree|shenandoah|everglades)$/.test(new URL(url).pathname)) {
          priority = 0.8;
          changefreq = 'monthly';
        }
        // State and region pages get medium priority
        else if (/^\/(states|regions)\/[a-z-]+$/.test(new URL(url).pathname)) {
          priority = 0.8;
          changefreq = 'monthly';
        }
        // Blog posts get medium priority
        else if (/^\/blog\/[a-z-]+$/.test(new URL(url).pathname)) {
          priority = 0.7;
          changefreq = 'monthly';
        }

        return {
          ...config,
          priority,
          changefreq,
          lastmod: new Date().toISOString()
        };
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});