'use client';

import { useQuery } from '@tanstack/react-query';
import { staffQueryKeys } from '@/hooks/keys';
import { staffService } from '@/services/staff.service';
import { Role, type Staff } from '@/types/staff.types';

export function useStaffMe(enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Staff>({
    queryKey: staffQueryKeys.detail('me'),
    queryFn: () => staffService.getById('me'),
    enabled,
  });

  const currentUserId = data?.id;
  const currentUserRole = data?.role as `${Role}`;

  const isSuperAdmin = currentUserRole === Role.SUPERADMIN;
  const isAdmin = currentUserRole === Role.ADMIN;
  const isAuthor = currentUserRole === Role.AUTHOR;

  const isCurrentUser = (id: number | string) => currentUserId === id;

  return {
    currentStaff: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
    isSuperAdmin,
    isAdmin,
    isAuthor,
    currentUserRole,
    isCurrentUser,
  };
}
