// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemapIntegration from './src/integrations/sitemap.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://nationalparkdirectory.com',
  integrations: [
    sitemapIntegration()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});