import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Pages are prerendered to static HTML; only /api/* runs on the server.
// Deploying to Vercel/Netlify instead? Swap the adapter (@astrojs/vercel or @astrojs/netlify).
export default defineConfig({
  site: 'https://example.com',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  redirects: { '/industries': '/industries/healthcare' },
});
