import { BreadcrumbList, ContactPage, WebSite, Organization, SiteNavigationElement } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '../common/common';
import seoConfig from '@/utils/seo/meta/seo.config';
import { withBaseSchema } from '../common/common';

export async function generateContactPageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | ContactPage | BreadcrumbList)[];
}> {
  const { siteURL, organizationId, siteName } = seoConfig;
  const currentURL = `${siteURL}/contact`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * ContactPage
   * ---------------------------------- */
  const contactPage = withBaseSchema<ContactPage>(
    {
      '@type': 'ContactPage',
      '@id': `${currentURL}#contactpage`,
      url: currentURL,
      name: `Contact Us | ${siteName}`,
      description:
        'Get in touch with MAP Production. Contact us for media production solutions, studio rentals, and professional services in Dubai Studio City.',
      mainEntity: { '@id': organizationId },
    },
    currentURL,
  );

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Contact', url: '/contact' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, contactPage, breadcrumbSchema],
  };
}
