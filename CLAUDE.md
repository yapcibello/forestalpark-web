# forestalpark-web

Web de Forestal Park Tenerife (parque de aventura en los árboles, Tenerife). Migración WordPress → Astro con réplica visual exacta del sitio original (https://www.forestalparktenerife.es/), manteniendo iframes de Turitop (reservas), formularios y PDFs descargables, mejorando textos y aplicando SEO/GEO/SEM y accesibilidad WCAG 2.2 AAA.

## Stack

- **Lenguaje**: TypeScript + Astro (.astro)
- **Framework**: Astro ^5.16.8 estático (`output: 'static'`), monorepo pnpm 9.15.0 (apps/www + packages @fp/*)
- **BD**: No aplica — sitio estático; reservas vía iframes Turitop (servicio externo)
- **Infra**: Node >=20, deploy pendiente de discovery (Hestia VPS / NUC MACVLAN / Vercel / Cloudflare Pages)

## Comandos

```bash
pnpm dev:www       # Desarrollo (apps/www)
pnpm build:www     # Build de producción
pnpm test          # Tests / verificaciones (pendiente de definir en fase estructura)
```

## Convenciones

- Idioma: español (comentarios, mensajes, docs); contenido web ES (EN si discovery confirma multiidioma)
- Naming: packages internos con scope `@fp/*` (config, seo, ui); kebab-case en archivos y rutas
- Réplica visual EXACTA del WordPress original: no cambiar maquetado, imágenes ni vídeos sin aprobación
- **URLs INMUTABLES**: las URLs de producción del WordPress original se preservan EXACTAMENTE — sin modificaciones, sin redirecciones 301. Solo se permite AMPLIAR (añadir URLs nuevas). Cualquier cambio a una URL existente requiere confirmación explícita del usuario
- `trailingSlash`: replicar el comportamiento exacto del WordPress original (verificar en fase migración, no asumir `always`)
- Patrones heredados de proyectos hermanos: logopedajessica-web (plantilla monorepo + migración WP), villena-web (@vd/seo schemas, AdsTracking), smedialab-web (AAA), vitali-web (hreflang, deploy FTPS)

## Boundaries

### Siempre

- Mantener los iframes de Turitop, formularios y PDFs descargables funcionales en cada cambio
- Verificar contraste AAA (≥7:1) y accesibilidad en todo componente nuevo
- Registrar toda desviacion respecto al plan, diseno o convenciones en docs/deviations.md (ver skill gestion/checklist-cierre-fase — Paso 2 del checklist de cierre)

### Preguntar antes

- Cambiar maquetado, imágenes o vídeos respecto al original WordPress
- **Modificar CUALQUIER URL existente del WordPress original** (la regla es: nunca modificar, solo ampliar; ningún 301 — pedir confirmación explícita al usuario antes de cualquier excepción)
- Configurar deploy a producción o tocar DNS

### Nunca

- Commitear secretos o credenciales (SMTP, GTM, API keys) — usar .env
- Eliminar o romper los embeds de Turitop sin alternativa verificada
- Hacer push a main sin build verde local
