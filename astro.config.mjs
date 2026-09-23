// @ts-check
import { defineConfig } from 'astro/config';
import siteConfig from './site.config.mjs';

const url = new URL(siteConfig.siteUrl);
const base = url.pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  site: url.origin,
  base,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
});
