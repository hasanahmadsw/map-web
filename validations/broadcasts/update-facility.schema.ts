import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { numberValidation } from '../common';

function updateBroadcastSchema() {
  return z.object({
    type: z.nativeEnum(BroadcastType, { message: validation.required }).optional(),
    slug: z
      .string()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9-]+$/, validation.string.slugRegex)
      .optional(),
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
    gallery: z.array(z.string().min(1, validation.required)).optional(),
    isPublished: z.boolean().optional(),
    order: numberValidation(1, 100).optional().or(z.literal('')),
  });
}

type TUpdateBroadcastForm = z.infer<ReturnType<typeof updateBroadcastSchema>>;

export { updateBroadcastSchema, type TUpdateBroadcastForm };

