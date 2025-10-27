import { z } from "zod";
import { languageCodeSchema, trimmed } from "./common.schemas";

export const createLanguageSchema = (dict: Record<string, string>) =>
  z.object({
    code: languageCodeSchema(dict),
    name: trimmed(100, dict).min(2, dict.required || "This field is required"),
    nativeName: trimmed(100, dict).min(2, dict.required || "This field is required"),
    isDefault: z.boolean().default(false),
  });

export const updateLanguageSchema = (dict: Record<string, string>) =>
  z.object({
    code: languageCodeSchema(dict).optional(),
    name: trimmed(100, dict).min(2, dict.required || "This field is required").optional(),
    nativeName: trimmed(100, dict).min(2, dict.required || "This field is required").optional(),
    isDefault: z.boolean().optional(),
  });

export type TCreateLanguageDTO = z.infer<ReturnType<typeof createLanguageSchema>>;
export type TUpdateLanguageDTO = z.infer<ReturnType<typeof updateLanguageSchema>>;
