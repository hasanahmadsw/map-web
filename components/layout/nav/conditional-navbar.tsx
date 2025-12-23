'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/nav/navbar';

interface ConditionalNavbarProps {
  isAuthenticated: boolean;
}

export function ConditionalNavbar({ isAuthenticated }: ConditionalNavbarProps) {
  const pathname = usePathname();

  // Hide navbar on dashboard pages and auth pages
  if (pathname.startsWith(`/dashboard`) || pathname.startsWith(`/login`)) {
    return null;
  }

  return <Navbar isAuthenticated={isAuthenticated} />;
}
