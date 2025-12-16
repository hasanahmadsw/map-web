import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

function updateArticleSchema() {
  return z.object({
    slug: z
      .string(validation.required)
      .min(3, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
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
        .max(256, fmt(validation.string.maxLength, { max: 256 })),
      description: z
        .string(validation.required)
        .trim()
        .max(1024, fmt(validation.string.maxLength, { max: 1024 })),
      keywords: z.array(z.string().max(50, fmt(validation.string.maxLength, { max: 50 }))).optional(),
    }),

    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string().max(50, fmt(validation.string.maxLength, { max: 50 }))).optional(),
    topics: z.array(z.string().max(50, fmt(validation.string.maxLength, { max: 50 }))).optional(),

    image: z.string(validation.required).min(1, validation.required),
  });
}

type TUpdateArticleForm = z.infer<ReturnType<typeof updateArticleSchema>>;

export { updateArticleSchema, type TUpdateArticleForm };
