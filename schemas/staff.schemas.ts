import { z } from 'zod';
import { Role, ROLES } from '../enums/roles.enum';
import {
  atLeastOne,
  emailSchema,
  languageCodeSchema,
  passwordSchema,
  formatValidationMessage,
} from './common.schemas';

// Update current user (me) schema: all fields optional; server will update only provided ones
export const updateMeSchema = (t: any) => {
  const passwordTooShortMessage = formatValidationMessage(t.passwordTooShort, { entity: 'staff', min: 8 });
  return z
    .object({
      image: z.string().optional(),
      // Allow empty string or a valid password (so blank is treated as not provided)
      password: z.union([z.literal(''), z.string().min(8, passwordTooShortMessage)]).optional(),
    })
    .strict();
};

// Types
export type TUpdateMeDTO = z.infer<ReturnType<typeof updateMeSchema>>;
