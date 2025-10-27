"use client";

import { useParams } from "next/navigation";
import { i18n, type Lang } from "@/utils/dictionary-utils";

export function useLang(): Lang {
  const params = useParams();
  const lang = params?.lang as string;

  if (lang && i18n.langs.includes(lang as Lang)) {
    return lang as Lang;
  }

  return i18n.defaultLang as Lang;
}
