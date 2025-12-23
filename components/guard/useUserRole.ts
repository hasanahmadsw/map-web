import { Role } from '@/types/roles.enum';
import { useStaffMe } from '@/hooks/staff/useStaffMe';

export function useUserRole() {
  const { currentStaff, currentUserRole, isLoading, refetch, error, isSuperAdmin, isAdmin, isAuthor } =
    useStaffMe();

  const canAccess = (allowedRoles: `${Role}`[]) => {
    if (isSuperAdmin) return true;

    return allowedRoles.includes(currentUserRole);
  };

  return {
    canAccess,
    user: currentStaff,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isAuthor,
    refetch,
    error,
  };
}
