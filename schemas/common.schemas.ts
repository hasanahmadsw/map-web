import { z } from "zod";

export const trimmed = (maxLength = 1000, dict: Record<string, string>) =>
  z.string().trim().min(1, dict?.fieldCannotBeEmpty || "Field cannot be empty").max(maxLength, dict?.maxLength || `Maximum ${maxLength} characters allowed`);

// Helper function to format validation messages with placeholders
export const formatValidationMessage = (message: string, placeholders: Record<string, string | number>): string => {
  if (!message) return "";
  let result = message;
  Object.entries(placeholders).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  });
  return result;
};

// Helper function for min length validation with dynamic message
export const minLengthValidation = (minLength: number, validationDict: Record<string, string>) => {
  return formatValidationMessage(validationDict.minLength, { min: minLength });
};

export const atLeastOne = <T extends z.ZodRawShape>(shape: T, msg: string) =>
  z
    .object(shape)
    .partial()
    .refine((data) => Object.values(data).some((val) => val !== undefined && val !== ""), {
      message: msg,
    });

export const languageCodeSchema = (dict: any) => trimmed(10, dict).regex(
  /^[a-z]{2,3}(-[A-Z]{2,3})?(-[A-Z]{4})?(-[A-Z]{2}|\d{3})?$/,
  "Invalid language code",
);

export const slugSchema = (dict: any) => trimmed(100, dict)
  .min(2, dict.required)
  .transform((s) => s.toLowerCase())
  .refine((s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), { message: formatValidationMessage(dict.invalid, { entity: "slug" }) });

export const createBaseEntitySchema = (dict: any) => ({
  slug: slugSchema(dict),
  name: trimmed(200, dict).min(2, minLengthValidation(2, dict)),
  description: trimmed(500, dict).min(5, minLengthValidation(5, dict)),
  languageCode: languageCodeSchema(dict),
  translateTo: z
    .array(languageCodeSchema(dict))
    .min(1, dict.selectAtLeastOneLanguage || "Please select at least one language for translation"),
});

// Email schema with normalization
export const emailSchema = (dict: any) =>
{

  return trimmed(254, dict)
    .min(1, dict.fieldCannotBeEmpty )
    .email(dict.invalidEmail)
    .transform((email) => email.toLowerCase());
};

// Password schema
export const passwordSchema = (dict: Record<string, string>, minLength = 8) =>
  trimmed(128, dict)
    .min(1, dict.fieldCannotBeEmpty)
    .min(minLength, dict.passwordTooShort )
    .refine(
      (password) => /[A-Z]/.test(password),
      {
        message: dict.passwordMustHaveUppercase ,
      }
    )
    .refine(
      (password) => /[a-z]/.test(password),
      {
        message: dict.passwordMustHaveLowercase ,
      }
    )
    .refine(
      (password) => /\d/.test(password),
      {
        message: dict.passwordMustHaveNumber ,
      }
    )
    .refine(
      (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      {
        message: dict.passwordMustHaveSpecialChar ,
      }
    );

// URL schema
export const urlSchema = (dict: Record<string, string>) => trimmed(2048, dict).url(dict.invalidUrl || "Invalid URL");

