# Pendientes — forestalpark-web

## Prioritario — Camino a producción (ver [plan F0](planes/2026-06-13-f0-bootstrap-forestalpark/README.md))

- [ ] **F0-1** Repuntar formularios Fusion a `/api/contacto.php` + adaptar submit (bloqueante)
- [ ] **F0-2/3** Credenciales FTP (`.env`) y SMTP (`config.local.php` en servidor) + PHPMailer
- [ ] **F0-4** Verificar las 145 URLs en 200 tras el deploy
- [ ] **F0-5** Remediación a11y (iframes title, labels, contraste) → AA total
- [ ] **F0-6** Mejorar textos de páginas pillar (requisito del cliente) sin tocar maquetado

## Mejoras

- [ ] Investigar si Turitop emite eventos `postMessage` para medir la conversión de compra real (si no, conversión proxy: clic Reservar + `/gracias/`)
- [ ] Confirmar disponibilidad de transcripciones/subtítulos de los vídeos del parque (requisito AAA, WCAG 1.2.x)

## Ideas

- [ ] Inventariar conversiones de las campañas Google Ads activas vía `ga4_list_google_ads_links` (no existe MCP de Google Ads) — fase gtm-baseline

## Deuda técnica

- [ ] `trailingSlash: 'always'` en astro.config.mjs es baseline — pendiente verificación URL a URL contra el WP en fase migración (URLs inmutables, cero 301)
