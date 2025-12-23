'use client';

import { Menu, Home, Briefcase, FileText, X, LogOut, Settings, User, Moon, Sun, Monitor } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';

import { ThemeToggle } from '@/components/layout/nav/theme-toggle';
import { UserMenu } from '@/components/layout/nav/user-menu';
import { SolutionsDropdown, MobileSolutionsAccordion } from '@/components/layout/nav/solutions-dropdown';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useAuth } from '@/hooks/api/useAuth';
import { useStaffMe } from '@/hooks/api/staff/useStaffMe';

import { useTheme } from 'next-themes';

interface NavbarProps {
  isAuthenticated: boolean;
}
export function Navbar({ isAuthenticated }: NavbarProps) {
  const [open, setOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Rent', href: '/rent', icon: Briefcase },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Blog', href: '/blog', icon: FileText },
  ];

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">MAP</span>
            <Image src="/logo.png" alt="MAP Logo" width={130} height={40} className="h-8 w-auto" priority />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => (
            <Link
              key={item.name}
              href={`${item.href}`}
              className="text-foreground hover:text-primary text-sm leading-6 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <SolutionsDropdown />
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
            <div className="flex h-full flex-col">
              {/* Header with Logo */}
              <div className="flex items-center justify-between border-b p-6">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                  <Image src="/logo.png" alt="MAP Logo" width={130} height={40} className="h-8 w-auto" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="lg:hidden">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
                {navigation.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={`/${item.href}`}
                      className="hover:text-primary flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <MobileSolutionsAccordion onLinkClick={() => setOpen(false)} />
              </div>

              {/* Footer Section */}
              <div className="space-y-6 border-t px-4 py-6">
                {/* Account Section */}
                {isAuthenticated ? (
                  <>
                    <MobileUserMenu onLinkClick={() => setOpen(false)} />
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="hover:text-primary block w-full py-2 text-center text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                )}

                {/* Theme Toggle */}
                <MobileThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

// Mobile User Menu Component
function MobileUserMenu({ onLinkClick }: { onLinkClick: () => void }) {
  const { logout } = useAuth();
  const { currentStaff, isLoading } = useStaffMe();

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLinkClick();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading || !currentStaff) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* User Info */}
      <div className="border-border flex items-center gap-3 border-b pb-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentStaff.image ?? ''} alt={currentStaff.name} />
          <AvatarFallback className="text-xs">{getUserInitials(currentStaff.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentStaff.name}</p>
          <p className="text-muted-foreground truncate text-xs">{currentStaff.email}</p>
        </div>
      </div>

      {/* User Actions */}
      <div className="space-y-1">
        <Link
          href={`/dashboard/profile`}
          onClick={onLinkClick}
          className="hover:text-primary flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <User className="text-muted-foreground h-4 w-4" />
          <span>Profile</span>
        </Link>
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="hover:text-primary flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Settings className="text-muted-foreground h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-destructive flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors"
        >
          <LogOut className="text-muted-foreground h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// Mobile Theme Toggle Component
function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-3">
      <span className="text-muted-foreground text-sm font-medium">Theme</span>
      <div className="space-y-1">
        {themes.map(themeOption => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{themeOption.label}</span>
              {isActive && <span className="text-primary text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
