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
        quiz: resolve(__dirname, 'quiz/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blogg: resolve(__dirname, 'blogg/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
        bloggSeoResults: resolve(__dirname, 'blogg/hur-lang-tid-tar-seo/index.html'),
        omOss: resolve(__dirname, 'om-oss/index.html'),
        kontakt: resolve(__dirname, 'kontakt/index.html'),
        integritetspolicy: resolve(__dirname, 'integritetspolicy/index.html'),
        seoPris: resolve(__dirname, 'seo-pris/index.html'),
        lokalSeo: resolve(__dirname, 'lokal-seo/index.html'),
        seoByraSmaforetag: resolve(__dirname, 'seo-byra-smaforetag/index.html'),
        internationellSeo: resolve(__dirname, 'internationell-seo/index.html'),
        hemsidaForetagPris: resolve(__dirname, 'hemsida-foretag-pris/index.html'),
        hemsidaSmaforetag: resolve(__dirname, 'hemsida-smaforetag/index.html'),
        webbyraHelsingborg: resolve(__dirname, 'webbyra-helsingborg/index.html'),
        webbyraMalmo: resolve(__dirname, 'webbyra-malmo/index.html'),
        webbyraGoteborg: resolve(__dirname, 'webbyra-goteborg/index.html'),
        webbyraStockholm: resolve(__dirname, 'webbyra-stockholm/index.html'),
        webbyraVasteras: resolve(__dirname, 'webbyra-vasteras/index.html'),
        webbyraUmea: resolve(__dirname, 'webbyra-umea/index.html'),
        webbyraOrebro: resolve(__dirname, 'webbyra-orebro/index.html'),
      },
    },
  },
});
