'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { routeAccessConfig } from '@/components/guard/route-access-config';
import { useUserRole } from './useUserRole';
import ApiError from '../shared/api-error';
import AccessDenied from '../shared/access-denied';

interface RouteGuardProps {
  children: React.ReactNode;
}

function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { canAccess, user, isLoading, refetch, error, isSuperAdmin } = useUserRole();

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <ApiError
          refetchFunction={refetch}
          errorMessage={error ?? 'An error occurred while fetching the user data'}
        />
      </div>
    );
  }

  const pathnameWithoutLang = pathname.replace(`/en`, '') || '/dashboard';

  // Sorts routes by path length (longest first), so more specific routes are checked before general ones
  const sortedRoutes = [...routeAccessConfig].sort((a, b) => b.path.length - a.path.length);

  const privateRoute = sortedRoutes.find(route => {
    if (route.pattern) {
      return route.pattern.test(`${pathnameWithoutLang}${params.toString() ? `?${params.toString()}` : ''}`);
    }
    if (route.isExactly) {
      return pathnameWithoutLang === route.path;
    }

    return pathnameWithoutLang.startsWith(route.path);
  });

  if (!privateRoute || isSuperAdmin) {
    return <>{children}</>;
  }

  const hasPermission = canAccess(privateRoute.allowedRole);

  if (!hasPermission) {
    return (
      <AccessDenied title="Permission Denied" message="You do not have permission to access this page" />
    );
  }

  return <>{children}</>;
}

export default RouteGuard;
