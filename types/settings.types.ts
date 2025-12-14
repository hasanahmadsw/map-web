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

