import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { FacilityType } from '@/types/facilities/facility.enums';
import { numberValidation } from '../common';

function createFacilitySchema() {
  return z.object({
    solutionId: z.number(validation.required).int().positive(validation.required),
    type: z.nativeEnum(FacilityType, { message: validation.required }),
    slug: z
      .string(validation.required)
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9-]+$/, validation.string.slugRegex),
    title: z
      .string()
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .optional(),
    summary: z
      .string()
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(500, fmt(validation.string.maxLength, { max: 500 }))
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(5000, fmt(validation.string.maxLength, { max: 5000 }))
      .optional(),
    coverImage: z.string().min(1, validation.required).optional(),
    gallery: z.array(z.string().min(1, validation.required)).optional().default([]),
    isPublished: z.boolean().default(false),
    order: numberValidation(1, 100).optional().or(z.literal('')),
  });
}

type TCreateFacilityForm = z.infer<ReturnType<typeof createFacilitySchema>>;

export { createFacilitySchema, type TCreateFacilityForm };
