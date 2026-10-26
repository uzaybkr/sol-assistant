// Resources = Markdown articles in src/content/resources/. Add a .md file with this front matter to publish one.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    minutes: z.number(),
  }),
});

export const collections = { resources };
