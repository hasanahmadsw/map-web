import { z } from 'zod';
import { atLeastOne, languageCodeSchema, minLengthValidation, trimmed } from './common.schemas';

// SubService schema
export const subServiceSchema = (validationDict: Record<string, string>) =>
  z.object({
    icon: trimmed(100, validationDict).min(1, validationDict.required || 'Icon is required'),
    title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)),
    description: trimmed(500, validationDict).min(5, minLengthValidation(5, validationDict)),
    features: z
      .array(trimmed(200, validationDict))
      .min(1, validationDict.selectAtLeastOne || 'Please select at least one feature'),
  });

// Create service schema
export const createServiceSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      slug: trimmed(100, validationDict)
        .min(2, validationDict.required || 'Slug is required')
        .transform(s => s.toLowerCase())
        .refine(s => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), {
          message: validationDict.invalidSlug || 'Invalid slug format',
        }),
      icon: trimmed(100, validationDict).min(1, validationDict.required || 'Icon is required'),
      featuredImage: trimmed(500, validationDict).min(
        1,
        validationDict.required || 'Featured image is required',
      ),
      isPublished: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
      order: z.number().int().min(0).default(0),
      subServices: z.array(subServiceSchema(validationDict)).optional(),
      solutionIds: z.array(z.number().int().positive()).optional(),
      name: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)),
      description: trimmed(1000, validationDict).min(10, minLengthValidation(10, validationDict)),
      shortDescription: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)),
      meta: z.object({
        title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)),
        description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)),
        keywords: z.array(trimmed(50, validationDict)).optional(),
      }),
      languageCode: languageCodeSchema(validationDict),
      translateTo: z.array(languageCodeSchema(validationDict)).optional(),
    })
    .strict();

// Edit service schema
export const editServiceSchema = (validationDict: Record<string, string>) =>
  atLeastOne(
    {
      slug: trimmed(100, validationDict)
        .min(2, validationDict.required || 'Slug is required')
        .transform(s => s.toLowerCase())
        .refine(s => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), {
          message: validationDict.invalidSlug || 'Invalid slug format',
        })
        .optional(),
      icon: z.string().optional(),
      featuredImage: z.string().optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().int().min(0).optional(),
      solutionIds: z.array(z.number().int().positive()).optional(),
      name: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
      description: trimmed(1000, validationDict).min(10, minLengthValidation(10, validationDict)).optional(),
      shortDescription: trimmed(300, validationDict)
        .min(5, minLengthValidation(5, validationDict))
        .optional(),
      meta: z
        .object({
          title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
          description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
          keywords: z.array(trimmed(50, validationDict)).optional(),
        })
        .optional(),
      subServices: z.array(subServiceSchema(validationDict)).optional(),
    },
    validationDict.atLeastOne || 'At least one field must be provided',
  ).strict();

// Bulk service operation schema
export const bulkServiceOperationSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      serviceIds: z
        .array(z.number().int().positive())
        .min(1, validationDict.selectAtLeastOne || 'Please select at least one service'),
      operation: z.enum(['publish', 'unpublish', 'feature', 'unfeature', 'delete'], {
        message: validationDict.invalidOperation || 'Invalid operation',
      }),
    })
    .strict();

// Service search/filtering schema
export const serviceSearchSchema = (validationDict: Record<string, string> = {}) =>
  z
    .object({
      query: trimmed(100, validationDict).optional(),
      languageCode: languageCodeSchema(validationDict).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
      sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'order']).default('order'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(100).default(10),
    })
    .strict();

// Service status update schema
export const updateServiceStatusSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().int().min(0).optional(),
    })
    .refine(data => Object.values(data).some(val => val !== undefined), {
      message: validationDict.atLeastOneStatusFieldRequired || 'At least one status field must be provided',
    })
    .strict();

// Types
export type TCreateServiceForm = z.infer<ReturnType<typeof createServiceSchema>>;
export type TEditServiceForm = z.infer<ReturnType<typeof editServiceSchema>>;
export type TBulkServiceOperationForm = z.infer<ReturnType<typeof bulkServiceOperationSchema>>;
export type TServiceSearchForm = z.infer<typeof serviceSearchSchema>;
export type TUpdateServiceStatusForm = z.infer<typeof updateServiceStatusSchema>;
export type TSubServiceForm = z.infer<ReturnType<typeof subServiceSchema>>;
