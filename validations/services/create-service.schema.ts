import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { subServiceSchema } from './subservice.schema';

function createServiceSchema() {
  return z.object({
    slug: z
      .string(validation.required)
      .min(2, fmt(validation.string.minLength, { min: 2 }))
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
    order: z.number().int().min(0).default(0),
    subServices: z.array(subServiceSchema()).optional(),
    solutionIds: z.array(z.number().int().positive()).optional(),
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
        .min(2, fmt(validation.string.minLength, { min: 2 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 })),
      description: z
        .string(validation.required)
        .trim()
        .min(5, fmt(validation.string.minLength, { min: 5 }))
        .max(300, fmt(validation.string.maxLength, { max: 300 })),
      keywords: z
        .array(
          z
            .string()
            .trim()
            .max(50, fmt(validation.string.maxLength, { max: 50 })),
        )
        .optional(),
    }),
  });
}

type TSubServiceForm = z.infer<ReturnType<typeof subServiceSchema>>;
type TCreateServiceForm = z.infer<ReturnType<typeof createServiceSchema>>;

export { subServiceSchema, createServiceSchema, type TSubServiceForm, type TCreateServiceForm };
