import { BreadcrumbList, Organization, SiteNavigationElement, WebPage, WebSite } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import { settingsService } from '@/services/settings.service';
import { DEFAULT_SETTINGS } from '@/constants/constant';
import { Settings } from '@/types/settings.types';
import { ApiResponse } from '@/types/common.types';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbList {
  const { siteURL } = seoConfig;
  const currentURL = `${siteURL}${items[items.length - 1].url}#breadcrumb`;

  return {
    '@type': 'BreadcrumbList',
    '@id': currentURL,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteURL}${item.url}`,
    })),
  };
}

export async function generateOrganizationSchema(): Promise<Organization> {
  const { siteName, siteURL, logo, organizationId } = seoConfig;

  const settings = await settingsService.getSettings().catch(err => {
    console.error(err);
    return { data: DEFAULT_SETTINGS } as unknown as ApiResponse<Settings>;
  });

  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: settings.data?.siteName || siteName,
    description: settings.data?.siteDescription || 'Media Production Solutions for UAE',
    foundingDate: '1997',
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    url: `${siteURL}`,
    email: settings.data?.contact?.email ?? '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.data?.contact?.address ?? '',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
      // "postalCode": ,
    },

    ...(settings.data?.contact && {
      contactPoint: [
        (settings.data?.contact?.phone && {
          '@type': 'ContactPoint',
          telephone: settings.data?.contact?.phone ?? '',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English'],
        }) as any,
        (settings.data?.contact?.email && {
          '@type': 'ContactPoint',
          email: settings.data?.contact?.email ?? '',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English'],
        }) as any,
      ].filter(Boolean),
    }),

    areaServed: [
      { '@type': 'Country', name: 'AE' },
      { '@type': 'Country', name: 'SA' },
    ],

    knowsAbout: [
      'Media Production',
      'Broadcast Journalism',
      'Video Production in Dubai',
      'Professional Cinematography',
    ],

    publishingPrinciples: [`${siteURL}/terms`, `${siteURL}/privacy`],

    ...(settings.data?.social && {
      sameAs: [...new Set(settings.data?.social?.map(social => social.url) ?? [])],
    }),
  };
}

export function generateWebsiteSchema(): WebSite {
  const { siteURL, siteName, websiteId, organizationId } = seoConfig;

  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteURL,
    name: siteName,
    publisher: { '@id': organizationId },
    inLanguage: 'en',
    // potentialAction: [
    //   {
    //     '@type': 'SearchAction',
    //     target: {
    //       '@type': 'EntryPoint',
    //       urlTemplate: `${siteURL}/equipment-rental?q={search_term_string}`,
    //     },
    //     'query-input': 'required name=search_term_string',
    //   } as any,
    // ],
  };
}

export function generateNavigationSchema(items: { name: string; url: string }[]): SiteNavigationElement[] {
  const { siteURL } = seoConfig;

  return items.map(item => ({
    '@type': 'SiteNavigationElement',
    '@id': `${siteURL}${item.url}`,
    name: item.name,
    url: `${siteURL}${item.url}`,
  }));
}

export function withBaseSchema<T extends WebPage>(pageSchema: T, currentURL?: string): T {
  const { websiteId, organizationId } = seoConfig;

  return {
    ...pageSchema,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
    inLanguage: 'en',
    ...(currentURL && { breadcrumb: { '@id': `${currentURL}#breadcrumb` } }),
  };
}
