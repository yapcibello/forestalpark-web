#!/bin/bash
# Deploy a producción vía FTP/FTPS — Forestal Park Tenerife.
# Adaptado del patrón battle-tested de vitali-web/smedialab-web (versión simple
# mirror para una sola app). Sube apps/www/dist al docroot y elimina huérfanos.
#
# Uso: bash scripts/deploy-ftp.sh [--build] [--dry-run]
#   --build    ejecuta `pnpm build:www` antes de subir
#   --dry-run  muestra qué haría lftp sin subir nada
#
# Requiere credenciales en .env (ver .env.example):
#   FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR (docroot, p.ej. /public_html/)
#
# SSL (heredado de vitali, G-5): verificamos la CADENA del certificado
# (`verify-certificate yes` — corta MITM) pero desactivamos check-hostname si se
# conecta por IP. Si el host es un dominio con cert válido, pon check-hostname yes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"
DIST_DIR="$PROJECT_DIR/apps/www/dist"
BASE_URL="https://www.forestalparktenerife.es"

DO_BUILD=0; DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --build) DO_BUILD=1 ;;
    --dry-run) DRY_RUN=1 ;;
    *) echo "Arg desconocido: $arg"; exit 1 ;;
  esac
done

# Cargar credenciales.
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: falta .env (cópialo de .env.example y rellena las credenciales FTP)."; exit 1
fi
set -a; . "$ENV_FILE"; set +a
: "${FTP_HOST:?Falta FTP_HOST en .env}"
: "${FTP_USER:?Falta FTP_USER en .env}"
: "${FTP_PASS:?Falta FTP_PASS en .env}"
: "${FTP_REMOTE_DIR:?Falta FTP_REMOTE_DIR en .env}"
CHECK_HOSTNAME="${FTP_CHECK_HOSTNAME:-no}"

# Build opcional.
if [ "$DO_BUILD" -eq 1 ]; then
  echo "[build] pnpm build:www…"
  ( cd "$PROJECT_DIR" && pnpm build:www )
fi
if [ ! -d "$DIST_DIR" ]; then
  echo "Error: no existe $DIST_DIR. Ejecuta con --build o haz el build antes."; exit 1
fi

PAGES=$(find "$DIST_DIR" -name index.html | wc -l)
echo "[deploy] $PAGES páginas en dist → ${FTP_HOST}:${FTP_REMOTE_DIR}"

DRY=""; [ "$DRY_RUN" -eq 1 ] && DRY="--dry-run"

# mirror --reverse: sube local→remoto. --delete: elimina huérfanos remotos.
# --only-newer y --parallel aceleran. Se excluyen artefactos locales.
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ssl:verify-certificate yes
set ssl:check-hostname $CHECK_HOSTNAME
set net:timeout 120
set net:max-retries 5
set ftp:ssl-force true
set ftp:ssl-protect-data true
mirror --reverse --delete --only-newer --parallel=4 $DRY \
  --exclude-glob .DS_Store --exclude-glob Thumbs.db \
  "$DIST_DIR/" "$FTP_REMOTE_DIR"
quit
EOF

if [ "$DRY_RUN" -eq 1 ]; then echo "✓ Dry-run completado (no se subió nada)."; exit 0; fi

echo ""
echo "[smoke] Verificando URLs clave (200 + patrón)…"
SMOKE="/|Forestal /circuitos-de-aventura/|aventura /compra-aventura-tirolinas/|turitop /en/|Forestal /accesibilidad/|accesibilidad /sitemap_index.xml|urlset /robots.txt|Sitemap"
FAIL=0
for pg in $SMOKE; do
  path="${pg%%|*}"; pattern="${pg#*|}"; url="${BASE_URL%/}${path}"
  CODE=$(curl -s -o /tmp/smoke-fp.$$ -w "%{http_code}" --max-time 15 "$url" || echo "000")
  if [ "$CODE" != "200" ]; then echo "  ✗ $url → HTTP $CODE"; FAIL=1
  elif [ -n "$pattern" ] && ! grep -qi "$pattern" /tmp/smoke-fp.$$ 2>/dev/null; then echo "  ✗ $url → 200 sin '$pattern'"; FAIL=1
  else echo "  ✓ $url → 200"; fi
  rm -f /tmp/smoke-fp.$$
done

echo ""
[ "$FAIL" -eq 1 ] && { echo "⚠ Smoke con incidencias — revisa el deploy."; exit 2; }
echo "✓ Deploy completado y verificado ($PAGES páginas)."
echo "  Sin rollback automático: ante un fallo, restaurar backup del hosting o git revert + redeploy."
