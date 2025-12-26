import { BreadcrumbList, ContactPage } from 'schema-dts';
import { generateBreadcrumbSchema } from '../common/common';
import seoConfig from '@/utils/seo/meta/seo.config';
import { withBaseSchema } from '../common/common';

export async function generateContactPageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (ContactPage | BreadcrumbList)[];
}> {
  const { siteURL, organizationId, siteName } = seoConfig;
  const currentURL = `${siteURL}/contact`;

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
    '@graph': [contactPage, breadcrumbSchema],
  };
}
