import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { numberValidation } from '../common';

function updateSolutionSchema() {
  return z.object({
    slug: z
      .string()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, validation.string.slugRegex)
      .optional(),
    icon: z
      .string()
      .trim()
      .max(100, fmt(validation.string.maxLength, { max: 100 }))
      .optional(),
    featuredImage: z
      .string()
      .trim()
      .max(500, fmt(validation.string.maxLength, { max: 500 }))
      .optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    order: numberValidation(1, 100).optional(),
    name: z
      .string()
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, fmt(validation.string.minLength, { min: 10 }))
      .max(1000, fmt(validation.string.maxLength, { max: 1000 }))
      .optional(),
    shortDescription: z
      .string()
      .trim()
      .min(5, fmt(validation.string.minLength, { min: 5 }))
      .max(300, fmt(validation.string.maxLength, { max: 300 }))
      .optional(),

    meta: z
      .object({
        title: z
          .string()
          .trim()
          .max(200, fmt(validation.string.maxLength, { max: 200 }))
          .optional(),
        description: z
          .string()
          .trim()
          .max(300, fmt(validation.string.maxLength, { max: 300 }))
          .optional(),
        keywords: z.array(z.string().max(50, fmt(validation.string.maxLength, { max: 50 }))).optional(),
      })
      .optional(),
  });
}

type TUpdateSolutionForm = z.infer<ReturnType<typeof updateSolutionSchema>>;

export { updateSolutionSchema, type TUpdateSolutionForm };
