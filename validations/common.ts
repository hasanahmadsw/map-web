import { fmt, validation } from '@/constants/validation-msg';

import { z } from 'zod';

export function numberValidation(min: number, max: number) {
  return z
    .union([z.string(validation.invalid), z.number()])
    .transform(val => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    })
    .refine(val => val >= min && val <= max, {
      message: fmt(validation.number.range, { min, max }),
    });
}
