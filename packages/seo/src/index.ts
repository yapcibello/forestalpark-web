// @fp/seo — helpers SEO para forestalpark-web.
//
// El <head> preservado de cada snapshot ya trae el JSON-LD de Yoast
// (Organization, WebSite, BreadcrumbList, FAQPage). Aquí se añade el schema
// LocalBusiness/TouristAttraction que el WP original NO tenía, con los datos
// NAP reales de siteConfig — mejora de SEO local sin tocar el maquetado.

import siteConfig from '@fp/config';

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  lang: 'es' | 'en';
}

/**
 * Schema TouristAttraction (un parque de aventura es una atracción turística;
 * extiende LocalBusiness). Solo se emite en la home. No fabrica geo/horarios:
 * se omiten hasta verificarlos (ver TODO en siteConfig.address.geo).
 */
export function buildTouristAttractionSchema(lang: 'es' | 'en' = 'es') {
  const a = siteConfig.address;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url + (lang === 'en' ? '/en/' : '/'),
    image: siteConfig.url + siteConfig.logo,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    sameAs: Object.values(siteConfig.social),
    isAccessibleForFree: false,
    publicAccess: true,
  };
  if (a.geo.lat != null && a.geo.lng != null) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng };
  }
  return schema;
}
