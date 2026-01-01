import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { numberValidation } from '../common';

function createBroadcastSchema() {
  return z.object({
    type: z.nativeEnum(BroadcastType, { message: validation.required }),
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

type TCreateBroadcastForm = z.infer<ReturnType<typeof createBroadcastSchema>>;

export { createBroadcastSchema, type TCreateBroadcastForm };
