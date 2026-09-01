import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    starName: z.string(),
    coord: z.array(z.number()).length(3), // [x, y, z] in 3D stellar chart
    color: z.string().default('#00E5FF'),
    status: z.string().default('OPERATIONAL'), // e.g. DEPLOYED, PROTOTYPE, TESTING, ACTIVE
    category: z.string().default('HARDWARE'), // e.g. HARDWARE / PCB, EMBEDDED, POWER ELECTRONICS, ROBOTICS
    summary: z.string(),
    specs: z.array(z.object({
      label: z.string(),
      val: z.string(),
    })).optional().default([]),
    tech: z.array(z.string()).optional().default([]),
    order: z.number().optional().default(100),
    coverImage: z.string().optional(),
    github: z.string().optional(),
    schematicUrl: z.string().optional(),
  }),
});

export const collections = { projects };
