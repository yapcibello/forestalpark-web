<div align="center">
  <h1>forestalpark-web</h1>
  <p><em>Web de Forestal Park Tenerife — migración WordPress → Astro con réplica visual exacta, SEO/GEO/SEM y accesibilidad WCAG 2.2 AAA</em></p>
</div>

---

## :rocket: Características

| Característica | Estado | Descripción |
|:---|:---:|:---|
| Monorepo pnpm + Astro 5 | :white_check_mark: | apps/www + packages @fp/config, @fp/seo, @fp/ui — build verde |
| Bilingüe ES + EN | :construction: | ES en raíz, EN bajo `/en/` con slugs traducidos (i18n Astro) |
| Migración WordPress | :construction: | 145 URLs inmutables del sitemap Yoast (páginas, blog, FAQs Avada) |
| Reservas Turitop | :construction: | Iframes de Turitop preservados del sitio original |
| SEO/GEO + AAA | :construction: | Baselines en fases 8-10 del workflow init-web-astro |

## :wrench: Instalación

```bash
# Requiere node >=20 y pnpm 9.15.0
pnpm install
```

## :book: Uso

```bash
pnpm dev:www       # Servidor de desarrollo (apps/www)
pnpm build:www     # Build de producción
pnpm check         # astro check (tipos y diagnósticos)
```

## :file_folder: Estructura del proyecto

<details>
<summary><strong>Ver estructura completa</strong></summary>

```
forestalpark-web/
├── apps/
│   └── www/                  # Única app — sirve TODAS las rutas (páginas, blog, FAQs, ES+EN)
│       ├── astro.config.mjs  # site, i18n es/en, trailingSlash always, static
│       └── src/
│           ├── content/      # Content Collections: posts, faqs
│           ├── layouts/
│           ├── pages/        # ES en raíz
│           │   └── en/       # EN con slugs traducidos
│           └── styles/
├── packages/
│   ├── config/               # @fp/config — tailwind preset + siteConfig
│   ├── seo/                  # @fp/seo — helpers y schemas SEO
│   └── ui/                   # @fp/ui — componentes Astro compartidos
├── proyecto/                 # Blueprint ypc (stack, arquitectura, despliegue, api, runbook)
├── planes/                   # Planes de implementación
└── docs/                     # Documentación específica
```

</details>

## :page_facing_up: Documentación

| Documento | Descripción |
|:---|:---|
| [Stack tecnológico](proyecto/stack.md) | Lenguajes, frameworks y servicios |
| [Arquitectura](proyecto/arquitectura.md) | Componentes y flujo de datos |
| [Despliegue](proyecto/despliegue.md) | Instrucciones de deploy |
| [API](proyecto/api.md) | Referencia de endpoints |
| [Runbook](proyecto/runbook.md) | Procedimientos operacionales |
| [Pendientes](PENDIENTES.md) | Tareas y mejoras pendientes |
| [Completado](COMPLETADO.md) | Tareas finalizadas |
| [Changelog](CHANGELOG.md) | Historial de cambios |

> [!NOTE]
> La documentación estándar del proyecto está en `proyecto/`.
> La documentación técnica específica está en `docs/`.

> [!IMPORTANT]
> **URLs inmutables**: las 145 URLs del WordPress original se preservan exactamente — sin modificaciones ni redirecciones 301. Solo se permite añadir URLs nuevas. Ver [CLAUDE.md](CLAUDE.md) §Boundaries.

---

**Desarrollado con ❤️ por el equipo de SMedialab**
