import { z } from 'zod';
import { atLeastOne, languageCodeSchema, minLengthValidation, trimmed } from './common.schemas';

// Create solution schema
export const createSolutionSchema = (validationDict: Record<string, string>) =>
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

// Edit solution schema
export const editSolutionSchema = (validationDict: Record<string, string>) =>
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
      languageCode: languageCodeSchema(validationDict).optional(),
    },
    validationDict.atLeastOne || 'At least one field must be provided',
  ).strict();

// Bulk solution operation schema
export const bulkSolutionOperationSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      solutionIds: z
        .array(z.number().int().positive())
        .min(1, validationDict.selectAtLeastOne || 'Please select at least one solution'),
      operation: z.enum(['publish', 'unpublish', 'feature', 'unfeature', 'delete'], {
        message: validationDict.invalidOperation || 'Invalid operation',
      }),
    })
    .strict();

// Solution search/filtering schema
export const solutionSearchSchema = (validationDict: Record<string, string> = {}) =>
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

// Solution status update schema
export const updateSolutionStatusSchema = (validationDict: Record<string, string>) =>
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
export type TCreateSolutionForm = z.infer<ReturnType<typeof createSolutionSchema>>;
export type TEditSolutionForm = z.infer<ReturnType<typeof editSolutionSchema>>;
export type TBulkSolutionOperationForm = z.infer<ReturnType<typeof bulkSolutionOperationSchema>>;
export type TSolutionSearchForm = z.infer<typeof solutionSearchSchema>;
export type TUpdateSolutionStatusForm = z.infer<typeof updateSolutionStatusSchema>;
