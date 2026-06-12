// Configuración compartida del sitio forestalpark-web.
//
// Esqueleto de la fase `estructura` (init-web-astro). Los datos definitivos
// (contacto, horarios, redes sociales, etc.) se completan en fases posteriores
// (migración / contenido). Aquí solo lo mínimo para que las apps compilen.

export const siteConfig = {
  name: 'Forestal Park Tenerife',
  legalName: 'Forestal Park Tenerife',
  title: 'Parque de aventura en los árboles — Tenerife',
  description:
    'Forestal Park Tenerife: parque de aventura y tirolinas en los árboles. Turismo activo para toda la familia en Tenerife.',

  // Idiomas: ES en raíz, EN bajo /en/ (slugs traducidos).
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,

  urls: {
    www: 'https://www.forestalparktenerife.es',
  },
  url: 'https://www.forestalparktenerife.es',

  // Contacto (provisional — verificar en fase migración).
  email: 'reservas@forestalparktenerife.es',
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export default siteConfig;
