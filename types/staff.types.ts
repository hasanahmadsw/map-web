import { Role, ROLES, type RoleType } from '@/types/roles.enum';
import type { BaseListParams } from '@/hooks/api/list/useListUrlState';

export { Role, ROLES, type RoleType };

export interface Staff {
  id: number;
  name: string;
  email: string;
  bio: string;
  image: string | null;
  role: RoleType;
  createdAt: string;
  updatedAt?: string;
}

export interface IStaffParams extends BaseListParams {
  role?: Role;
  sort?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}
