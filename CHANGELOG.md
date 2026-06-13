# Changelog — forestalpark-web

## [2026-06-13] — Cobertura total de URLs + formularios funcionales

- **Formularios**: `public/js/fp-forms.js` intercepta los formularios Fusion (captura + `stopImmediatePropagation`) y los reenvía a `/api/contacto.php`; éxito → `/gracias/`. Verificado end-to-end. `contacto.php` distingue newsletter de contacto.
- **URLs más allá del sitemap**: descubiertas y migradas **30 URLs reales** fuera del sitemap Yoast (16 páginas de categoría FAQ ES/EN + 14 de paginación real de blog/faq-items). Profundidad de paginación detectada por fingerprint para evitar los soft-200 duplicados de WordPress.
- **Redirects fieles**: 4 (archivos de autor → home; 2 posts EN con slug antiguo → su canónica migrada), replicando el comportamiento del WP.
- **Total**: 181 páginas construidas (175 snapshots + 4 redirects + 2 accesibilidad). Inmutabilidad 0/145 del sitemap. `scripts/urls-extra-no-sitemap.txt` documenta las URLs extra para reproducir el crawl.

## [2026-06-13] — Baselines y cierre del workflow init-web-astro (fases 6-14)

- **Skills**: 31 skills instalados (Astro/SEO/GEO/AAA/GTM/Turitop/Ads).
- **SEO**: schema Yoast restaurado en las 145 páginas (FAQPage, Organization, WebSite, BreadcrumbList) + TouristAttraction nuevo en home; sitemaps (Astro nuevo + Yoast original preservado); robots.txt.
- **GEO**: `llms.txt` con datos verificables, páginas e índice de 76 FAQ.
- **Accesibilidad**: declaración `/accesibilidad/` y `/en/accessibility/` (AA parcial real, no AAA total sin evidencia).
- **GTM/SEM**: decisión de conservar el contenedor existente `GTM-PRDC87D3` (ya tiene `purchase`, `pasos_turitop`, `generate_lead`, `correo`, `whatsapp`, `descarga` + Google Ads vinculado). Inventario vía MCP GA4 (property 343612965).
- **Deploy**: `scripts/deploy-ftp.sh` (lftp + smoke), endpoint `api/contacto.php` (PHP+SMTP), `.env.example`.
- **Verificación**: build 147 páginas; **inmutabilidad 0/145 URLs sin construir**; Lighthouse SEO 92, A11y 85. Veredicto PASS.
- **Plan F0**: `planes/2026-06-13-f0-bootstrap-forestalpark/` con tareas hasta producción.

## [2026-06-13] — Migración fiel de las 145 páginas (fases 4-5)

- **Réplica visual exacta**: las 145 URLs del WordPress (Avada + Yoast) construyen como páginas Astro estáticas idénticas. Verificado pixel-equivalente por captura (home y circuitos) original vs build local.
- **Arquitectura snapshot**: mirror de las 145 URLs → `extract-snapshots.mjs` (head/body/scripts, assets localizados) → `process-css.mjs` (fuentes/iconos de CSS + localización url()) → ruta catch-all `[...slug].astro` (set:html + scripts is:inline). Decisión registrada en `docs/deviations.md` (snapshot vs Content Collections).
- **Preservados**: iframes Turitop (reservas), 28 PDFs en `/descargas/{es,en}/`, vídeos YouTube, widgets (AEMET, Chaty, Trustindex, Cookie-Script). 378 assets locales (148 MB).
- **Detectado**: GTM existente del cliente `GTM-PRDC87D3` (retirar al añadir el nuevo en fase 11).
- Blueprint actualizado al enfoque snapshot (arquitectura.md).

## [2026-06-12] — Bootstrap del proyecto (workflow init-web-astro, fases 1-3)

- **Preflight**: repo verificado (vacío, main, remote GitHub), herramientas OK (node v26.1.0, pnpm 9.15.0, git 2.54.0), análisis de proyectos hermanos como plantilla (logopedajessica-web base; aportes de smedialab, villena y vitali).
- **Discovery**: 9 decisiones capturadas y aprobadas — hosting FTP, formularios PHP+SMTP, GTM nuevo + Consent Mode v2, Ads activo, crawl HTML público, multimedia espejo+optimización, solo validación local. Crawl del sitemap Yoast: **145 URLs inmutables** (16 páginas, 35 posts, 76 FAQs Avada, 18 categorías), bilingüe ES+EN confirmado.
- **Estructura**: monorepo pnpm creado — `apps/www` (@fp/www, Astro ^5.16.8, i18n es/en, static, trailingSlash always) + packages `@fp/config`, `@fp/seo`, `@fp/ui` + catalog de versiones. Build verde (2 páginas placeholder ES/EN), `astro check` 0 errores.
- **Restricción crítica registrada**: URLs de producción inmutables — cero 301, solo ampliar; excepciones requieren confirmación del usuario (CLAUDE.md §Boundaries).
- Blueprint ypc inicializado y rellenado con contenido real (CLAUDE.md, README, proyecto/*).
- Plan de continuación guardado: `planes/2026-06-12-init-web-astro-fases-pendientes.md` (fases 4-14, gate de fase 3 pendiente de aprobar al retomar).

## [2026-06-12] — Inicio del proyecto

- Configuración inicial del proyecto
- Estructura de documentación con blueprint
