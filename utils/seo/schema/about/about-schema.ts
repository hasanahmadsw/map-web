import {
  AboutPage,
  BreadcrumbList,
  FAQPage,
  Question,
  WebSite,
  Organization,
  SiteNavigationElement,
} from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '../common/common';
import seoConfig from '@/utils/seo/meta/seo.config';
import { withBaseSchema } from '../common/common';
import { faqs } from '@/components/website/home/data';

export async function generateAboutPageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | AboutPage | FAQPage | BreadcrumbList)[];
}> {
  const { siteURL, organizationId, siteName } = seoConfig;
  const currentURL = `${siteURL}/about`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * AboutPage
   * ---------------------------------- */
  const aboutPage = withBaseSchema<AboutPage>(
    {
      '@type': 'AboutPage',
      '@id': `${currentURL}#aboutpage`,
      url: currentURL,
      name: `About Us | ${siteName}`,
      description:
        'Learn more about MAP Production, the leading media solutions provider in Dubai Studio City.',
      mainEntity: { '@id': organizationId },
    },
    currentURL,
  );

  /* ----------------------------------
   * FAQPage
   * ---------------------------------- */
  const faqEntity: FAQPage = {
    '@type': 'FAQPage',
    '@id': `${currentURL}#faq`,
    mainEntity: faqs.map(
      (item): Question => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      }),
    ),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'About', url: '/about' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, aboutPage, faqEntity, breadcrumbSchema],
  };
}
