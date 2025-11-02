export interface StaffSolution {
  id: number;
  slug: string;
  icon: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string;
  viewCount: number;
  order: number;
  translations: SolutionTranslation[];
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
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
}


export interface SolutionTranslation {
  id: number;
  solutionId: number;
  languageCode: string;
  name: string;
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  language: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
