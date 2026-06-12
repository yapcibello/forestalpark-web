# Runbook — forestalpark-web

> Estado: el proyecto aún no está en producción (workflow init-web-astro en fase 3/14). Los procedimientos de deploy/rollback/backup se completarán en la fase 12 (deploy-baseline). Aquí se documenta lo operativo a día de hoy.

## Desarrollo local

**Precondiciones**: node >=20, pnpm 9.15.0.

### Pasos

```bash
pnpm install
pnpm dev:www       # servidor de desarrollo
pnpm build:www     # build de producción
pnpm check         # astro check
```

### Verificación

- [ ] Build genera `apps/www/dist/` con `/index.html` y `/en/index.html` (más páginas según avance la migración)

## Continuar el workflow init-web-astro

**Cuándo**: al retomar el proyecto en una sesión nueva.

```bash
# Estado del run
cat .ypc/runs/init-web-astro-20260612-195317/state.json
# Avanzar fases (como orquestador con sub-agentes Task)
ypc agents run-phase init-web-astro-20260612-195317 start <fase>
ypc agents run-phase init-web-astro-20260612-195317 done <fase> --artifact <path>
```

Plan completo de fases pendientes: `planes/2026-06-12-init-web-astro-fases-pendientes.md`.

## Deploy / Rollback / Backup

Pendiente — fase 12 (deploy-baseline). Se adaptará `deploy-ftp.sh` de vitali-web, que ya incluye backup previo del remoto y smoke test post-deploy; el rollback consistirá en restaurar el backup previo vía FTP.

## Debug — Problemas comunes

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| Warnings glob-loader en build | Colecciones `posts`/`faqs` vacías (sin contenido hasta fase 4) | Esperado — desaparecen al migrar contenido |
| Write/Edit bloqueado por hook | CLAUDE.md sin secciones obligatorias del blueprint | Ya resuelto; si reaparece, revisar CLAUDE.md §Stack/Comandos/Convenciones/Boundaries |
| Página EN no genera | Slug EN no existe como archivo en `src/pages/en/` | Las rutas EN son file-based con slugs traducidos — crear el archivo correspondiente |
