import { fmt, validation } from '@/constants/validation-msg';
import z from 'zod';

function subServiceSchema() {
  return z.object({
    title: z
      .string(validation.required)
      .trim()
      .min(2, fmt(validation.string.minLength, { min: 2 }))
      .max(200, fmt(validation.string.maxLength, { max: 200 })),
    description: z
      .string(validation.required)
      .trim()
      .min(5, fmt(validation.string.minLength, { min: 5 }))
      .max(500, fmt(validation.string.maxLength, { max: 500 })),
  });
}

export { subServiceSchema };
