import { BreadcrumbList, Organization, WebPage, WebSite } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common';

type SchemaGraph = WebSite | Organization | WebPage | BreadcrumbList;

export async function generateTermsOfServicePageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': SchemaGraph[];
}> {
  const { siteURL } = seoConfig;
  const currentURL = `${siteURL}/terms`;

  /* ----------------------------------
   * WebSite & Organization
   * ---------------------------------- */
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = await generateOrganizationSchema();

  /* ----------------------------------
   * Terms of Service WebPage
   * ---------------------------------- */
  const webPageSchema = withBaseSchema<WebPage>(
    {
      '@type': 'WebPage',
      '@id': `${currentURL}#termsOfServicePage`,
      url: currentURL,
      name: 'Terms of Service | MAP Media Art Production',
      description:
        'The legal terms and conditions governing the use of MAP Media Art Production website, and services in the UAE. MAP Media Art Production is a leading media company with 25+ years of experience in Dubai Studio City, serving the GCC with innovative broadcasting and video production.',
      publisher: { '@id': seoConfig.organizationId },
      dateModified: '2025-03-01',
      genre: 'http://vocab.getty.edu/aat/300027616',
      mainEntity: {
        '@type': 'Article',
        headline: 'MAP Media Art Production Terms of Service',
        description:
          'Agreement covering acceptance of terms, intellectual property, and governing law in Dubai, UAE.',
        author: { '@id': seoConfig.organizationId },
        about: [
          { '@type': 'Thing', name: 'Terms and Conditions' },
          { '@type': 'Thing', name: 'Governing Law of the United Arab Emirates' },
        ],
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: currentURL },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, webPageSchema, organizationSchema, breadcrumbSchema],
  };
}
