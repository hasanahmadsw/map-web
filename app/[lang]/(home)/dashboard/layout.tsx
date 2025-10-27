import { LanguageSwitcher } from "@/components/layout/nav/language-switcher";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { DashboardBreadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getDirection, type Lang } from "@/utils/dictionary-utils";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ lang: Lang }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const direction = getDirection(lang) === "rtl" ? "right" : "left";
  return (
    <SidebarProvider>
      <AppSidebar side={direction} />
      <SidebarInset>
        <header className="flex h-16 w-full px-4 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-me-1" />
            <Separator orientation="vertical" className="me-2 data-[orientation=vertical]:h-4" />
            <DashboardBreadcrumb />
          </div>
          <div>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
