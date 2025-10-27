import { z } from "zod";
import { Role, ROLES } from "../enums/roles.enum";
import { atLeastOne, emailSchema, languageCodeSchema, passwordSchema, formatValidationMessage } from "./common.schemas";
import { autoTranslateSchema } from "./translations.schemas";

const baseStaffShape = (t: any) => {
  const minLengthMessage = (min: number) => formatValidationMessage(t.minLength, { min });
  const selectAtLeastOneLanguage = t.selectAtLeastOneLanguage ; 
  
  return {
    name: z.string()
      .trim()
      .min(1, t.required)
      .max(200, formatValidationMessage(t.maxLength, { entity: "staff", max: 200 }))
      .min(2, minLengthMessage(2)),
    email: z.email(t.invalidEmail).min(1, t.required),
    password: z.string().min(1, t.required).min(8, t.passwordTooShort),
    role: z.nativeEnum(Role),
    bio: z.string().optional(),
    image: z.string().optional(),
    languageCode: languageCodeSchema(t),
    translateTo: z.array(languageCodeSchema(t)).min(1, selectAtLeastOneLanguage),
  };
};

export const createStaffSchema = (t: any) => z.object(baseStaffShape(t)).strict();

export const editStaffSchema = (t: any) => {
  const atLeastOneMessage = formatValidationMessage(t.atLeastOne, { entity: "staff" });
  
  return atLeastOne(
    {
      password: z.union([z.literal(""), z.string().min(8, t.passwordTooShort || "Password must be at least 8 characters")]).optional(),
      role: z.nativeEnum(Role).optional(),
      image: z.string().optional(),
    },
    atLeastOneMessage,
  ).strict();
};

// Update current user (me) schema: all fields optional; server will update only provided ones
export const updateMeSchema = (t: any) => {
  const passwordTooShortMessage = formatValidationMessage(t.passwordTooShort, { entity: "staff", min: 8 });
  return z
    .object({
      image: z.string().optional(),
      // Allow empty string or a valid password (so blank is treated as not provided)
      password: z.union([z.literal(""), z.string().min(8, passwordTooShortMessage)]).optional(),
  
    })
    .strict();
};

export const createStaffTranslationSchema = (validationDict: any) => {
  const minLengthMessage = (min: number) => formatValidationMessage(validationDict.minLength, { min });
  const requiredMessage = formatValidationMessage(validationDict.required, { entity: "staff" });
  
  return z
    .object({
      languageCode: languageCodeSchema(validationDict),
      name: z.string()
        .trim()
        .min(1, requiredMessage)
        .max(200, formatValidationMessage(validationDict.maxLength, { entity: "staff", max: 200 }))
        .min(2, minLengthMessage(2)),
      bio: z.string().optional(),
    })
    .strict();
};

export const updateStaffTranslationSchema = (t: any) => {
  const minLengthMessage = (min: number) => formatValidationMessage(t.minLength, { min });
  const requiredMessage = formatValidationMessage(t.required, { entity: "staff" });
  const atLeastOneMessage = formatValidationMessage(t.atLeastOne, { entity: "staff" });
  
  return atLeastOne(
    {
      name: z.string()
        .trim()
        .min(1, requiredMessage)
        .max(200, formatValidationMessage(t.maxLength, { entity: "staff", max: 200 }))
        .min(2, minLengthMessage(2))
        .optional(),
      bio: z.string().optional(),
    },
    atLeastOneMessage,
  );
};

export const autoTranslateStaffSchema = (t: any) => autoTranslateSchema(t);

// Types
export type TCreateStaffDTO = z.infer<ReturnType<typeof createStaffSchema>>;
export type TEditStaffDTO = z.infer<ReturnType<typeof editStaffSchema>>;
export type TUpdateMeDTO = z.infer<ReturnType<typeof updateMeSchema>>;
export type TCreateStaffTranslationDTO = z.infer<ReturnType<typeof createStaffTranslationSchema>>;
export type TUpdateStaffTranslationDTO = z.infer<ReturnType<typeof updateStaffTranslationSchema>>;
export type TAutoTranslateStaffDTO = z.infer<ReturnType<typeof autoTranslateStaffSchema>>;
