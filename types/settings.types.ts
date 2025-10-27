export interface Settings {
  id: number;
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteDarkLogo: string;
  siteFavicon: string;
  meta: {
    title: string;
    keywords: string[];
    description: string;
  };
  social: SocialLink[];
  analytics: {
    customScripts: string[];
    facebookPixel: string;
    googleAnalytics: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  customScripts: {
    footer: string[];
    header: string[];
  };
  defaultLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  url: string;
  label: string;
  platform: string;
}

export interface SettingsTranslation {
  id: number;
  languageCode: string;
  siteName: string;
  siteDescription: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  siteLogo: string;
  siteDarkLogo: string;
  createdAt: string;
  updatedAt: string;
  language: {
    id: number;
    code: string;
    name: string;
    nativeName: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SettingsWithTranslations extends Settings {
  translations: SettingsTranslation[];
}

export interface UpdateSettingsTranslationDTO {
  siteName: string;
  siteDescription: string;
  meta: {
    title: string;
    description: string;
    keywords?: string[];
  };
}

export interface SettingsResponse {
  data: Settings;
  meta: {
    message: string;
    statusCode: number;
    timestamp: string;
    status: string;
    path: string;
    method: string;
    requestId: string;
  };
}

export interface SettingsTranslationsResponse {
  data: SettingsWithTranslations;
  meta: {
    message: string;
    statusCode: number;
    timestamp: string;
    status: string;
    path: string;
    method: string;
    requestId: string;
  };
}
