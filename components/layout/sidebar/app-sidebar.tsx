'use client';

import Image from 'next/image';
import Link from 'next/link';

import { NavMain } from '@/components/layout/sidebar/nav-main';
import { NavUser } from '@/components/layout/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { navMain } from './links';
import { cn } from '@/lib/utils';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 p-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="MAP Logo"
            width={130}
            height={40}
            className={cn('transition-all duration-300', state === 'collapsed' ? 'h-4 w-14' : 'h-14 w-32')}
            priority
          />
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
