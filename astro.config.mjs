// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemapIntegration from './src/integrations/sitemap.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://nationalparkdirectory.com',
  output: 'static',
  integrations: [
    tailwind(),
    sitemapIntegration()
  ]
});