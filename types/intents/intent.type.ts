export type IntentType =
  | 'HUB'
  | 'CLUSTER'
  | 'CATEGORY'
  | 'BRAND'
  | 'MODEL'
  | 'OFFER'
  | 'LOCATION';

export interface EquipmentFilters {
  categoryId?: number;
  brandId?: number;
  equipmentType?: string;
  category?: string;
  brand?: string;
  isFeatured?: boolean;
  [key: string]: unknown;
}

export interface IntentBreadcrumbItem {
  slug: string;
  label: string;
  url: string;
}

export interface IntentLinkItem {
  slug: string;
  linkLabel: string;
  url: string;
}

export interface IIntentBase {
  id: number;
  slug: string;
  type: IntentType;
  parentId: number | null;
  h1: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  subHeading: string | null;
  content: string | null;
  linkLabel: string | null;
  equipmentFilters: EquipmentFilters | null;
  createdAt: string;
  updatedAt: string;
}

export interface IIntent extends IIntentBase {
  breadcrumbs: IntentBreadcrumbItem[];
  internalLinks: IntentLinkItem[];
  smartBadges: IntentLinkItem[];
}
