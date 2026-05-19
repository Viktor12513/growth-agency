import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hemsida: resolve(__dirname, 'hemsida/index.html'),
        kundcases: resolve(__dirname, 'kundcases/index.html'),
        seo: resolve(__dirname, 'seo/index.html'),
        googleAds: resolve(__dirname, 'google-ads/index.html'),
        socialaMedier: resolve(__dirname, 'sociala-medier/index.html'),
        priser: resolve(__dirname, 'priser/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blogg: resolve(__dirname, 'blogg/index.html'),
        omOss: resolve(__dirname, 'om-oss/index.html'),
        kontakt: resolve(__dirname, 'kontakt/index.html'),
        integritetspolicy: resolve(__dirname, 'integritetspolicy/index.html'),
      },
    },
  },
});
