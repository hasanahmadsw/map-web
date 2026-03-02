'use client';

import { useState, useEffect } from 'react';

import Logo from './logo';
import Navbar from './navbar';
import NavbarMobile from './navbar-mobile';

import { cn } from '@/lib/utils';
import { UserMenu } from '../nav/user-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { myCookies, readCookieFromDocument } from '@/utils/cookies';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check authentication on client side only to prevent hydration mismatch
  useEffect(() => {
    setTimeout(() => {
      const authToken = readCookieFromDocument(myCookies.auth);
      setIsAuthenticated(!!authToken);
      setIsMounted(true);
    }, 100);
  }, []);

  return (
    <div className="h-navbar-height top-edge-bar-margin fixed inset-x-0 z-50 w-full px-4">
      <header
        className={cn(
          'border-border bg-background relative z-60 mx-auto flex max-w-[calc(100vw-2rem)] items-center justify-between self-start rounded-3xl border-b px-6 py-4 lg:max-w-7xl lg:min-w-[1000px] w-full',
        )}
      >
        <Logo width={80} height={40} />

        {/* Desktop Navigation */}
        <Navbar />

        <div className="flex items-center gap-2">
          {isMounted && isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/login" className="text-white">
                Sign In
              </Link>
            </Button>
          )}
          {/* Desktop Navigation */}
          <NavbarMobile />
        </div>
      </header>
    </div>
  );
}

export default Header;
