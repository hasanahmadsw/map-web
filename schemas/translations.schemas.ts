import { z } from "zod";
import { atLeastOne, languageCodeSchema, minLengthValidation, trimmed } from "./common.schemas";
import { subServiceSchema } from "./services.schemas";

export const createTranslationSchema = (
  t: any,
  hasContent = false,
  hasMeta = false,
  hasSubServices = false,
) => {
  const baseSchema = z.object({
    languageCode: languageCodeSchema(t),
    name: trimmed(200, t).min(2, minLengthValidation(2, t)),
    description: trimmed(500, t).min(5, minLengthValidation(5, t)),
  });

  if (hasContent) {
    const contentSchema = baseSchema.extend({
      content: trimmed(10000, t).min(10, minLengthValidation(10, t)),
      excerpt: trimmed(300, t).min(5, minLengthValidation(5, t)),
    });

    if (hasMeta) {
      const metaSchema = contentSchema.extend({
        meta: z
          .object({
            title: trimmed(200, t).min(2, minLengthValidation(2, t)),
            description: trimmed(300, t).min(5, minLengthValidation(5, t)),
            keywords: z.array(trimmed(50, t)).optional(),
          })
          .optional(),
      });

      if (hasSubServices) {
        return metaSchema.extend({
          shortDescription: trimmed(300, t).min(5, minLengthValidation(5, t)),
          subServices: z.array(subServiceSchema(t)).optional(),
        });
      }

      return metaSchema;
    }

    return contentSchema;
  }

  if (hasSubServices) {
    return baseSchema.extend({
      shortDescription: trimmed(300, t).min(5, minLengthValidation(5, t)),
      meta: z
        .object({
          title: trimmed(200, t).min(2, minLengthValidation(2, t)),
          description: trimmed(300, t).min(5, minLengthValidation(5, t)),
          keywords: z.array(trimmed(50, t)).optional(),
        })
        .optional(),
      subServices: z.array(subServiceSchema(t)).optional(),
    });
  }

  return baseSchema;
};

export const editTranslationSchema = (validationDict: Record<string, string>, hasContent = false, hasMeta = false, hasSubServices = false) => {
  const baseShape = {
    name: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
    description: trimmed(500, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
  };

  if (hasContent) {
    const contentShape = {
      ...baseShape,
      content: trimmed(10000, validationDict).min(10, minLengthValidation(10, validationDict)).optional(),
      excerpt: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
    };

    if (hasMeta) {
      const metaShape = {
        ...contentShape,
        meta: z
          .object({
            title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
            description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
            keywords: z.array(trimmed(50, validationDict)).optional(),
          })
          .optional(),
      };

      if (hasSubServices) {
        return atLeastOne(
          {
            ...metaShape,
            shortDescription: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
            subServices: z.array(subServiceSchema(validationDict)).optional(),
          },
          validationDict.atLeastOne,
        );
      }

      return atLeastOne(metaShape, validationDict.atLeastOne);
    }

    return atLeastOne(contentShape, validationDict.atLeastOne);
  }

  if (hasSubServices) {
    return atLeastOne(
      {
        ...baseShape,
        shortDescription: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
        meta: z
          .object({
            title: trimmed(200, validationDict).min(2, minLengthValidation(2, validationDict)).optional(),
            description: trimmed(300, validationDict).min(5, minLengthValidation(5, validationDict)).optional(),
            keywords: z.array(trimmed(50, validationDict)).optional(),
          })
          .optional(),
        subServices: z.array(subServiceSchema(validationDict)).optional(),
      },
      validationDict.atLeastOne,
    );
  }

  return atLeastOne(baseShape, validationDict.atLeastOne);
};

export const autoTranslateSchema = (validationDict: any) =>
  z
    .object({
      translateTo: z.array(languageCodeSchema(validationDict)).min(1, validationDict.selectAtLeastOneLanguage),
    })
    .strict();
// Types
export type TCreateTranslationForm = z.infer<ReturnType<typeof createTranslationSchema>>;
export type TEditTranslationForm = z.infer<ReturnType<typeof editTranslationSchema>>;
export type TAutoTranslateForm = z.infer<ReturnType<typeof autoTranslateSchema>>;
