import { Role, ROLES, type RoleType } from "@/enums/roles.enum";
import type { BaseListParams } from "@/hooks/list/useListUrlState";

export { Role, ROLES, type RoleType };

export interface Staff {
  id: number;
  name: string;
  email: string;
  bio: string;
  image: string | null;
  role: RoleType;
  translations: StaffTranslation[];
  createdAt: string;
  updatedAt?: string;
}

export interface StaffTranslation {
  id: number;
  staffId: number;
  languageCode: string;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStaffParams extends BaseListParams {
  role?: Role;
  sort?: "createdAt" | "name";
  order?: "asc" | "desc";
}
