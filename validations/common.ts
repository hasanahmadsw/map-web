import { fmt, validation } from '@/constants/validation-msg';

import { z } from 'zod';

export function numberValidation(min: number, max: number) {
  return z
    .union([z.string(validation.invalid), z.number()])
    .transform(val => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    })
    .refine(val => val >= min && val <= max, {
      message: fmt(validation.number.range, { min, max }),
    });
}

export const galleryItemSchema = z.object({
  path: z.string().min(1, validation.required),
  order: z.number().int().min(1),
});

export const gallerySchema = z.array(galleryItemSchema).optional().default([]);