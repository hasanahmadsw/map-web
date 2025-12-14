export interface BaseTranslation {
  id: number;
  languageCode: string;
  name: string;
  createdAt?: string;
}

export interface TagTranslation extends BaseTranslation {
  description: string;
}

export interface TopicTranslation extends BaseTranslation {
  description: string;
}

export type Translation = TagTranslation | TopicTranslation;

export interface EditableTranslation {
  id: number;
  languageCode: string;
  name: string;
  description?: string;
  shortDescription?: string;
  bio?: string;
  content?: string;
  excerpt?: string;
  tags?: string;
  topics?: string;
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

export type EntityType = "tag" | "topic";
