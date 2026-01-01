import { BaseListParams } from '@/hooks/api/list/useListUrlState';
import { BroadcastType, BroadcastUnitItemGroup } from './broadcast.enums';
import { GalleryItem } from '../common.types';

export interface BroadCastUnitSpecs {
  format?: string;
  routing?: string;
  intercom?: string;
  intercomList?: string[];
  useCases?: string[];
  audioMixer?: string;
  visionMixer?: string;
  visionMixers?: string[];
  cameraChains?: number;
  cameraSystem?: string;
  powerBackup?: string;
  power?: string;
  mobility?: string;
  deployment?: string;
}

export interface BroadcastUnit {
  id: number;
  type: `${BroadcastType}`;
  slug: string;
  title?: string;
  summary?: string;
  description?: string;
  specs?: BroadCastUnitSpecs;
  coverImage?: string;
  gallery?: GalleryItem[];
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
