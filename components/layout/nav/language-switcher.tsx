"use client";

import { Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLang } from "@/hooks/useLang";
import { useLanguages } from "@/hooks/useLanguages";
import { getLocalizedRoute, i18n, type Lang } from "@/utils/dictionary-utils";

const languageNames: Record<Lang, string> = {
  en: "English",
  ar: "العربية",
};

const languageFlags: Record<Lang, string> = {
  en: "🇺🇸",
  ar: "🇸🇦",
};

// Helper function to get language display info
const getLanguageDisplayInfo = (code: string) => {
  const lang = code as Lang;
  return {
    name: languageNames[lang] || code,
    flag: languageFlags[lang] || "🌐",
    code: lang,
  };
};

interface LanguageSwitcherProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
}: LanguageSwitcherProps) {
  const currentLang = useLang();
  const pathname = usePathname();
  const { languages, isLoading: isLoadingLanguages } = useLanguages();

  // Extract the current path without the language prefix
  const getCurrentPath = () => {
    const pathSegments = pathname.split("/");
    // Remove the language segment (first segment after empty string)
    if (pathSegments.length > 1 && i18n.langs.includes(pathSegments[1] as Lang)) {
      return "/" + pathSegments.slice(2).join("/");
    }
    return pathname;
  };

  const currentPath = getCurrentPath();

  // Get available languages from API or fallback to hardcoded ones
  const availableLanguages = React.useMemo(() => {
    if (languages && languages.length > 0) {
      return languages.map((lang) => getLanguageDisplayInfo(lang.code));
    }
    // Fallback to hardcoded languages
    return i18n.langs.map((lang) => getLanguageDisplayInfo(lang));
  }, [languages]);

  const currentLanguageInfo = getLanguageDisplayInfo(currentLang);

  const handleLanguageChange = (newLang: string) => {
    if (newLang === currentLang) return;

    const newPath = getLocalizedRoute(newLang as Lang, currentPath);
    window.location.href = newPath;
  };

  if (showLabel) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className} disabled={isLoadingLanguages}>
            <Globe className="h-4 w-4 mr-2" />
            {currentLanguageInfo.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 ${lang.code === currentLang ? "bg-accent" : ""}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isLoadingLanguages}>
          <span className="sr-only">Change language</span>
          <span className="text-lg">{currentLanguageInfo.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 ${lang.code === currentLang ? "bg-accent" : ""}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
