"use client";

import { useParams } from "next/navigation";
import { i18n, sanitizeLang, type Lang } from "@/utils/dictionary-utils";

export function useLang(): Lang {
  const params = useParams();
  const lang = params?.lang as string;

  return sanitizeLang(lang);
}
