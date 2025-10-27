"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/providers/translations-provider";
import { getLocalizedRoute } from "@/utils/dictionary-utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  customItems?: BreadcrumbItemType[];
  className?: string;
}

export function DashboardBreadcrumb({ customItems, className = "" }: DashboardBreadcrumbProps) {
  const pathname = usePathname();
  const { t, lang } = useTranslation();

  const normalizePath = (path: string): string => {
    const withoutQuery = path.split("?")[0] || "/";
    const parts = withoutQuery.split("/");
    const first = parts[1] || "";
    const isLocale = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(first);
    if (isLocale) return withoutQuery.slice(first.length + 1) || "/";
    return withoutQuery;
  };

  const translateSegment = (segment: string): string => {
    switch (segment) {
      case "dashboard":
        return t.navigation.dashboard;
      case "news":
        return t.navigation.news;
      case "articles":
        return t.articles.title;
      case "staff":
        return t.staffs.title || t.navigation.staff;
      case "tags":
        return t.tags.title;
      case "topics":
        return t.topics.title;
      case "settings":
        return t.settings.title;
      case "languages":
        return t.navigation.languages;
      case "general":
        return t.settings.general;
      case "profile":
        return t.navigation.profile;
      case "team":
        return t.navigation.team;
      case "edit":
        return t.common.edit;
      case "add":
        return t.common.add;
      default:
        return segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  const generateBreadcrumbItems = (): BreadcrumbItemType[] => {
    if (customItems) {
      return customItems;
    }
    const current = normalizePath(pathname);
    const segments = current.split("/").filter(Boolean);
    const items: BreadcrumbItemType[] = [];
    const dashboardIndex = segments.findIndex((segment) => segment === "dashboard");
    if (dashboardIndex === -1) {
      items.push({ label: t.navigation.dashboard, href: getLocalizedRoute(lang, "/dashboard") });
      return items;
    }
    items.push({ label: t.navigation.dashboard, href: getLocalizedRoute(lang, "/dashboard") });
    const afterDashboardSegments = segments.slice(dashboardIndex + 1);
    if (afterDashboardSegments.length === 0) {
      items.push({ label: t.dashboard.overview });
      return items;
    }
    let currentPath = "/dashboard";
    afterDashboardSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === afterDashboardSegments.length - 1;
      const label = translateSegment(segment);
      items.push({
        label,
        href: isLast ? undefined : getLocalizedRoute(lang, currentPath),
      });
    });
    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item: BreadcrumbItemType, index: number) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
