export interface BaseTranslation {
  id: number;
  languageCode: string;
  name: string;
  createdAt?: string;
}

export interface ArticleTranslation extends BaseTranslation {
  content: string;
  excerpt: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface StaffTranslation extends BaseTranslation {
  bio: string;
}

export interface TagTranslation extends BaseTranslation {
  description: string;
}

export interface TopicTranslation extends BaseTranslation {
  description: string;
}

export interface ServiceTranslation extends BaseTranslation {
  description: string;
  shortDescription: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  subServices: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
}

export type Translation = ArticleTranslation | TagTranslation | TopicTranslation | StaffTranslation | ServiceTranslation;

export interface EditableTranslation {
  id: number;
  languageCode: string;
  name: string;
  description?: string;
  shortDescription?: string;
  bio?: string;
  content?: string;
  excerpt?: string;
  meta?: {
    title: string;
    description: string;
    keywords: string[];
  };
  subServices?: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
  isEditing: boolean;
}

export interface TranslationHooks<T extends Translation> {
  translations: T[];
  isLoading: boolean;
  createTranslation: (data: any) => Promise<any>;
  updateTranslation: (translationId: number, data: any) => Promise<any>;
  deleteTranslation: (id: number) => Promise<any>;
  autoTranslate: (data: any) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isTranslating: boolean;
}

export type EntityType = "article" | "tag" | "topic" | "staff" | "service";
