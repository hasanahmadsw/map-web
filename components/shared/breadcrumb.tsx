'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  customItems?: BreadcrumbItemType[];
  className?: string;
}

export function DashboardBreadcrumb({ customItems, className = '' }: DashboardBreadcrumbProps) {
  const pathname = usePathname();

  const normalizePath = (path: string): string => {
    const withoutQuery = path.split('?')[0] || '/';
    const parts = withoutQuery.split('/');
    const first = parts[1] || '';
    const isLocale = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(first);
    if (isLocale) return withoutQuery.slice(first.length + 1) || '/';
    return withoutQuery;
  };

  const generateBreadcrumbItems = (): BreadcrumbItemType[] => {
    if (customItems) {
      return customItems;
    }
    const current = normalizePath(pathname);
    const segments = current.split('/').filter(Boolean);
    const items: BreadcrumbItemType[] = [];
    const dashboardIndex = segments.findIndex(segment => segment === 'dashboard');
    if (dashboardIndex === -1) {
      items.push({ label: 'Dashboard', href: '/dashboard' });
      return items;
    }
    items.push({ label: 'Dashboard', href: '/dashboard' });
    const afterDashboardSegments = segments.slice(dashboardIndex + 1);
    if (afterDashboardSegments.length === 0) {
      items.push({ label: 'Overview' });
      return items;
    }
    let currentPath = '/dashboard';
    afterDashboardSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === afterDashboardSegments.length - 1;
      const label = segment;
      items.push({
        label,
        href: isLast ? undefined : currentPath,
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
            <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
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
