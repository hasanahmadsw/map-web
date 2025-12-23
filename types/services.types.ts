import type { BaseListParams } from '@/hooks/api/list/useListUrlState';

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
  solutions?: Array<{ id: number } | number>;
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
  name: string;
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
}

export interface SubService {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface IServiceParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}
