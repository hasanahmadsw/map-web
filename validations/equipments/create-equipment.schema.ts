import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import { numberValidation } from '../common';
import { equipmentSpecsSchema } from './equipment-specs.schema';

function createEquipmentSchema() {
  return z
    .object({
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
      categoryId: z.number(validation.required).int().positive(validation.required),
      categoryLabel: z.string().optional(), // Just for display purposes
      brandId: z.number(validation.required).int().positive(validation.required),
      brandLabel: z.string().optional(), // Just for display purposes
      equipmentType: z.enum(EquipmentType, { message: validation.required }),
      isPublished: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
      coverPath: z.string(validation.required).min(1, validation.required),
      galleryPaths: z.array(z.string().min(1, validation.required)).optional().default([]),
      specs: equipmentSpecsSchema,
    })
    .refine(
      data => {
        // Ensure equipmentType matches specs.type
        return data.equipmentType === data.specs.type;
      },
      {
        message: 'Equipment type must match specs type',
        path: ['specs'],
      },
    );
}

type TCreateEquipmentForm = z.infer<ReturnType<typeof createEquipmentSchema>>;

export { createEquipmentSchema, type TCreateEquipmentForm };
