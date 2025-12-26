import { BreadcrumbList, Organization, WebPage } from 'schema-dts';
import seoConfig from '../../meta/seo.config';

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

  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: siteName,
    description: 'Media Production Solutions for UAE',
    foundingDate: '1997',
    logo: {
      '@type': 'ImageObject',
      url: `${siteURL}/${logo}`,
    },
    url: `${siteURL}`,
    email: 'info@maproduction.ae',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BS 18, Dubai Studio City',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
      // "postalCode": ,
    },

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+971545444499',
        contactType: 'customer service',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+97144107001',
        contactType: 'customer service',
        availableLanguage: ['English'],
      },
    ],

    // sameAs: [
    //   'https://www.instagram.com/maproduction.ae',
    //   'https://www.linkedin.com/company/maproduction'
    // ],
  };
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
