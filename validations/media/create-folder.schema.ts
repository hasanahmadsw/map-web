import { fmt, validation } from '@/constants/validation-msg';
import { z } from 'zod';

export const createFolderSchema = () =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, validation.required)
      .max(255, fmt(validation.string.maxLength, { max: 255 }))
      .refine(
        name => {
          // Remove leading/trailing slashes and check if it's not empty
          const trimmed = name.replace(/^\/+|\/+$/g, '');
          return trimmed.length > 0;
        },
        {
          message: validation.required,
        },
      )
      .refine(
        name => {
          // Check for invalid characters in folder names
          const trimmed = name.replace(/^\/+|\/+$/g, '');
          return !/[<>:"|?*]/.test(trimmed);
        },
        {
          message: validation.invalid || 'Folder name contains invalid characters',
        },
      ),
  });

export type TCreateFolderSchema = z.infer<ReturnType<typeof createFolderSchema>>;
