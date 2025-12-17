import { Role } from '@/enums/roles.enum';

export interface RoutePermission {
  path: string;
  isExactly?: boolean;
  pattern?: RegExp;
  allowedRole: `${Role}`[];
}

export const routeAccessConfig: RoutePermission[] = [
  {
    path: '/',
    isExactly: true,
    allowedRole: [Role.SUPERADMIN, Role.ADMIN, Role.AUTHOR],
  },
  {
    path: '/dashboard/articles',
    allowedRole: [Role.SUPERADMIN, Role.ADMIN, Role.AUTHOR],
  },
  {
    path: '/dashboard/solutions',
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    path: '/dashboard/services',
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    path: '/dashboard/media',
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    path: '/dashboard/staff',
    allowedRole: [Role.SUPERADMIN, Role.ADMIN],
  },
  {
    path: '/dashboard/settings',
    allowedRole: [Role.SUPERADMIN],
  },
];
