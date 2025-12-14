import { z } from "zod";
import { formatValidationMessage, trimmed } from "./common.schemas";

export const updateSettingsSchema = (dict: any) => z.object({
  siteName: trimmed(200, dict).optional(),
  siteDescription: trimmed(500, dict).optional(),
  siteLogo: z.string().optional(),
  siteDarkLogo: z.string().optional(),
  siteFavicon: z.string().optional(),
  defaultLanguage: trimmed(10, dict).optional(),
  meta: z.object({
    title: trimmed(200, dict).optional(),
    description: trimmed(300, dict).optional(),
    keywords: z.array(trimmed(50, dict)).optional(),
  }).optional(),
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
  }).optional(),
  customScripts: z.object({
    header: z.array(z.string()).optional(),
    footer: z.array(z.string()).optional(),
  }).optional(),
});

export type TUpdateSettingsDTO = z.infer<ReturnType<typeof updateSettingsSchema>>;
