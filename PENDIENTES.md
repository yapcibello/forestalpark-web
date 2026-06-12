# Pendientes — forestalpark-web

## Prioritario

- [ ] Continuar workflow init-web-astro (run `init-web-astro-20260612-195317`): **aprobar gate de fase 3 (estructura)** y ejecutar fases 4-14 — ver [planes/2026-06-12-init-web-astro-fases-pendientes.md](planes/2026-06-12-init-web-astro-fases-pendientes.md)
- [ ] Fase 4 migración: crawl de las 145 URLs del WP (mirror `.cache/`), Content Collections, multimedia espejo + sharp→AVIF/WebP, verificación trailing slash URL a URL (R9)

## Mejoras

- [ ] Investigar si Turitop emite eventos `postMessage` para medir la conversión de compra real (si no, conversión proxy: clic Reservar + `/gracias/`)
- [ ] Confirmar disponibilidad de transcripciones/subtítulos de los vídeos del parque (requisito AAA, WCAG 1.2.x)

## Ideas

- [ ] Inventariar conversiones de las campañas Google Ads activas vía `ga4_list_google_ads_links` (no existe MCP de Google Ads) — fase gtm-baseline

## Deuda técnica

- [ ] `trailingSlash: 'always'` en astro.config.mjs es baseline — pendiente verificación URL a URL contra el WP en fase migración (URLs inmutables, cero 301)
