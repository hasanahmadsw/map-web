
import { BaseListParams } from "./common.types";
import { Staff } from "./staff.types";

export interface Article {
  id: number;
  slug: string;
  image: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string | null;
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
  relatedArticles?: Article[] |null;
}


export interface ArticleListParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}