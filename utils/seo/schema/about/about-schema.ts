import { AboutPage, BreadcrumbList, FAQPage, Question, WebSite, Organization } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common';
import seoConfig from '@/utils/seo/meta/seo.config';
import { faqItems } from '@/components/website/about/data';

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
        'MAP Media Art Production is a leading media company with 25+ years of experience in Dubai Studio City, serving the GCC with innovative broadcasting and video production.',
      mainEntity: { '@id': organizationId },
      keywords: 'Innovation, Excellence, Collaboration, Integrity, Customer Focus, Passion',
    },
    currentURL,
  );

  /* ----------------------------------
   * FAQPage
   * ---------------------------------- */
  const faqEntity: FAQPage = {
    '@type': 'FAQPage',
    '@id': `${currentURL}#faq`,
    mainEntity: faqItems.map(
      (item): Question => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
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
