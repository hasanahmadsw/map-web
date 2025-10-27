export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
] as const;

export const LANGUAGE_CODES = LANGUAGES.map((lang) => lang.code);
export const LANGUAGE_NAMES = LANGUAGES.map((lang) => lang.name);
