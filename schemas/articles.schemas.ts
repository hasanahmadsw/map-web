import { z } from "zod";
import { atLeastOne, languageCodeSchema, minLengthValidation, slugSchema, trimmed } from "./common.schemas";

export const createArticleSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      slug: slugSchema(validationDict),
      name: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)),
      content: trimmed(50000, validationDict).min(10, minLengthValidation(10, validationDict)),
      excerpt: trimmed(500, validationDict).min(5, minLengthValidation(5, validationDict)),
      meta: z.object({
        title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)),
        description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)),
        keywords: z.array(trimmed(50, validationDict)).optional(),
      }),
      languageCode: languageCodeSchema(validationDict),
      isPublished: z.boolean().default(false),
      isFeatured: z.boolean().default(false),
      tags: z.string().optional(),
      topics: z.string().optional(),
      translateTo: z.array(languageCodeSchema(validationDict)).optional(),
      image: z.string().optional(),
      imageFile: z.instanceof(File).optional(),
    })
    .strict();

// Creates a Zod schema for article editing form validation
export const editArticleSchema = (validationDict: Record<string, string>) =>
  atLeastOne(
    {
      slug: slugSchema(validationDict).optional(),
      name: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
      content: trimmed(50000, validationDict).min(10, minLengthValidation(10, validationDict)).optional(),
      excerpt: trimmed(500, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
      meta: z.object({
        title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
        description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
        keywords: z.array(trimmed(50, validationDict)).optional(),
      }).optional(),
      languageCode: languageCodeSchema(validationDict).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      tags: z.string().optional(),
      topics: z.string().optional(),
      image: z.string().optional(),
      imageFile: z.instanceof(File).optional(),
    },
    validationDict.atLeastOne,
  ).strict();


// Schema for bulk operations on articles
export const bulkArticleOperationSchema = (validationDict: any) =>
  z
    .object({
      articleIds: z.array(z.number().int().positive()).min(1, validationDict.selectAtLeastOne),
      operation: z.enum(["publish", "unpublish", "feature", "unfeature", "delete"], {
        message: validationDict.invalidOperation,
      }),
    })
    .strict();

// Schema for article search/filtering
export const articleSearchSchema = (validationDict: Record<string, string> = {}) =>
  z
    .object({
      query: trimmed(100, validationDict).optional(),
      languageCode: languageCodeSchema(validationDict).optional(),
      tags: z.array(z.string().min(1)).optional(),
      topics: z.array(z.string().min(1)).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
      sortBy: z.enum(["createdAt", "updatedAt", "name", "publishedAt"]).default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(100).default(10),
    })
    .strict();

// Schema for article status update
export const updateArticleStatusSchema = (validationDict: Record<string, string>) =>
  z
    .object({
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      publishedAt: z.string().datetime().optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
      message: validationDict.atLeastOneStatusFieldRequired,
    })
    .strict();

// Types
export type TCreateArticleForm = z.infer<ReturnType<typeof createArticleSchema>>;
export type TEditArticleForm = z.infer<ReturnType<typeof editArticleSchema>>;
export type TBulkArticleOperationForm = z.infer<ReturnType<typeof bulkArticleOperationSchema>>;
export type TArticleSearchForm = z.infer<typeof articleSearchSchema>;
export type TUpdateArticleStatusForm = z.infer<typeof updateArticleStatusSchema>;
