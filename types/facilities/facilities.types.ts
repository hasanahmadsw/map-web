import { BaseListParams } from '@/hooks/api/list/useListUrlState';
import { FacilityType, FacilityUnitItemGroup } from './facility.enums';

export interface Facility {
  id: number;
  solutionId: number;
  type: FacilityType;
  slug: string;
  title?: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  gallery?: any;
  isPublished: boolean;
  viewCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityUnit {
  id: number;
  facilityId: number;
  slug: string;
  title?: string;
  summary?: string;
  description?: string;
  specs?: any;
  coverImage?: string;
  gallery?: any;
  isPublished: boolean;
  order: number;
  items: FacilityUnitItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FacilityUnitItem {
  group?: `${FacilityUnitItemGroup}`;
  title: string;
  qty?: number;
  notes?: string;
  order?: number;
}

export interface FacilityParams extends BaseListParams {
  search?: string;
  solutionId?: number;
  type?: `${FacilityType}`;
  isPublished?: boolean;
  slug?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface FacilityUnitParams extends BaseListParams {
  facilityId?: number;
  search?: string;
  isPublished?: boolean;
  [key: string]: string | number | boolean | undefined;
}
