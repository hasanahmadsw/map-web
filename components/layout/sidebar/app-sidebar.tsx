"use client";

import { BookOpen, FileText, Package, PieChart, Settings2, Tag, Users } from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/providers/translations-provider";

// Navigation is now translated via translation keys

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { getTranslationValue ,t } = useTranslation();

  const navMain = [
    {
      title: t.navigation.dashboard   ,
      url: "/dashboard",
      icon: PieChart,
      
    },
    {
      title: t.navigation.manageArticles,
      url: "/dashboard/articles",
      icon: FileText,
    },
    {
      title: t.navigation.manageServices,
      url: "/dashboard/services",
      icon: Package,
    },
    {
      title: t.staffs.staffManagement, 
      url: "/dashboard/staff",
      icon: Users,
    },
    {
      title: t.navigation.settings,
      url: "#",
      icon: Settings2,
      items: [
        {
          title: t.settings.general,
          url: "/dashboard/settings/general",
        },
        {
          title: t.navigation.languages,
          url: "/dashboard/settings/languages",
        },
      
      ],
    },
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <h1 className="text-xl font-bold">{state === "collapsed" ? getTranslationValue("header.siteNameShort") : getTranslationValue("header.siteName")}</h1>
        </div>
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
