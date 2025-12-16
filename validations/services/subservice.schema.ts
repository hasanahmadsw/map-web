import { fmt, validation } from '@/constants/validation-msg';
import z from 'zod';

function subServiceSchema() {
  return z.object({
    icon: z
      .string(validation.required)
      .trim()
      .min(1, validation.required)
      .max(100, fmt(validation.string.maxLength, { max: 100 })),
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
    features: z
      .array(
        z
          .string()
          .trim()
          .max(200, fmt(validation.string.maxLength, { max: 200 })),
      )
      .min(1, fmt(validation.custom.addAtLeastOne, { count: 'one' })),
  });
}

export { subServiceSchema };
