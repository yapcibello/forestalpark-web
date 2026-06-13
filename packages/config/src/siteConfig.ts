// Configuración compartida del sitio forestalpark-web.
//
// Datos reales del negocio (extraídos del WordPress original en la fase
// migración). Se usan para SEO/JSON-LD, hreflang, GTM y schema LocalBusiness.

export const siteConfig = {
  name: 'Forestal Park Tenerife',
  legalName: 'Forestal Park Tenerife',
  title: 'Parque de aventura y tirolinas en los árboles — Tenerife',
  description:
    'Forestal Park Tenerife: parque de aventura y tirolinas en los árboles en Las Lagunetas, monte de La Esperanza (Tenerife). Turismo activo y ocio en plena naturaleza para niños y adultos.',

  // Idiomas: ES en raíz, EN bajo /en/ (slugs traducidos).
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,

  urls: {
    www: 'https://www.forestalparktenerife.es',
  },
  url: 'https://www.forestalparktenerife.es',

  // Contacto.
  email: 'reservas@forestalparktenerife.es',
  emailAreaTecnica: 'areatecnica@forestalparktenerife.es',
  phone: '+34 630 385 742',
  phoneE164: '+34630385742',
  whatsapp: '+34630385742',

  // Ubicación (parque de aventura). NAP para LocalBusiness/TouristAttraction.
  address: {
    street: 'Ctra. La Esperanza – El Teide (TF-24), km 16',
    locality: 'Las Lagunetas, La Esperanza',
    region: 'El Rosario, Santa Cruz de Tenerife',
    country: 'ES',
    // TODO(geo): verificar coordenadas exactas con Google Maps antes de publicar el schema LocalBusiness.
    geo: { lat: null as number | null, lng: null as number | null },
  },

  social: {
    facebook: 'https://www.facebook.com/ForestalParkTenerife',
    instagram: 'https://www.instagram.com/forestalpark_tf/',
    tiktok: 'https://www.tiktok.com/@forestalpark_tf',
  },

  logo: '/wp-content/uploads/2022/12/android-icon-192x192-1.png',

  // GTM existente del cliente (detectado en el WP). Se decide reutilizar vs
  // contenedor nuevo en la fase gtm-baseline.
  gtmExistente: 'GTM-PRDC87D3',
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export default siteConfig;
