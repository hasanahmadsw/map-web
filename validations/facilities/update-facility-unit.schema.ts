import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { FacilityUnitItemGroup } from '@/types/facilities/facility.enums';
import { numberValidation } from '../common';

const facilityUnitItemSchema = z.object({
  group: z.nativeEnum(FacilityUnitItemGroup).optional(),
  title: z
    .string()
    .trim()
    .min(1, fmt(validation.string.minLength, { min: 1 }))
    .max(200, fmt(validation.string.maxLength, { max: 200 }))
    .optional(),
  qty: numberValidation(1, 10000).optional().or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(500, fmt(validation.string.maxLength, { max: 500 }))
    .optional(),
  order: numberValidation(1, 1000).optional().or(z.literal('')),
});

function updateFacilityUnitSchema() {
  return z.object({
    facilityId: z.number().int().positive(validation.required).optional(),
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
    specs: z.record(z.string(), z.any()).optional(),
    coverImage: z.string().min(1, validation.required).optional(),
    gallery: z.array(z.string().min(1, validation.required)).optional(),
    isPublished: z.boolean().optional(),
    order: numberValidation(1, 100).optional().or(z.literal('')),
    items: z.array(facilityUnitItemSchema).optional(),
  });
}

type TUpdateFacilityUnitForm = z.infer<ReturnType<typeof updateFacilityUnitSchema>>;

export { updateFacilityUnitSchema, type TUpdateFacilityUnitForm };

