import { z } from "zod";
import { formatValidationMessage, trimmed } from "./common.schemas";

export const updateSettingsSchema = (dict: any) => z.object({
  social: z.array(z.object({
    platform: trimmed(50, dict).min(1, dict.required),
    url: trimmed(2048, dict).min(1, dict.required).url(formatValidationMessage(dict.invalid, { entity: "url" })),
    label: trimmed(100, dict).min(1, dict.required),
  })).optional(),
  analytics: z.object({
    googleAnalytics: z.string().optional(),
    facebookPixel: z.string().optional(),
    customScripts: z.array(z.string()).optional(),
  }).optional(),
  contact: z.object({
    email: trimmed(254, dict).min(1, dict.required).email(formatValidationMessage(dict.invalid, { entity: "email" })),
    phone: trimmed(20, dict).min(1, dict.required),
  }),
  customScripts: z.object({
    header: z.array(z.string()).optional(),
    footer: z.array(z.string()).optional(),
  }).optional(),
});

export const updateSettingsTranslationSchema = (dict: any) => z.object({
  siteName: trimmed(200, dict).min(1, dict.required),
  siteDescription: trimmed(500, dict).min(1, dict.required),
  meta: z.object({
    title: trimmed(200, dict).min(1, dict.required),
    description: trimmed(500, dict).min(1, dict.required),
    keywords: z.array(z.string()).optional(),
  }),
});

export const editTranslationFormSchema = (dict: any) => z.object({
  siteName: trimmed(200, dict).min(1, dict.required),
  siteDescription: trimmed(500, dict).min(1, dict.required),
  metaTitle: trimmed(200, dict).min(1, dict.required),
  metaDescription: trimmed(500, dict).min(1, dict.required),
  keywords: z.array(z.string()).optional(),
});

export type TUpdateSettingsDTO = z.infer<ReturnType<typeof updateSettingsSchema>>;
export type TUpdateSettingsTranslationDTO = z.infer<ReturnType<typeof updateSettingsTranslationSchema>>;
export type TEditTranslationFormDTO = z.infer<ReturnType<typeof editTranslationFormSchema>>;
