import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.forestalparktenerife.es',

  // i18n: ES en la raíz, EN bajo /en/ con slugs traducidos.
  // prefixDefaultLocale: false → el español (defaultLocale) no lleva prefijo,
  // el inglés vive bajo /en/. Las páginas se crean file-based (src/pages y
  // src/pages/en/) en la fase de migración.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    // Genera /sitemap-index.xml + /sitemap-0.xml con las 145 URLs.
    // El hreflang ES↔EN ya viaja en el <head> preservado de cada página (Yoast).
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date('2026-06-13'),
    }),
  ],

  output: 'static',
  compressHTML: true,

  // El WP original redirige los archivos de autor a la home (no son páginas
  // propias). Se replica ese comportamiento (única redirección — el resto de
  // URLs es inmutable y se sirve directa).
  redirects: {
    '/author/fptadmin/': '/',
    '/en/author/fptadmin/': '/en/',
    // Posts EN enlazados con el slug de categoría antiguo (/general-en/) que el
    // WP redirige a su versión canónica (/general/), ya migrada.
    '/en/general-en/halloween-event-amaro-pargo-escape-room/': '/en/general/halloween-event-amaro-pargo-escape-room/',
    '/en/general-en/we-are-open-every-day-of-the-2024-december-long-weekend-in-tenerife/': '/en/general/we-are-open-every-day-of-the-2024-december-long-weekend-in-tenerife/',
  },

  // El WordPress original (Avada + Yoast) usa trailing slash en todas las URLs
  // del sitemap (verificado en discovery). Se usa 'always' como baseline.
  // PENDIENTE: verificar URL a URL en la fase de migración (R9 — 145 URLs
  // inmutables, cero 301), ya que el comportamiento exacto de trailing slash
  // debe replicarse exactamente.
  trailingSlash: 'always',

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
    optimizeDeps: {
      exclude: ['@fp/config', '@fp/seo', '@fp/ui'],
    },
    ssr: {
      noExternal: ['@fp/config', '@fp/seo', '@fp/ui'],
    },
  },
});
