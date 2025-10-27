import { ArticleMeta } from "./article.types";
import { Staff } from "./staff.types";

export interface ArticleTranslation {
  id: number;
  articleId: number;
  languageCode: string;
  name: string;
  content: string;
  excerpt: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  language: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

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
  meta: ArticleMeta;
  tags: string[];
  topics: string[];
  createdAt: string;
  author: Staff;
  updatedAt: string;
  relatedArticles?: Article[] |null;
}


export interface ArticleStaffResponse {
  id: number;
  slug: string;
  image: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string | null;
  viewCount: number;
  tags: string[];
  topics: string[];
  translations: ArticleTranslation[];
  createdAt: string;
  updatedAt: string;
}

// export interface CreateArticleDTO {
//   slug: string;
//   image?: string | null;
//   isPublished: boolean;
//   isFeatured: boolean;
//   featuredImage?: string | null;
//   name: string;
//   content: string;
//   excerpt: string;
//   meta: {
//     title: string;
//     keywords: string[];
//     description: string;
//   };
//   languageCode: string;
//   tagIds: number[];
//   topicIds: number[];
//   translateTo: string[];
// }

// export interface UpdateArticleDTO {
//   id: number;
//   slug: string;
//   image?: string | null;
//   isPublished: boolean;
//   isFeatured: boolean;
//   featuredImage?: string | null;
//   name: string;
//   content: string;
//   excerpt: string;
//   meta: {
//     title: string;
//     keywords: string[];
//     description: string;
//   };
//   languageCode: string;
//   tagIds: number[];
//   topicIds: number[];
//   translateTo: string[];
// }

// export interface CreateArticleTranslationDTO {
//   languageCode: string;
//   name: string;
//   content: string;
//   excerpt: string;
//   meta: {
//     title: string;
//     keywords: string[];
//     description: string;
//   };
// }

// export interface UpdateArticleTranslationDTO {
//   id: number;
//   languageCode: string;
//   name: string;
//   content: string;
//   excerpt: string;
//   meta: {
//     title: string;
//     keywords: string[];
//     description: string;
//   };
// }

// export interface AutoTranslateArticleDTO {
//   translateTo: string[];
// }
