import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import {
  AudioCategory,
  EquipmentType,
  LightMountType,
  MediaFormat,
  MicrophonePattern,
  MountType,
  ResolutionType,
  SensorType,
} from '@/types/equipments/equipment.enum';
import { equipmentSpecsSchema } from './equipment-specs.schema';
import { gallerySchema, numberValidation } from '../common';

function updateEquipmentSchema() {
  return z.object({
    slug: z
      .string(validation.required)
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .regex(/^[a-z0-9-]+$/, validation.string.slugRegex),
    name: z
      .string(validation.required)
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 })),
    summary: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(500, fmt(validation.string.maxLength, { max: 500 })),
    description: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(5000, fmt(validation.string.maxLength, { max: 5000 })),
    categoryId: z.number().int().positive(validation.required),
    categoryLabel: z.string().optional(), // Just for display purposes
    brandId: z.number().int().positive(validation.required),
    brandLabel: z.string().optional(), // Just for display purposes
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    coverPath: z.string(validation.required).min(1, validation.required),
    gallery: gallerySchema,
    specs: equipmentSpecsSchema,
    status: z
      .string()
      .max(100, fmt(validation.string.maxLength, { max: 100 }))
      .optional(),
  });
}

type TUpdateEquipmentForm = z.infer<ReturnType<typeof updateEquipmentSchema>>;

export { updateEquipmentSchema, type TUpdateEquipmentForm };
