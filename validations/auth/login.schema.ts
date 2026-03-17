import { z } from 'zod';

import { fmt, validation } from '@/constants/validation-msg';

function loginSchema() {
  return z.object({
    email: z
      .email(validation.email.invalid)
      .trim()
      .min(1, validation.required)
      .max(128, fmt(validation.string.maxLength, { max: 128 })),
    password: z
      .string(validation.required)
      .trim()
      .min(1, validation.required)
      .min(6, fmt(validation.password.minLength, { min: 6 })),
  });
}

type TLoginForm = z.infer<ReturnType<typeof loginSchema>>;

export { loginSchema, type TLoginForm };
