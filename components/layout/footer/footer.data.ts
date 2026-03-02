import type { SocialLink } from '@/types/settings.types';

export interface FooterData {
  siteDescription: string;
  social: SocialLink[];
  contact: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
}

export const footerData: FooterData = {
  siteDescription:
    'MAP Media Production - Leading provider of professional video production, equipment rental, and broadcasting solutions in Dubai and the UAE since 2015.',
  social: [
    { url: 'https://www.facebook.com/maproduction.ae', label: 'Facebook', platform: 'facebook' },
    { url: 'https://www.instagram.com/maproductionae/', label: 'Instagram', platform: 'instagram' },
    { url: 'https://www.linkedin.com/company/maproductionae', label: 'LinkedIn', platform: 'linkedin' },
    { url: 'https://www.youtube.com/@map_production', label: 'YouTube', platform: 'youtube' },
  ],
  contact: {
    address: 'BS 18, Dubai Studio City, United Arab Emirates',
    phone: '+971 54 544 4499',
    email: 'info@maproduction.ae',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  },
};
