# Despliegue — forestalpark-web

> Estado: **pendiente de configurar** — se define en la fase 12 (deploy-baseline) del workflow init-web-astro. Decisión de discovery ya tomada: deploy por FTP como smedialab-web y vitali-web.

## Entorno de producción

- **Plataforma**: Hosting con acceso FTP/FTPS (mismo patrón que smedialab-web y vitali-web; el sitio actual WordPress vive ahí — credenciales pendientes)
- **URL**: https://www.forestalparktenerife.es/
- **Rama de deploy**: main

## Requisitos previos

- Build verde local: `pnpm build:www`
- Credenciales FTP del hosting en `.env` (pendiente — fase 12 / plan F0)
- Restricción: las 145 URLs del WP original deben responder 200 idénticas tras el deploy (cero 301)

## Pasos de despliegue

```bash
# Pendiente fase 12 — se adaptará deploy-ftp.sh de vitali-web:
# 1. pnpm build:www
# 2. backup previo del remoto
# 3. subida FTP del dist/
# 4. smoke test post-deploy
```

## Variables de entorno

| Variable | Descripción | Origen |
|----------|-------------|--------|
| FTP_HOST / FTP_USER / FTP_PASS | Credenciales de deploy (pendiente fase 12) | .env |
| PUBLIC_GTM_ID | Contenedor GTM nuevo (pendiente fase 11) | .env |
| SMTP (PHP) | Credenciales de envío de formularios — solo en servidor | api/config.local.php |

## Verificación post-deploy

- [ ] Las 145 URLs del sitemap original responden 200 (sin 301/404)
- [ ] Iframes Turitop cargan y permiten reservar
- [ ] Formulario de contacto entrega en reservas@forestalparktenerife.es
- [ ] html-diff sin regresiones visuales contra el baseline
