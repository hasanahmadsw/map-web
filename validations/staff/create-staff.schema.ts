import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';
import { Role } from '@/types/roles.enum';

function createStaffSchema() {
  return z
    .object({
      name: z
        .string(validation.required)
        .trim()
        .min(2, fmt(validation.string.minLength, { min: 2 }))
        .max(200, fmt(validation.string.maxLength, { max: 200 })),
      email: z.email(validation.email.invalid).max(128, fmt(validation.string.maxLength, { max: 128 })),
      password: z
        .string(validation.required)
        .trim()
        .min(1, validation.required)
        .min(8, fmt(validation.password.minLength, { min: 8 }))
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, validation.password.regex),
      confirmPassword: z.string(validation.required).min(1, validation.required),
      role: z.enum(Role, { message: validation.required }),
      bio: z
        .string(validation.required)
        .trim()
        .max(1024, fmt(validation.string.maxLength, { max: 1024 }))
        .optional(),
      image: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: validation.password.mismatch,
      path: ['confirmPassword'],
    });
}

type TCreateStaffForm = z.infer<ReturnType<typeof createStaffSchema>>;

export { createStaffSchema, type TCreateStaffForm };
