import RouteGuard from '@/components/guard/RouteGuard';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { DashboardBreadcrumb } from '@/components/shared/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    template: '%s | MAP',
    default: 'MAP',
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <SidebarProvider>
        <AppSidebar side="left" />
        <SidebarInset className="m-0! h-full max-w-full overflow-x-hidden rounded-none! border-none! p-0! shadow-none">
          <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-me-1" />
              <Separator orientation="vertical" className="me-2 data-[orientation=vertical]:h-4" />
              <DashboardBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
