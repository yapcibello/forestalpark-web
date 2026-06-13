#!/usr/bin/env node
// Procesa los CSS descargados: descarga los assets que referencian por url()
// (fuentes, iconos, imágenes de plugins) y localiza esas URLs a rutas
// relativas, evitando peticiones cross-origin (CORS) en producción y local.
//
// Uso: node scripts/process-css.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'apps/www/public');

// Localiza cualquier URL absoluta a un asset propio → ruta raíz relativa.
const ASSET_ORIGIN_RE = /(?:https?:)?\/\/(?:www\.)?forestalparktenerife\.es(\/(?:wp-content|wp-includes|descargas)\/[^)'"?#\s]*)/g;

const cssFiles = globSync('apps/www/public/**/*.css', { cwd: ROOT }).map((f) => join(ROOT, f));
const toDownload = new Set();
let rewritten = 0;

for (const css of cssFiles) {
  let content = readFileSync(css, 'utf8');
  let changed = false;
  content = content.replace(ASSET_ORIGIN_RE, (_m, path) => {
    toDownload.add(path.split(/[?#]/)[0]);
    changed = true;
    return path; // ruta relativa raíz
  });
  if (changed) { writeFileSync(css, content); rewritten++; }
}

// Descargar los assets referenciados que falten.
let downloaded = 0, failed = 0;
for (const path of toDownload) {
  const dest = join(PUBLIC, path.replace(/^\//, ''));
  if (existsSync(dest)) continue;
  mkdirSync(dirname(dest), { recursive: true });
  const url = `https://www.forestalparktenerife.es${path}`;
  try {
    execFileSync('curl', ['-sfL', '--compressed', '-A', 'Mozilla/5.0 (migración Astro)', url, '-o', dest]);
    downloaded++;
  } catch { failed++; console.warn(`  ✗ ${path}`); }
}

console.log(`CSS reescritos: ${rewritten}/${cssFiles.length}`);
console.log(`Assets de CSS referenciados: ${toDownload.size} (descargados nuevos: ${downloaded}, fallidos: ${failed})`);
