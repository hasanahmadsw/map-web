"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/nav/navbar";
import { useLang } from "@/hooks/useLang";

interface ConditionalNavbarProps {
  isAuthenticated: boolean;
}

export function ConditionalNavbar({ isAuthenticated }: ConditionalNavbarProps) {
  const pathname = usePathname();
  const lang = useLang();

  // Hide navbar on dashboard pages and auth pages
  if (pathname.startsWith(`/${lang}/dashboard`) || pathname.startsWith(`/${lang}/login`)) {
    return null;
  }

  return <Navbar isAuthenticated={isAuthenticated} />;
}
