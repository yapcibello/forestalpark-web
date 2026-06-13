# Plan F0 — De la réplica fiel a producción · Forestal Park Tenerife

> **Estado**: el workflow init-web-astro completó las 14 fases. El sitio Astro
> replica fielmente las 145 URLs del WordPress (verificado pixel + 0/145 URLs
> sin construir). Este plan recoge las **tareas humanas/técnicas pendientes**
> para llegar a producción y cumplir al 100% los requisitos del cliente.
>
> Run: `init-web-astro-20260612-195317` · Fecha: 2026-06-13

## Qué está hecho

- ✅ Réplica visual exacta de las 145 páginas (snapshot Avada servido por Astro).
- ✅ URLs inmutables (0/145 sin construir), iframes Turitop, 28 PDFs, vídeos, widgets preservados.
- ✅ SEO: schema Yoast preservado + TouristAttraction, sitemaps (nuevo + Yoast original), robots.txt.
- ✅ GEO: llms.txt publicado.
- ✅ A11y: declaración `/accesibilidad/` (AA parcial real) ES/EN.
- ✅ GTM existente conservado (conversiones + Ads intactos).
- ✅ Deploy: `deploy-ftp.sh` + endpoint PHP de formularios + `.env.example`.

## Tareas pendientes hasta producción

### 🔴 Bloqueantes (sin esto no funciona en producción)

| # | Tarea | Detalle | Responsable |
|---|---|---|---|
| F0-1 | **Repuntar formularios** | Cambiar `action` de los formularios Fusion a `/api/contacto.php` y adaptar el submit (AJAX Fusion → fetch/POST). Sin esto, los formularios no envían. | Dev |
| F0-2 | **Credenciales FTP** | Rellenar `.env` (FTP_HOST/USER/PASS/REMOTE_DIR) con los datos del hosting actual. | Cliente + Dev |
| F0-3 | **SMTP del formulario** | Crear `apps/www/public/api/config.local.php` en el servidor con credenciales SMTP; subir PHPMailer (`vendor/`) o validar `mail()`. | Dev |
| F0-4 | **Verificar URLs en producción** | Tras subir, el smoke de `deploy-ftp.sh` debe dar 200 en las URLs clave; comprobar manualmente una muestra de las 145. | Dev |

### 🟡 Importantes (calidad / requisitos del cliente)

| # | Tarea | Detalle |
|---|---|---|
| F0-5 | **Remediación a11y** | Añadir `title` a iframes (Turitop/AEMET), `aria-label` a enlaces sin nombre, subir contraste de tokens. Objetivo: AA total → actualizar `/accesibilidad/`. Lighthouse actual: 85. |
| F0-6 | **Mejorar textos** (requisito #3) | Reescribir textos de páginas pillar (circuitos, eventos, home) para SEO/GEO sin tocar maquetado, guiado por `geo-content-scoring` y `copywriting`. |
| F0-7 | **Optimización multimedia** | sharp → AVIF/WebP en imágenes pesadas, dirigido por auditoría CWV (reescritura controlada de `<img>`). |
| F0-8 | **Coordenadas geo** | Verificar lat/lng reales del parque y añadirlas al schema TouristAttraction (`siteConfig.address.geo`). |
| F0-9 | **GTM Consent Mode v2** | Confirmar en el contenedor `GTM-PRDC87D3` que Consent Mode v2 está activo (cookie-script presente). Verificar que `purchase`, `pasos_turitop`, `descarga`, `correo`, `whatsapp` siguen disparando tras el corte. |

### 🟢 Recomendable

| # | Tarea | Detalle |
|---|---|---|
| F0-10 | Enlazar `/accesibilidad/` desde el footer (edición controlada del snapshot del footer). |
| F0-11 | Migrar el sitemap en Search Console al nuevo, manteniendo el `sitemap_index.xml` antiguo activo. |
| F0-12 | Considerar staging real antes del corte DNS (el cliente eligió solo validación local — riesgo aceptado). |
| F0-13 | Auditoría triangulada de accesibilidad completa (agente `accesibilidad-auditor`) y de SEO/GEO (`seo-auditor`, `geo-auditor`). |

## Procedimiento de corte a producción (resumen)

1. Completar F0-1..F0-3.
2. `bash scripts/deploy-ftp.sh --build --dry-run` → revisar.
3. `bash scripts/deploy-ftp.sh --build` → sube + smoke.
4. Verificar muestra de las 145 URLs + formulario + reserva Turitop + descarga PDF.
5. Confirmar conversiones GTM en tiempo real (GA4).

## Regenerar la réplica (si el WP origen cambia antes del corte)

```bash
# 1. Re-crawl del mirror (.cache/mirror) — ver scripts del repo
# 2. Re-extraer y reprocesar:
node scripts/extract-snapshots.mjs
node scripts/process-css.mjs
pnpm build:www
```

## Referencias

- Artefactos del run: `.ypc/runs/init-web-astro-20260612-195317/artifacts/`
- Decisiones: `docs/deviations.md`, memoria persistente (proyecto forestalpark-web)
- Arquitectura: `proyecto/arquitectura.md`
