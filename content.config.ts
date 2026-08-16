import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    learn: defineCollection({
      type: 'page',
      source: 'learn/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number().int().positive(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        category: z.string(),
        estimatedMinutes: z.number().int().positive(),
        prerequisites: z.array(z.string()).default([]),
      }),
    }),
    technologies: defineCollection({
      type: 'page',
      source: 'technologies/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number().int().positive(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        estimatedHours: z.number().int().positive(),
        status: z.enum(['available', 'coming-soon']).default('available'),
        track: z.enum(['core', 'frontend-framework', 'meta-framework', 'css-framework', 'advanced']).default('core'),
        parentFramework: z.string().optional(),
        color: z.string(),
        icon: z.string(),
        prerequisites: z.array(z.string()).default([]),
      }),
    }),
  },
})