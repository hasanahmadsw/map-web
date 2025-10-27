import type { SortBy, SortOrder } from "./common.types";

export interface Article {
  id: number;
  name: string;
  slug: string;
  content: string;
  excerpt?: string;
  isPublished: boolean;
  isFeatured: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  meta?: ArticleMeta;
  tags?: string[];
  topics?: string[];
}

export interface ArticleMeta {
  title: string;
  keywords: string[];
  description: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface ArticlesQueryParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  lang: string;
  search?: string;
  tagId?: number;
  topicId?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface CreateArticleDTO {
  name: string;
  content: string;
  excerpt?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  image?: string;
  tagIds?: number[];
  topicIds?: number[];
  meta?: ArticleMeta;
}

export interface UpdateArticleDTO extends Partial<CreateArticleDTO> {
  id: number;
}
