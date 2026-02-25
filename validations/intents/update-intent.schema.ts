import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

const equipmentFiltersObjectSchema = z.object({
  filterCategoryId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === '__none__' || v === undefined ? undefined : Number(v))),
  filterBrandId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === '__none__' || v === undefined ? undefined : Number(v))),
  filterEquipmentType: z.string().optional().transform((v) => (v === '' || v === '__none__' ? undefined : v)),
  filterIsFeatured: z.boolean().optional(),
  filterCategoryLabel: z.string().optional(),
  filterBrandLabel: z.string().optional(),
});

export function updateIntentSchema() {
  return z
    .object({
      slug: z
        .string()
        .min(1, fmt(validation.string.minLength, { min: 1 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 }))
        .regex(/^[a-z0-9-]+$/, validation.string.slugRegex)
        .optional(),
      type: z
        .enum(['HUB', 'CLUSTER', 'CATEGORY', 'BRAND', 'MODEL', 'OFFER', 'LOCATION'])
        .optional(),
      parentId: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => (v === '' || v === '__none__' || v === undefined ? null : Number(v))),
      h1: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
      subHeading: z.string().optional(),
      content: z.string().optional(),
      linkLabel: z.string().optional(),
      ...equipmentFiltersObjectSchema.shape,
    })
    .transform((data) => {
      const {
        filterCategoryId,
        filterBrandId,
        filterEquipmentType,
        filterIsFeatured,
        filterCategoryLabel: _fcLabel,
        filterBrandLabel: _fbLabel,
        ...rest
      } = data;
      const equipmentFilters: Record<string, unknown> = {};
      if (filterCategoryId != null) equipmentFilters.categoryId = filterCategoryId;
      if (filterBrandId != null) equipmentFilters.brandId = filterBrandId;
      if (filterEquipmentType != null) equipmentFilters.equipmentType = filterEquipmentType;
      if (filterIsFeatured === true) equipmentFilters.isFeatured = true;
      return {
        ...rest,
        equipmentFilters: Object.keys(equipmentFilters).length > 0 ? equipmentFilters : undefined,
      };
    });
}

export type TUpdateIntentForm = z.input<ReturnType<typeof updateIntentSchema>>;
