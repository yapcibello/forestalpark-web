# Plan de continuación — workflow init-web-astro (fases pendientes)

> **Fecha**: 2026-06-12
> **Run ID**: `init-web-astro-20260612-195317`
> **Run dir**: `.ypc/runs/init-web-astro-20260612-195317/` (artefactos en `artifacts/`)
> **Estado al guardar**: fase 3 (estructura) completada, **gate pendiente de aprobar**; fases 4-14 pendientes.

## Cómo retomar en una sesión nueva

1. Leer este plan + los 3 artefactos completados:
   - `.ypc/runs/init-web-astro-20260612-195317/artifacts/preflight_report.md`
   - `.ypc/runs/init-web-astro-20260612-195317/artifacts/discovery_json.md` ← **fuente de verdad de las 9 decisiones**
   - `.ypc/runs/init-web-astro-20260612-195317/artifacts/structure_created.md`
2. El estado del run se consulta/avanza con:
   ```bash
   ypc agents run-phase init-web-astro-20260612-195317 start <fase>
   ypc agents run-phase init-web-astro-20260612-195317 done <fase> --artifact <path>
   ```
3. Continuar como orquestador delegate-only: cada fase se ejecuta con un sub-agente Task (agente indicado abajo), inyectando en el prompt el contenido COMPLETO de los artefactos predecesores (nunca solo paths). El orquestador escribe los artefactos de los agentes read-only; el implementer escribe código directamente.
4. Gate pendiente AL RETOMAR: aprobar fase `estructura` (ya mostrada al usuario, faltó su confirmación — preguntarla primero).

## Decisiones cerradas (resumen — detalle en discovery_json.md)

- **URLs INMUTABLES**: 145 URLs del sitemap Yoast se replican EXACTAS, cero 301, solo ampliar. Excepción → preguntar al usuario. (También en CLAUDE.md §Boundaries.)
- Bilingüe ES (raíz) + EN (`/en/`, slugs traducidos) · blog en raíz del dominio (35 posts + 18 categorías) · 76 FAQ items con URL propia
- Hosting FTP (patrón smedialab/vitali, `deploy-ftp.sh` + backup + smoke) · formularios PHP+SMTP a reservas@ · GTM nuevo + Consent Mode v2 · Ads activo (inventariar con `ga4_list_google_ads_links`) · crawl HTML público · multimedia espejo completo + sharp→AVIF/WebP · **staging: solo validación local** (riesgo aceptado por el usuario)
- Réplica visual EXACTA del tema Avada; mejorar textos sin tocar maquetado; AAA WCAG 2.2

## Fases pendientes

| # | Fase | Agente | Gate | Qué hace |
|---|---|---|---|---|
| 4 | `migracion` | implementer | no | Crawl de las 145 URLs del WP (mirror en `.cache/`), extracción de contenido a Content Collections (posts, faqs) y páginas file-based ES+EN con slugs exactos. Descarga espejo de multimedia + optimización sharp→AVIF/WebP. Verificar trailing slash URL a URL (R9). Mejorar textos SIN cambiar maquetado. |
| 5 | `blueprint` | implementer | no | Rellenar los 11 archivos ypc (proyecto/stack.md, arquitectura.md, despliegue.md, api.md, runbook.md, README.md raíz con firma SMedialab, PENDIENTES, CHANGELOG…) con contenido REAL del discovery. |
| 6 | `skills` | skills-analyzer | **SÍ** | Instalar symlinks de skills relevantes (astro, seo, accesibilidad, gtm…) según stack + tipo_negocio turismo. |
| 7 | `astro-baseline` | implementer | no | Layout AAA completo, componentes UI (Header/Footer réplica Avada), preset Content Collections definitivo. |
| 8 | `seo-baseline` | seo-auditor | no | sitemap+images, robots.txt, canonical strict, JSON-LD (LocalBusiness/TouristAttraction, FAQPage, BreadcrumbList), hreflang es↔en + x-default. |
| 9 | `geo-baseline` | geo-auditor | no | Citabilidad LLMs: BloqueCitaRapida, FAQAccesible, AutoridadDeclarada, llms.txt. |
| 10 | `a11y-baseline` | accesibilidad-auditor | no | `/accesibilidad/` declarada (W3C), tokens contrastados ≥7:1, focus visible, tap targets. OJO: página nueva = URL AMPLIADA (permitido). |
| 11 | `gtm-baseline` | implementer | no | .env GTM, dataLayer, eventos (AdsTracking de villena), Consent Mode v2, inventario Ads links vía MCP GA4, conversión proxy Turitop (clic Reservar + /gracias/). |
| 12 | `deploy-baseline` | implementer | no | `deploy-ftp.sh` adaptado (backup + smoke), estructura de secrets (.env.example), endpoint PHP+SMTP formularios. |
| 13 | `verificacion` | verifier | **SÍ** | pnpm install + build + lighthouse + html-diff contra WP + checklist 145 URLs en 200. |
| 14 | `plan-f0` | spec-writer | **SÍ** | `planes/<fecha>-f0-bootstrap-forestalpark/README.md` con tareas humanas hasta producción (credenciales FTP, GTM container real, corte DNS, etc.). |

## Riesgos vivos a vigilar

- **R9 (alto)**: inmutabilidad de 145 URLs — verificación URL a URL obligatoria en fases 4 y 13.
- **R-D9 (medio, aceptado)**: sin staging — el checklist pre-corte DNS de plan-f0 debe ser exhaustivo.
- **R-D6 (medio)**: conversión real de Turitop quizá no medible (iframe cross-origin) — proxy + investigar postMessage.
- **R7 (medio)**: AAA con vídeos exige transcripciones — confirmar material en fase 4.
- **R3 (medio)**: CSP/frame-src para dominios Turitop — documentar en fases 7/12.

## Notas operativas

- Los sub-agentes implementer tienen techo de turnos (~25-30): para la fase 4 (migración, 145 URLs) **trocear en varios Task** (p. ej. mirror+análisis / páginas ES / páginas EN / posts / FAQs / multimedia) aplicando el protocolo Write-once (Read completo → Write 1 operación por archivo).
- Tras cada fase: reporte estándar al usuario (tabla + hallazgos + recomendación) y `run-phase done`.
- Al finalizar todas: escribir `artifacts/telemetria.json` (gates + umbrales).
- Memoria persistente: guardar decisiones/gotchas con `mem_save` (proyecto `forestalpark-web`).
