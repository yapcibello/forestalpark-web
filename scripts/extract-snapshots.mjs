#!/usr/bin/env node
// Extrae snapshots fieles del mirror del WordPress (Avada) a datos que la
// ruta catch-all de Astro renderiza. Réplica visual exacta:
//   - Preserva <head> y <body> originales (set:html en la ruta catch-all).
//   - Localiza SOLO assets propios (/wp-content, /wp-includes, /descargas);
//     canonical/hreflang/og quedan absolutos (correctos para el dominio).
//   - Extrae los <script> (head+body) como datos estructurados para
//     re-emitirlos como is:inline y que ejecuten (Turitop, Fusion, chaty…).
//
// Uso: node scripts/extract-snapshots.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = process.cwd();
const MIRROR = join(ROOT, '.cache/mirror');
const OUT = join(ROOT, 'apps/www/src/snapshots');
const DATA = join(OUT, 'data');

// Localiza SOLO rutas de assets propios (http/https, con o sin www, y el host
// cbsmedialab de descargas); deja intactos canonical/hreflang/og y los enlaces
// internos entre páginas.
const ASSET_ORIGIN_RE = /(?:https?:)?\/\/(?:www\.)?forestalparktenerife\.es(\/(?:wp-content|wp-includes|descargas)\/)/g;
const CBS_RE = /(?:https?:)?\/\/forestalparktenerife\.cbsmedialab\.es(\/descargas\/)/g;
function localizeAssets(html) {
  if (!html) return html;
  return html.replace(ASSET_ORIGIN_RE, '$1').replace(CBS_RE, '$1');
}

// Recorre el mirror y devuelve [{ file, route, key }]
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name === 'index.html') {
      let rel = dirname(p).slice(MIRROR.length + 1); // '' para home
      const route = rel === '__home__' ? '/' : `/${rel}/`;
      const key = rel === '__home__' ? 'home' : rel.replaceAll('/', '__');
      out.push({ file: p, route, key });
    }
  }
  return out;
}

function extract(file) {
  const raw = readFileSync(file, 'utf8');
  const doc = parse(raw, { comment: true, blockTextElements: { script: true, style: true } });

  const htmlEl = doc.querySelector('html');
  const headEl = doc.querySelector('head');
  const bodyEl = doc.querySelector('body');

  const htmlLang = (htmlEl?.getAttribute('lang') || 'es-ES');
  const htmlClass = htmlEl?.getAttribute('class') || '';
  const bodyClass = bodyEl?.getAttribute('class') || '';
  const bodyDataAttrs = {};
  for (const [k, v] of Object.entries(bodyEl?.attributes || {})) {
    if (k.startsWith('data-')) bodyDataAttrs[k] = v;
  }

  // Scripts (head+body) en orden de documento → estructurados para re-emitir.
  const scripts = [];
  for (const s of doc.querySelectorAll('script')) {
    const type = s.getAttribute('type') || '';
    // Preservar JSON-LD de Yoast (LocalBusiness, FAQPage, BreadcrumbList,
    // Organization, WebSite): son datos, no necesitan ejecutar — basta con
    // que queden en el HTML (set:html). Se dejan intactos en el <head>.
    if (type === 'application/ld+json') continue;
    const src = s.getAttribute('src');
    const entry = { src: src ? localizeAssets(src) : null };
    if (s.getAttribute('async') !== undefined) entry.async = true;
    if (s.getAttribute('defer') !== undefined) entry.defer = true;
    if (type && type !== 'text/javascript') entry.type = type;
    const id = s.getAttribute('id'); if (id) entry.id = id;
    if (!src) entry.code = s.rawText || '';
    scripts.push(entry);
    s.remove(); // quitar del HTML; se re-emiten ejecutables
  }

  const title = (headEl?.querySelector('title')?.text || '').trim();
  const metaDesc = headEl?.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const canonical = headEl?.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

  const headHtml = localizeAssets(headEl?.innerHTML || '');
  const bodyHtml = localizeAssets(bodyEl?.innerHTML || '');

  return { htmlLang, htmlClass, bodyClass, bodyDataAttrs, title, metaDesc, canonical, headHtml, bodyHtml, scripts };
}

// --- main ---
rmSync(DATA, { recursive: true, force: true });
mkdirSync(DATA, { recursive: true });

const pages = walk(MIRROR);
const manifest = [];
for (const { file, route, key } of pages) {
  const d = extract(file);
  writeFileSync(join(DATA, `${key}.head.html`), d.headHtml);
  writeFileSync(join(DATA, `${key}.body.html`), d.bodyHtml);
  manifest.push({
    key, route,
    htmlLang: d.htmlLang, htmlClass: d.htmlClass,
    bodyClass: d.bodyClass, bodyDataAttrs: d.bodyDataAttrs,
    title: d.title, metaDesc: d.metaDesc, canonical: d.canonical,
    scripts: d.scripts,
    lang: d.htmlLang.startsWith('en') ? 'en' : 'es',
  });
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Snapshots extraídos: ${manifest.length}`);
console.log(`ES: ${manifest.filter(m => m.lang === 'es').length}  EN: ${manifest.filter(m => m.lang === 'en').length}`);
