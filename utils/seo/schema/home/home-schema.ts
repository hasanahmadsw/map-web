import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateNavigationSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

import type { BreadcrumbList, Organization, SiteNavigationElement, WebPage, WebSite } from 'schema-dts';

export async function homeSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | WebPage | Organization | BreadcrumbList | SiteNavigationElement)[];
}> {
  const { siteURL, websiteId, organizationId } = seoConfig;

  const homepageId = `${siteURL}#homepage`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

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
   * Navigation
   * ---------------------------------- */
  const navigation = generateNavigationSchema([
    { name: 'Broadcasts', url: `/broadcasts` },
    { name: 'Services', url: `/services` },
    { name: 'Solutions', url: `/solutions` },
    { name: 'About Us', url: `/about` },
  ]);

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: 'Home',
      url: '',
    },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, homePage, organization, ...navigation, breadcrumbSchema],
  };
}
