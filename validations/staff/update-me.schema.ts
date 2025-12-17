import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { Role } from '@/enums/roles.enum';

function updateMeSchema() {
  return z
    .object({
      name: z
        .string(validation.required)
        .trim()
        .min(2, fmt(validation.string.minLength, { min: 2 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 })),
      password: z
        .string()
        .trim()
        .min(8, fmt(validation.password.minLength, { min: 8 }))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, validation.password.regex)
        .optional(),
      confirmPassword: z.string().optional(),

      bio: z
        .string(validation.required)
        .trim()
        .max(1024, fmt(validation.string.maxLength, { max: 1024 }))
        .optional(),
      image: z.string().optional(),
    })
    .refine(data => (data?.password ? data.password === data.confirmPassword : true), {
      message: validation.password.mismatch,
      path: ['confirmPassword'],
    });
}

type TUpdateMeForm = z.infer<ReturnType<typeof updateMeSchema>>;

export { updateMeSchema, type TUpdateMeForm };
