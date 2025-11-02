"use client";

import { BookOpen, BriefcaseBusiness, FileText, Image as ImageIcon, Package, PieChart, Settings2, Tag, Users } from "lucide-react";
import type * as React from "react";
import Image from "next/image";
import Link from "next/link";

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
import { useLang } from "@/hooks/useLang";

// Navigation is now translated via translation keys

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { getTranslationValue ,t } = useTranslation();
  const lang = useLang();

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
      title: t.navigation.manageSolutions,
      url: "/dashboard/solutions",
      icon: BriefcaseBusiness,
    },
    {
      title: t.navigation.manageMedia,
      url: "/dashboard/media",
      icon: ImageIcon,
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
        <Link href={`/${lang}`} className="flex items-center gap-2 p-2 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt={getTranslationValue("header.siteName") || "MAP Logo"}
            width={130}
            height={40}
            className="h-8 w-auto"
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
