"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { Lang, Translations } from "@/utils/dictionary-utils";

interface TranslationsContextType {
  translations: Translations;
  currentLang: Lang;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const TranslationsProvider = ({
  translations,
  currentLang,
  children,
}: {
  translations: Translations;
  currentLang: Lang;
  children: ReactNode;
}) => {
  return <TranslationsContext.Provider value={{ translations, currentLang }}>{children}</TranslationsContext.Provider>;
};

export function useTranslation() {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationsProvider");
  }

  // Helper function to get nested translation values using dot notation
  const getTranslationValue = (key: string): string => {
    const keys = key.split(".");
    let value: any = context.translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return {
    t: context.translations,
    lang: context.currentLang,
    getTranslationValue,
  };
}
