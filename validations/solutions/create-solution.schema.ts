import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { numberValidation } from '../common';

function createSolutionSchema() {
  return z.object({
    slug: z
      .string(validation.required)
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, validation.string.slugRegex),
    icon: z
      .string(validation.required)
      .trim()
      .min(1, validation.required)
      .max(100, fmt(validation.string.maxLength, { max: 100 })),
    featuredImage: z
      .string(validation.required)
      .trim()
      .min(1, validation.required)
      .max(500, fmt(validation.string.maxLength, { max: 500 })),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    order: numberValidation(1, 100).optional(),
    name: z
      .string(validation.required)
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 })),
    description: z
      .string(validation.required)
      .trim()
      .min(10, fmt(validation.string.minLength, { min: 10 }))
      .max(1000, fmt(validation.string.maxLength, { max: 1000 })),
    shortDescription: z
      .string(validation.required)
      .trim()
      .min(5, fmt(validation.string.minLength, { min: 5 }))
      .max(300, fmt(validation.string.maxLength, { max: 300 })),

    meta: z.object({
      title: z
        .string(validation.required)
        .trim()
        .max(200, fmt(validation.string.maxLength, { max: 200 })),
      description: z
        .string(validation.required)
        .trim()
        .max(300, fmt(validation.string.maxLength, { max: 300 })),
      keywords: z.array(z.string().max(50, fmt(validation.string.maxLength, { max: 50 }))).optional(),
    }),
  });
}

type TCreateSolutionForm = z.infer<ReturnType<typeof createSolutionSchema>>;

export { createSolutionSchema, type TCreateSolutionForm };
