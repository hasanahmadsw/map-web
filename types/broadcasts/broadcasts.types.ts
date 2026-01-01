import { BaseListParams } from '@/hooks/api/list/useListUrlState';
import { BroadcastType, BroadcastUnitItemGroup } from './broadcast.enums';

export interface BroadcastUnit {
  id: number;
  type: `${BroadcastType}`;
  slug: string;
  title?: string;
  summary?: string;
  description?: string;
  specs?: any;
  coverImage?: string;
  gallery?: any;
  isPublished: boolean;
  order: number;
  items: BroadcastUnitItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastUnitItem {
  group?: `${BroadcastUnitItemGroup}`;
  title: string;
  qty?: number;
  notes?: string;
  order?: number;
}

export interface BroadcastUnitParams extends BaseListParams {
  type?: `${BroadcastType}`;
  search?: string;
  isPublished?: boolean;
  [key: string]: string | number | boolean | undefined;
}
