import type { ServiceResponse } from './services.types';
import type { BaseListParams } from '@/hooks/api/list/useListUrlState';

export interface StaffSolution {
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
  services: ServiceResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface SolutionResponse {
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
  services?: ServiceResponse[];
  createdAt: string;
  updatedAt: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
}

export interface SolutionListParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sort?: 'createdAt' | 'updatedAt' | 'name' | 'order';
}
