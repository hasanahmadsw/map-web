"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { LanguageSwitcher } from "@/components/layout/nav/language-switcher";
import { ThemeToggle } from "@/components/layout/nav/theme-toggle";
import { UserMenu } from "@/components/layout/nav/user-menu";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";

interface NavbarProps {
  isAuthenticated: boolean;
}
export function Navbar({ isAuthenticated }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const  lang  = useLang();
    const navigation = [
    { name: t.navigation.home, href: "/" },
    { name: t.navigation.news, href: "/news" },
    { name: t.navigation.topics, href: "/topics" },
    { name: t.navigation.tags, href: "/tags" },
    { name: t.navigation.authors, href: "/authors" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{t.header.siteName}</span>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">{t.header.siteNameShort}</span>
              </div>
              <span className="font-bold text-xl">{t.header.siteName}</span>
            </div>
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
          <SheetContent side="top" className="h-full w-full p-6">
            <SheetHeader className="pb-6">
              <SheetTitle>{t.header.menu}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${lang}${item.href}`} 
                    className="block text-lg font-medium transition-colors hover:text-primary py-3 px-4 rounded-lg hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 px-4">{t.header.account}</h3>
                <div className="space-y-2">
                  {isAuthenticated ? (
                    <UserMenu showLabel className="w-full justify-start px-4 py-3" />
                  ) : (
                    <Button className="w-full justify-start px-4 py-3" asChild>
                      <Link href="/login">{t.header.signIn}</Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="border-t pt-6">
                <div className="flex items-center justify-between px-4 mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{t.header.language}</span>
                  <LanguageSwitcher showLabel />
                </div>
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-muted-foreground">{t.header.theme}</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
