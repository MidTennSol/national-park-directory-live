// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nationalparkdirectory.com',
  integrations: [
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('404'),
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});