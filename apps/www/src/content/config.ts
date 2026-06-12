import { defineCollection, z } from 'astro:content';

// Content Collections de forestalpark-web.
//
// ESQUELETO fase `estructura` (init-web-astro). Schemas Zod básicos para las
// dos colecciones que vendrán de la migración WordPress:
//   - posts: 35 entradas de blog (viven en la RAÍZ del dominio, no bajo /blog/)
//   - faqs:  76 FAQ items (custom post type avada_faq con URL propia)
// El contenido se importa en la fase de migración (fase 4). Aquí solo el schema.

// Categorías de blog del WP original (team building, cumpleaños, despedidas,
// eventos deportivos, rodajes, grupos escolares, etc.). Se modela como string
// libre por ahora; se acotará con enum cuando se inventaríen en migración.
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['es', 'en']),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    categories: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Slug de la entrada equivalente en el otro idioma (para hreflang ES↔EN).
    translationSlug: z.string().optional(),
  }),
});

const faqs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    lang: z.enum(['es', 'en']),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    categories: z.array(z.string()).default([]),
    translationSlug: z.string().optional(),
  }),
});

export const collections = { posts, faqs };
