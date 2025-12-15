import { z } from "zod";
import { atLeastOne, languageCodeSchema, minLengthValidation, slugSchema, trimmed } from "./common.schemas";




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

export type TBulkArticleOperationForm = z.infer<ReturnType<typeof bulkArticleOperationSchema>>;
export type TArticleSearchForm = z.infer<typeof articleSearchSchema>;
export type TUpdateArticleStatusForm = z.infer<typeof updateArticleStatusSchema>;
