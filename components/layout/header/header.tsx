'use client';

import { useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

import Logo from './logo';
import Navbar from './navbar';
import NavbarMobile from './navbar-mobile';

import { cn } from '@/lib/utils';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { ThemeToggle } from '../nav/theme-toggle';
import { UserMenu } from '../nav/user-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { myCookies, readCookieFromCookies, readCookieFromDocument } from '@/utils/cookies';

function Header() {
  const ref = useRef<HTMLDivElement>(null);

  const authToken = readCookieFromDocument(myCookies.auth);
  const isAuthenticated = !!authToken;

  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <MotionWrapper
      ref={ref}
      className={cn(
        'h-navbar-height top-edge-bar-margin fixed inset-x-0 z-50 w-full px-4 transition-all duration-1000',
        visible && 'top-4!',
      )}
    >
      {/* Desktop Resizable Navbar */}
      <MotionWrapper
        as="header"
        animate={{
          backdropFilter: visible ? 'blur(10px)' : 'none',
          boxShadow: visible
            ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
            : 'none',
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          'border-border bg-background/80 relative z-60 mx-auto flex max-w-[calc(100vw-2rem)] items-center justify-between self-start rounded-3xl border-b px-6 py-4 transition-all duration-1000 lg:max-w-7xl lg:min-w-[1000px]',
          visible && 'bg-background/80 py-2',
          visible ? 'w-11/12 lg:w-5/12' : 'w-full',
        )}
      >
        <Logo />

        {/* Desktop Navigation */}
        <Navbar />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          {/* Desktop Navigation */}
          <NavbarMobile />
        </div>
      </MotionWrapper>
    </MotionWrapper>
  );
}

export default Header;
