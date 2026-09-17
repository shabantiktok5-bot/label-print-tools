import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://www.labelprinttools.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  build: {
    format: 'directory'
  },
  compressHTML: true
});
