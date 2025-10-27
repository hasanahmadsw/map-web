"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/providers/translations-provider";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const normalizePath = (path: string | null): string => {
    if (!path) return "/";
    const withoutQuery = path.split("?")[0] || "/";
    const parts = withoutQuery.split("/");
    const first = parts[1] || "";
    const isLocale = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(first);
    if (isLocale) return withoutQuery.slice(first.length + 1) || "/";
    return withoutQuery;
  };

  const currentPath = normalizePath(pathname ?? null);
  const isExactActive = (url: string): boolean => currentPath === url;
  const isDeepActive = (url: string): boolean => currentPath === url || currentPath.startsWith(url + "/");
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{ t.header.menu}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // If item has no children, render as simple link
          if (!item.items || item.items.length === 0) {
            const isRootDashboard = item.url === "/dashboard";
            const active = isRootDashboard ? isExactActive(item.url) : isDeepActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={active} aria-current={active ? "page" : undefined}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // If item has children, render as collapsible
          const sectionActive =
            (item.url && item.url !== "#" && isExactActive(item.url)) ||
            (item.items ?? []).some((sub) => isDeepActive(sub.url));
          return (
            <Collapsible key={item.title} asChild defaultOpen={sectionActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger style={{
                  width: "100%",
                  justifyContent: "space-between",
                  display: "flex",
                  cursor: "pointer",
                }} asChild className="w-full justify-between flex">
                  <SidebarMenuButton tooltip={item.title} className="w-full justify-between" isActive={sectionActive} style={{
                    width: "100%",
                    cursor: "pointer",
                  }}>
                  <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="size-5"/>}
                      <span>{item.title}</span>
                  </div>
                    <ChevronRight className=" transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const subActive = isDeepActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild className="!py-2" isActive={subActive} aria-current={subActive ? "page" : undefined} style={{
                            padding: "1rem 0.75rem",
                          }}>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
