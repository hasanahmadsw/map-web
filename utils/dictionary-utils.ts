export const i18n = {
  defaultLang: "en",
  langs: ["en", "ar"] as const,
} as const;

export type Lang = (typeof i18n.langs)[number];

const translationCache = new Map<string, Promise<any>>();

const translationLoaders = {
  en: () => import(`@/translations/en/translations.json`).then((m) => m.default),
  ar: () => import(`@/translations/ar/translations.json`).then((m) => m.default),
} as const;

export type Translations = Awaited<ReturnType<typeof translationLoaders.en>>;

export async function getTranslations(lang: Lang): Promise<Translations> {
  const normalizedLang = i18n.langs.includes(lang) ? lang : i18n.defaultLang;
  const cacheKey = normalizedLang;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)! as Promise<Translations>;
  }

  const loadPromise = translationLoaders[normalizedLang]().catch((error) => {
    console.error(`Failed to load translations for ${normalizedLang}:`, error);
    if (normalizedLang !== i18n.defaultLang) {
      return translationLoaders[i18n.defaultLang]();
    }
    return {};
  });

  translationCache.set(cacheKey, loadPromise);
  return loadPromise as Promise<Translations>;
}

// Function to preload all translations for all languages
export async function preloadAllTranslations(): Promise<{
  [lang in Lang]: Translations;
}> {
  const loadPromises = i18n.langs.map(async (lang) => {
    return { lang, data: await getTranslations(lang) };
  });

  const results = await Promise.all(loadPromises);

  const allLanguages = {} as { [lang in Lang]: Translations };
  results.forEach(({ lang, data }) => {
    allLanguages[lang] = data;
  });

  return allLanguages;
}

// Helper function to get nested translation values using dot notation
export function getTranslationValue(translations: Translations, key: string): string {
  const keys = key.split(".");
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

interface Options {
  [key: string]: string | number | boolean | undefined;
  femaleArabicField?: boolean;
}

export function fmt(message: string, options: Options = {}): string {
  let result = message;
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
    }
  });
  return result;
}

export function getDirection(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function isRTL(lang: Lang): boolean {
  return getDirection(lang) === "rtl";
}
export function getLocalizedRoute(lang: Lang, path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}
