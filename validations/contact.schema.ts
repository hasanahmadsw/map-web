import { fmt, validation } from '@/constants/validation-msg';
import { z } from 'zod';

function contactSchema() {
  return z.object({
    name: z
      .string(validation.required)
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(128, fmt(validation.string.maxLength, { max: 128 })),
    subject: z
      .string(validation.required)
      .trim()
      .min(8, fmt(validation.string.minLength, { min: 8 }))
      .max(256, fmt(validation.string.maxLength, { max: 256 })),

    email: z.email(validation.invalid).max(128, fmt(validation.string.maxLength, { max: 128 })),
    phone: z
      .string(validation.required)
      .trim()
      .min(8, fmt(validation.string.minLength, { min: 8 }))
      .max(16, fmt(validation.string.maxLength, { max: 16 })),
    msg: z
      .string(validation.required)
      .trim()
      .min(16, fmt(validation.string.minLength, { min: 16 }))
      .max(2048, fmt(validation.string.maxLength, { max: 2048 })),
  });
}

type TContactSchemaForm = z.infer<ReturnType<typeof contactSchema>>;

export { contactSchema, type TContactSchemaForm };
