"use client";

import { Menu, Home, Newspaper, Tag, Users, BookOpen, X, LogOut, Settings, User, Globe, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { LanguageSwitcher } from "@/components/layout/nav/language-switcher";
import { ThemeToggle } from "@/components/layout/nav/theme-toggle";
import { UserMenu } from "@/components/layout/nav/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import { useAuth } from "@/hooks/useAuth";
import { useStaff } from "@/hooks/staff/useStaff";
import { useLanguages } from "@/hooks/useLanguages";
import { useTheme } from "next-themes";
import { getLocalizedRoute, i18n, type Lang } from "@/utils/dictionary-utils";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isAuthenticated: boolean;
}
export function Navbar({ isAuthenticated }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const lang = useLang();
  const navigation = [
    { name: t.navigation.home, href: "/", icon: Home },
    { name: t.navigation.news, href: "/news", icon: Newspaper },
    { name: t.navigation.topics, href: "/topics", icon: BookOpen },
    { name: t.navigation.tags, href: "/tags", icon: Tag },
    { name: t.navigation.authors, href: "/authors", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href={`/${lang}`} className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">{t.header.siteName}</span>
            <Image
              src="/logo.png"
              alt={t.header.siteName || "MAP Logo"}
              width={130}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={`/${lang}${item.href}`}
              className="text-sm font-medium leading-6 text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/login">{t.header.signIn}</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <span className="sr-only">{t.header.openMainMenu}</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm p-0">
            <div className="flex flex-col h-full">
              {/* Header with Logo */}
              <div className="flex items-center justify-between p-6 border-b">
                <Link href={`/${lang}`} onClick={() => setOpen(false)} className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt={t.header.siteName || "MAP Logo"}
                    width={130}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={`/${lang}${item.href}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Footer Section */}
              <div className="border-t px-4 py-6 space-y-6">
                {/* Account Section */}
                {isAuthenticated ? (
                  <>
                    <MobileUserMenu lang={lang} t={t} onLinkClick={() => setOpen(false)} />
                  </>
                ) : (
                  <Link 
                    href={`/${lang}/login`} 
                    onClick={() => setOpen(false)}
                    className="block w-full text-center text-sm font-medium py-2 transition-colors hover:text-primary"
                  >
                    {t.header.signIn}
                  </Link>
                )}

                {/* Language Switcher */}
                <MobileLanguageSwitcher 
                  lang={lang} 
                  onLanguageChange={() => setOpen(false)} 
                  t={t}
                />

                {/* Theme Toggle */}
                <MobileThemeToggle t={t} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

// Mobile User Menu Component
function MobileUserMenu({ 
  lang, 
  t, 
  onLinkClick 
}: { 
  lang: string
  t: any
  onLinkClick: () => void 
}) {
  const { logout } = useAuth()
  const { currentStaff, isLoading } = useStaff()

  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    try {
      await logout()
      onLinkClick()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading || !currentStaff) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentStaff.image ?? ""} alt={currentStaff.name} />
          <AvatarFallback className="text-xs">{getUserInitials(currentStaff.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentStaff.name}</p>
          <p className="text-xs text-muted-foreground truncate">{currentStaff.email}</p>
        </div>
      </div>

      {/* User Actions */}
      <div className="space-y-1">
        <Link
          href={`/${lang}/dashboard/profile`}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:text-primary"
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{t.header.profile}</span>
        </Link>
        <Link
          href={`/${lang}/dashboard`}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:text-primary"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>{t.header.dashboard}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:text-destructive text-left"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          <span>{t.header.signOut}</span>
        </button>
      </div>
    </div>
  )
}

// Mobile Language Switcher Component
function MobileLanguageSwitcher({ 
  lang, 
  onLanguageChange,
  t 
}: { 
  lang: string
  onLanguageChange: () => void
  t: any
}) {
  const currentLang = useLang()
  const pathname = usePathname()
  const { languages, isLoading } = useLanguages()

  const languageNames: Record<Lang, string> = {
    en: "English",
    ar: "العربية",
  }

  const languageFlags: Record<Lang, string> = {
    en: "🇺🇸",
    ar: "🇸🇦",
  }

  const getCurrentPath = () => {
    const pathSegments = pathname.split("/")
    if (pathSegments.length > 1 && i18n.langs.includes(pathSegments[1] as Lang)) {
      return "/" + pathSegments.slice(2).join("/")
    }
    return pathname
  }

  const currentPath = getCurrentPath()

  const availableLanguages = React.useMemo(() => {
    if (languages && languages.length > 0) {
      return languages.map((lang) => ({
        name: languageNames[lang.code as Lang] || lang.code,
        flag: languageFlags[lang.code as Lang] || "🌐",
        code: lang.code as Lang,
      }))
    }
    return i18n.langs.map((lang) => ({
      name: languageNames[lang] || lang,
      flag: languageFlags[lang] || "🌐",
      code: lang,
    }))
  }, [languages])

  const handleLanguageChange = (newLang: Lang) => {
    if (newLang === currentLang) return
    const newPath = getLocalizedRoute(newLang, currentPath)
    window.location.href = newPath
    onLanguageChange()
  }

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-muted-foreground">{t.header.language}</span>
      <div className="space-y-1">
        {availableLanguages.map((langItem) => {
          const isActive = langItem.code === currentLang
          return (
            <button
              key={langItem.code}
              onClick={() => handleLanguageChange(langItem.code)}
              disabled={isLoading || isActive}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-base">{langItem.flag}</span>
              <span className="flex-1 text-left">{langItem.name}</span>
              {isActive && <span className="text-xs text-primary">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Mobile Theme Toggle Component
function MobileThemeToggle({ t }: { t: any }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-muted-foreground">{t.header.theme}</span>
      <div className="space-y-1">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.value
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{themeOption.label}</span>
              {isActive && <span className="text-xs text-primary">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
