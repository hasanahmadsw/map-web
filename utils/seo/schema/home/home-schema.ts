import seoConfig from '../../meta/seo.config';
import { generateBreadcrumbSchema, generateOrganizationSchema, withBaseSchema } from '../common/common';

import type { BreadcrumbList, Organization, WebPage, WebSite } from 'schema-dts';

export async function homeSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | WebPage | Organization | BreadcrumbList)[];
}> {
  const { siteURL, siteName, websiteId, organizationId } = seoConfig;

  const homepageId = `${siteURL}#homepage`;

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website: WebSite = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteURL,
    name: siteName,
    inLanguage: 'en',
    publisher: {
      '@id': organizationId,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteURL}/rental?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  };

  /* ----------------------------------
   * HomePage
   * ---------------------------------- */
  const homePage: WebPage = withBaseSchema(
    {
      '@type': 'WebPage',
      '@id': homepageId,
      url: siteURL,
      name: 'MAP Media Art Production',
      description:
        'MAP Media Art Production is a leading media production company in the UAE, delivering creative video and storytelling solutions across the Middle East.',

      about: {
        '@id': organizationId,
      },
      mainEntityOfPage: {
        '@id': websiteId,
      },
    },
    siteURL,
  );

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organizationSchema = await generateOrganizationSchema();

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: 'Home',
      url: siteURL,
    },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, homePage, organizationSchema, breadcrumbSchema],
  };
}
