'use client';

import Image from 'next/image';
import Link from 'next/link';

import { NavMain } from '@/components/layout/sidebar/nav-main';
import { NavUser } from '@/components/layout/sidebar/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { navMain } from './links';

// Navigation is now translated via translation keys

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 p-2 transition-opacity hover:opacity-80">
          <Image src="/logo.png" alt="MAP Logo" width={130} height={40} className="h-8 w-auto" priority />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
