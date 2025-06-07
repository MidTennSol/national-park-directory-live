import { defineCollection, z } from 'astro:content';

// Define the schema for the Blog collection
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    // Additional fields used in blog posts
    park: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    category: z.string().optional(),
    excerpt: z.string().optional(),
    activities: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
}; 