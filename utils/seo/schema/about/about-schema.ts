import { AboutPage, BreadcrumbList, FAQPage, Question } from 'schema-dts';
import { generateBreadcrumbSchema } from '../common/common';
import seoConfig from '@/utils/seo/meta/seo.config';
import { withBaseSchema } from '../common/common';
import { faqs } from '@/components/website/home/data';

export async function generateAboutPageSchema(): Promise<{
  '@context': 'https://schema.org';
  '@graph': (AboutPage | FAQPage | BreadcrumbList)[];
}> {
  const { siteURL, organizationId, siteName } = seoConfig;
  const currentURL = `${siteURL}/about`;

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
    '@graph': [aboutPage, faqEntity, breadcrumbSchema],
  };
}
