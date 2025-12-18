import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

function updateEquipmentBrandSchema() {
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
    order: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  });
}

type TUpdateEquipmentBrandForm = z.infer<ReturnType<typeof updateEquipmentBrandSchema>>;

export { updateEquipmentBrandSchema, type TUpdateEquipmentBrandForm };
