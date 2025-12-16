import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

function updateSettingsSchema() {
  return z.object({
    siteName: z
      .string()
      .trim()
      .min(1, validation.required)
      .max(200, fmt(validation.string.maxLength, { max: 200 }))
      .optional(),
    siteDescription: z
      .string()
      .trim()
      .max(500, fmt(validation.string.maxLength, { max: 500 }))
      .optional(),
    siteLogo: z.string().optional(),
    siteDarkLogo: z.string().optional(),
    siteFavicon: z.string().optional(),
    defaultLanguage: z
      .string()
      .trim()
      .max(10, fmt(validation.string.maxLength, { max: 10 }))
      .optional(),
    meta: z
      .object({
        title: z
          .string()
          .trim()
          .max(200, fmt(validation.string.maxLength, { max: 200 }))
          .optional(),
        description: z
          .string()
          .trim()
          .max(300, fmt(validation.string.maxLength, { max: 300 }))
          .optional(),
        keywords: z
          .array(
            z
              .string()
              .trim()
              .max(50, fmt(validation.string.maxLength, { max: 50 })),
          )
          .optional(),
      })
      .optional(),
    social: z
      .array(
        z.object({
          platform: z
            .string(validation.required)
            .trim()
            .min(1, validation.required)
            .max(50, fmt(validation.string.maxLength, { max: 50 })),
          url: z
            .string(validation.required)
            .trim()
            .min(1, validation.required)
            .url(validation.invalid)
            .max(2048, fmt(validation.string.maxLength, { max: 2048 })),
          label: z
            .string(validation.required)
            .trim()
            .min(1, validation.required)
            .max(100, fmt(validation.string.maxLength, { max: 100 })),
        }),
      )
      .optional(),
    analytics: z
      .object({
        googleAnalytics: z.string().optional(),
        facebookPixel: z.string().optional(),
        customScripts: z.array(z.string()).optional(),
      })
      .optional(),
    contact: z
      .object({
        email: z

          .email(validation.email.invalid)

          .max(254, fmt(validation.string.maxLength, { max: 254 })),
        phone: z
          .string()
          .trim()
          .min(1, validation.required)
          .max(20, fmt(validation.string.maxLength, { max: 20 })),
      })
      .optional(),
    customScripts: z
      .object({
        header: z.array(z.string()).optional(),
        footer: z.array(z.string()).optional(),
      })
      .optional(),
  });
}

type TUpdateSettingsForm = z.infer<ReturnType<typeof updateSettingsSchema>>;

export { updateSettingsSchema, type TUpdateSettingsForm };
