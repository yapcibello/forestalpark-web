# Desviaciones — forestalpark-web

> Registro prescriptivo de desviaciones respecto al plan, la arquitectura o las convenciones del proyecto. Toda desviacion significativa debe quedar anotada aqui antes de cerrar la fase o sesion que la produjo. Aplica la Regla 0: leer este archivo COMPLETO al iniciar cierre de fase — no omitir puntos silenciosamente.

## Formato de cada entrada

```markdown
### [YYYY-MM-DD] — Titulo corto y buscable

**Que se desvio**: descripcion concisa del cambio respecto al plan/diseno original.

**Por que**: causa tecnica o decision explicita del usuario. Incluir evidencia concreta (archivo:linea, referencia a conversacion, metrica). Vaguedades como "por simplicidad" o "para iterar" NO son evidencia valida (ver skill `meta/anti-pereza-recomendaciones` seccion P4).

**Impacto**: componentes afectados, regresiones potenciales, documentacion a actualizar.

**Decision**: que se hace ahora y que queda pendiente. Si se aplaza algo, rellenar la tabla P4 abajo.

**Aprobacion del usuario**: cita literal del mensaje donde el usuario aprobo (o "automatica — dentro del alcance acordado").

**Fecha**: YYYY-MM-DD.

---
```

### Tabla P4 (cuando se aplaza trabajo)

Si la desviacion implica aplazar una pieza del plan, rellenar:

| Item aplazado | Depende de datos emergentes? | Evidencia concreta | Que se ahorra ahora vs diferido? |
|:---|:---:|:---|:---|
| (descripcion del item) | Si/No | (referencia concreta o vacio) | (coste evitado ahora vs hacerlo luego) |

Si todos los items responden "No" en la columna 2 y la evidencia esta vacia, el aplazamiento **no es valido** — hacer el trabajo ahora en vez de registrarlo como desviacion.

---

## Desviaciones registradas

<!-- Anade nuevas entradas arriba de este comentario, en orden cronologico inverso (mas reciente primero). -->

### [2026-06-14] — Multimedia: recompresión in situ + WebP-swap (sin AVIF/`<picture>`)

**Que se desvio**: el plan F0-7 / ítem P4 preveía optimización multimedia "AVIF/WebP". Se entregó: (1) recompresión in situ de PNG/JPG manteniendo formato, nombre y dimensiones (cero cambios de referencia), y (2) conversión a WebP con reescritura de referencias `.png/.jpg → .webp` SOLO en los `<body>` de los snapshots (5523 refs en 175 archivos). **NO se generó AVIF ni se introdujo `<picture>`/`<source>`**.

**Por que**: el requisito #1 (réplica visual exacta, sin tocar maquetado/DOM) prevalece. AVIF requiere `<picture><source>` con fallback → añade nodos al DOM, violando la paridad de nº de nodos verificada. WebP tiene ~98 % de soporte de navegador y permite el swap por extensión sin añadir nodos (solo cambia el texto del atributo). La auditoría CWV local mostró que el LCP de las pillar está limitado por *render delay*, no por descarga, así que el objetivo real del multimedia es reducir bytes para usuarios móviles/páginas con héroes pesados, cumplido con WebP. El `og:image` del `<head>` se dejó en PNG/JPG por compatibilidad con scrapers sociales.

**Impacto**: 45 PNG/JPG recomprimidos + 176 WebP nuevos en `apps/www/public/wp-content/uploads`; 175 `*.body.html` con referencias a WebP. PNG dist 21,3 → 6,7 MB; raster servido mucho más ligero. Réplica visual intacta (nº de nodos de las 4 pillar sin cambios). Quedan en dist los PNG/JPG originales (no servidos salvo `og:image`) como peso muerto en disco, sin impacto en runtime. Pendiente menor: `blog-hero-background.jpg` es un HTML, no un JPEG (artefacto de migración).

**Decision**: WebP-swap como entrega de F0-7. AVIF queda disponible como mejora futura SOLO si se acepta introducir `<picture>` (cambio de DOM) — requeriría aprobación explícita por la regla de réplica.

**Aprobacion del usuario**: el usuario eligió "Hacer WebP-swap ahora" en la pregunta de cierre de multimedia (2026-06-14), tras explicarle el trade-off réplica vs AVIF/`<picture>`.

**Fecha**: 2026-06-14.

---

### [2026-06-13] — Migración por snapshot fiel en vez de Content Collections

**Que se desvio**: el plan de la fase migración (heredado de logopedajessica-web) prescribía extraer el contenido del WordPress a Content Collections (posts/faqs) y re-componentizar las páginas en Astro. En su lugar se adoptó **preservación de snapshot**: se sirve el `<head>`/`<body>` original de cada una de las 145 páginas vía una ruta catch-all de Astro (`set:html` + scripts re-emitidos como `is:inline`), localizando solo los assets propios.

**Por que**: el sitio es un page builder Avada (Fusion). Re-componentizar 145 páginas a mano con fidelidad pixel es inviable y diverge visualmente del original — incumpliría el requisito #1 explícito del usuario ("que se vea exactamente visualmente, manteniendo el maquetado"). Evidencia: comparación por captura entre original y build local de `/` y `/circuitos-de-aventura/` resultó pixel-equivalente con el enfoque snapshot. El enfoque es determinista (3 scripts: extract-snapshots.mjs, process-css.mjs, [...slug].astro) y regenerable.

**Impacto**: `apps/www/src/content/config.ts` (esqueleto de colecciones) queda sin poblar. Las mejoras de texto/SEO/GEO/AAA se aplicarán sobre los snapshots o re-componentizando páginas concretas en fases posteriores. Astro sigue controlando el documento → inyección de GTM/JSON-LD/AAA posible sin tocar el maquetado.

**Decision**: snapshot fiel como baseline de la fase migración. Content Collections y optimización multimedia (AVIF/WebP) se difieren (ver tabla P4).

**Aprobacion del usuario**: dentro del alcance acordado — el requisito explícito "se vea exactamente visualmente… sin cambiar el maquetado, imágenes o videos" prevalece sobre el patrón de migración del plantilla. Pendiente de mostrar al usuario en el reporte de fase.

**Fecha**: 2026-06-13.

#### Tabla P4

| Item aplazado | Depende de datos emergentes? | Evidencia concreta | Que se ahorra ahora vs diferido? |
|:---|:---:|:---|:---|
| Content Collections (posts/faqs) | Sí | Las fases SEO/GEO (8-9) determinarán si hace falta re-componentizar plantillas concretas para schema/structured-answers; hoy los snapshots ya sirven el contenido fiel | Evita re-componentizar 145 páginas que ya se ven idénticas; se hará selectivo solo donde la auditoría lo pida |
| Optimización multimedia AVIF/WebP | Sí | La auditoría CWV (fase 13) dirá qué imágenes penalizan LCP; reescribir `<img src>` ahora arriesga la fidelidad pixel recién verificada | Evita tocar 378 assets a ciegas; pasada de performance dirigida por métricas reales — **RESUELTO 2026-06-14**: recompresión in situ + WebP-swap (sin AVIF), ver entrada superior |

---
