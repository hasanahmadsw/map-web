import { BreadcrumbList, Organization, WebPage, WebSite } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common';

type SchemaGraph = WebSite | Organization | WebPage | BreadcrumbList;

export async function generatePrivacyPolicyPageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': SchemaGraph[];
}> {
  const { siteURL } = seoConfig;
  const currentURL = `${siteURL}/privacy`;

  /* ----------------------------------
   * WebSite & Organization
   * ---------------------------------- */
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = await generateOrganizationSchema();

  /* ----------------------------------
   * Privacy Policy WebPage
   * ---------------------------------- */
  const webPageSchema = withBaseSchema<WebPage>(
    {
      '@type': 'WebPage',
      '@id': `${currentURL}#privacyPolicyPage`,
      url: currentURL,
      name: 'Privacy Policy | MAP Media Art Production',
      description:
        'Our privacy practices regarding the collection, use, and protection of personal data at MAP Media Art Production.',
      publisher: { '@id': seoConfig.organizationId },
      dateModified: '2025-03-01',
      relatedLink: [`${siteURL}/cookie-policy`],
      mainEntity: {
        '@type': 'Article',
        headline: 'MAP Media Art Production Privacy Policy',
        description:
          'Information about data collection, security measures, and user rights at MAP Media Art Production.',
        author: { '@id': seoConfig.organizationId },
        about: {
          '@type': 'Thing',
          name: 'Data Privacy and Protection',
        },
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: currentURL },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, webPageSchema, organizationSchema, breadcrumbSchema],
  };
}
