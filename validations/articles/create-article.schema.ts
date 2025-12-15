import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

function createArticleSchema() {
  return z.object({
    slug: z
      .string(validation.required)
      .min(3, fmt(validation.string.minLength, { min: 2 }))
      .regex(/^[a-z0-9-]+$/, validation.string.slugRegex),
    name: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(256, fmt(validation.string.maxLength, { max: 256 })),
    content: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(6144, fmt(validation.string.maxLength, { max: 6144 })),
    excerpt: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(1024, fmt(validation.string.maxLength, { max: 1024 })),

    meta: z.object({
      title: z
        .string(validation.required)
        .trim()
        .min(3, fmt(validation.string.minLength, { min: 3 }))
        .max(256, fmt(validation.string.maxLength, { max: 256 })),
      description: z
        .string(validation.required)
        .trim()
        .min(3, fmt(validation.string.minLength, { min: 3 }))
        .max(1024, fmt(validation.string.maxLength, { max: 1024 })),
      keywords: z.array(z.number()).min(1, fmt(validation.custom.addAtLeastOne, { entity: 'one' })),
    }),

    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    tags: z.string().optional(),
    topics: z.string().optional(),

    image: z.string().optional(),
  });
}

type TCreateArticleForm = z.infer<ReturnType<typeof createArticleSchema>>;

export { createArticleSchema, type TCreateArticleForm };
