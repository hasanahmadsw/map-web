'use client';

import { useStaffMe } from '@/hooks/staff/useStaffMe';

import { DashboardHomeSkeleton } from '@/components/dashboard/home/dashboard-home-skeleton';
import { AdminDashboardHome } from './admin-dashboard-home';
import { AuthorDashboardHome } from './author-dashboard-home';
import ApiError from '@/components/shared/api-error';

export function DashboardHome() {
  const { currentStaff, isLoading, isError, error, refetch, isAdmin, isSuperAdmin, isAuthor } = useStaffMe();

  if (isLoading) return <DashboardHomeSkeleton />;

  if (isError) {
    return (
      <div className="space-y-6">
        <ApiError errorMessage={error ?? 'Please try again.'} refetchFunction={refetch} />
      </div>
    );
  }

  const staffName = currentStaff?.name ?? null;

  if (isAuthor) return <AuthorDashboardHome staffName={staffName} />;
  if (isAdmin || isSuperAdmin) return <AdminDashboardHome staffName={staffName} />;

  return <AuthorDashboardHome staffName={staffName} />;
}
