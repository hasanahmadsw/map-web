import type { BaseListParams } from '@/hooks/api/list/useListUrlState';
import type { SolutionKey } from './solution-key.enum';
import { GalleryItem } from './common.types';

export interface StaffService {
  id: number;
  slug: string;
  icon: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string;
  viewCount: number;
  order: number;
  name: string;
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  subServices: SubService[];
  solutionKey: SolutionKey;
  gallery: GalleryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  id: number;
  slug: string;
  icon: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string;
  viewCount: number;
  order: number;
  subServices: SubService[];
  solutionKey: SolutionKey;
  gallery: GalleryItem[];
  name: string;
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubService {
  title: string;
  description: string;
}

export interface IServiceParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}
