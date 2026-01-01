import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { subServiceSchema } from './create-service.schema';
import { gallerySchema, numberValidation } from '../common';
import { SolutionKey } from '@/types/solution-key.enum';

function editServiceSchema() {
  return z.object({
    slug: z
      .string()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, validation.string.slugRegex),
    icon: z
      .string()
      .trim()
      .max(100, fmt(validation.string.maxLength, { max: 100 })),
    featuredImage: z.string(validation.required).min(1, validation.required),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    order: numberValidation(1, 100).optional(),
    subServices: z.array(subServiceSchema()).optional(),
    solutionKey: z.nativeEnum(SolutionKey).optional(),
    name: z
      .string()
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 })),
    description: z
      .string()
      .trim()
      .min(10, fmt(validation.string.minLength, { min: 10 }))
      .max(1000, fmt(validation.string.maxLength, { max: 1000 })),
    shortDescription: z
      .string()
      .trim()
      .min(5, fmt(validation.string.minLength, { min: 5 }))
      .max(300, fmt(validation.string.maxLength, { max: 300 })),
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
    gallery: gallerySchema,
  });
}

type TEditServiceForm = z.infer<ReturnType<typeof editServiceSchema>>;

export { editServiceSchema, type TEditServiceForm };
