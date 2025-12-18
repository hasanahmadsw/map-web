import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { EquipmentType } from '@/types/equipments/equipment.enum';

function updateEquipmentCategorySchema() {
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
    description: z
      .string(validation.required)
      .trim()
      .min(3, fmt(validation.string.minLength, { min: 3 }))
      .max(2048, fmt(validation.string.maxLength, { max: 2048 })),
    type: z.enum(EquipmentType, { message: validation.required }),
    order: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  });
}

type TUpdateEquipmentCategoryForm = z.infer<ReturnType<typeof updateEquipmentCategorySchema>>;

export { updateEquipmentCategorySchema, type TUpdateEquipmentCategoryForm };
