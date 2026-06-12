// @fp/seo — helpers SEO para forestalpark-web.
//
// ESQUELETO fase `estructura` (init-web-astro). Los helpers reales
// (hreflang ES↔EN + x-default, JSON-LD, canonical, sitemap helpers)
// se implementan en fases posteriores. Por ahora solo el tipo base
// para que apps/www pueda importar el paquete sin romper el build.

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  lang: 'es' | 'en';
}
