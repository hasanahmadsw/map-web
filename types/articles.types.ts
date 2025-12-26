import type { BaseListParams } from '@/hooks/api/list/useListUrlState';
import { Staff } from './staff.types';

export interface Article {
  id: number;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  image: string | null;
  viewCount: number;
  name: string;
  content: string;
  excerpt: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  tags: string[];
  topics: string[];
  createdAt: string;
  author: Staff;
  updatedAt: string;
  relatedArticles?: Article[] | null;
}

export interface ArticleListParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  [key: string]: string | number | boolean | undefined;
}
