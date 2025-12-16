export enum Role {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  AUTHOR = 'author',
}

export const ROLES = ['superadmin', 'admin', 'author'] as const;
export const ROLE_OPTIONS = ['admin', 'author'] as const;
export type RoleType = (typeof ROLES)[number];
