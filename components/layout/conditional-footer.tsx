'use client';

import { useParams, usePathname } from 'next/navigation';
import { Footer } from './footer';

export function ConditionalFooter() {
  const pathname = usePathname();

  const isPrivatePage = pathname.startsWith('/dashboard');

  if (isPrivatePage) {
    return null;
  }

  return <Footer />;
}
