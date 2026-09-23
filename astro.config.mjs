// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import siteConfig from './site.config.mjs';
import { subsetSerif } from './scripts/serif-subset.mjs';

const url = new URL(siteConfig.siteUrl);
const base = url.pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  site: url.origin,
  base,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  integrations: [
    {
      name: 'serif-subset',
      hooks: { 'astro:build:done': ({ dir }) => subsetSerif(fileURLToPath(dir)) },
    },
  ],
});
