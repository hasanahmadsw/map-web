export interface StaffService {
  id: number;
  slug: string;
  icon: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string;
  viewCount: number;
  order: number;
  translations: ServiceTranslation[];
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

export interface ServiceTranslation {
  id: number;
  serviceId: number;
  languageCode: string;
  name: string;
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  subServices: SubService[];
  language: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
