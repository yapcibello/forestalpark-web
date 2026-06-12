# Stack tecnológico — forestalpark-web

## Lenguajes

| Lenguaje | Versión | Uso |
|----------|---------|-----|
| TypeScript | ^5.7.3 (catalog) | Código principal (Astro + packages) |
| Astro (.astro) | ^5.16.8 (catalog) | Componentes y páginas |
| PHP | pendiente (fase deploy) | Endpoint de formularios PHP+SMTP en hosting |

## Frameworks y librerías principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| astro | ^5.16.8 | Framework principal, `output: 'static'`, i18n es/en |
| @astrojs/tailwind | ^5.1.5 | Integración Tailwind (applyBaseStyles: false) |
| tailwindcss | ^3.4.17 | Estilos (preset compartido en @fp/config) |
| @tailwindcss/typography | ^0.5.19 | Prosa de posts del blog |
| @astrojs/check | ^0.9.6 | Diagnóstico de tipos |

Las versiones se gestionan con **pnpm catalog** en `pnpm-workspace.yaml` — los package.json usan `"catalog:"`.

## Packages internos (workspace)

| Package | Propósito |
|---------|-----------|
| @fp/www (apps/www) | Única app — todas las rutas ES+EN, blog y FAQs incluidos |
| @fp/config | Tailwind preset + siteConfig |
| @fp/seo | Helpers y schemas SEO (se rellenará en fases 7-8) |
| @fp/ui | Componentes Astro compartidos (se rellenará en fase 7) |

## Servicios externos

| Servicio | Propósito | Credenciales |
|----------|-----------|-------------|
| Turitop | Sistema de reservas embebido (iframes preservados del WP) | No aplica (embed público) |
| GTM/GA4 | Analítica con Consent Mode v2 (contenedor nuevo, fase 11) | .env |
| Google Ads | Campañas activas con conversiones (inventariar en fase 11) | Cuenta del cliente |
| SMTP hosting | Envío de formularios a reservas@forestalparktenerife.es | api/config.local.php (solo servidor) |
| Hosting FTP | Deploy estático (patrón smedialab/vitali) | .env (fase 12) |

## Herramientas de desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| pnpm 9.15.0 | Gestor de paquetes y workspace del monorepo |
| node >=20 (instalado v26.1.0) | Runtime |
| sharp (fase 4) | Optimización de imágenes → AVIF/WebP |
| lightningcss | Minificación CSS (vite.build.cssMinify) |
