import { SolutionResponse } from '@/types/solutions.types';
import seoConfig from '../../meta/seo.config';
import { BreadcrumbList, ItemPage, Service } from 'schema-dts';
import { generateBreadcrumbSchema, withBaseSchema } from '../common/common';

export async function singleSolutionSchema(solution: SolutionResponse): Promise<{
  '@context': 'https://schema.org';
  '@graph': (ItemPage | Service | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/solutions/${solution.slug}`;

  const mainServiceId = `${currentURL}#service`;

  /* ----------------------------------
   * ItemPage
   * ---------------------------------- */
  const itemPage: ItemPage = withBaseSchema(
    {
      '@type': 'ItemPage',
      '@id': `${currentURL}#itempage`,
      url: currentURL,
      name: solution.meta.title || solution.name,
      description: solution.meta.description || solution.shortDescription,
      mainEntity: { '@id': mainServiceId },
    },
    currentURL,
  );

  /* ----------------------------------
   * Main Service
   * ---------------------------------- */
  const mainService: Service = {
    '@type': 'Service',
    '@id': mainServiceId,
    name: solution.name,
    description: solution.description,
    image: solution.featuredImage,
    provider: { '@id': organizationId },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },

    ...(solution.services &&
      solution.services.length > 0 && {
        hasPart: solution.services.map(subService => ({
          '@type': 'Service',
          name: subService.name,
          description: subService.shortDescription || subService.description,
          url: `${siteURL}/services/${subService.slug}`,
          image: subService.featuredImage,
          provider: { '@id': organizationId },
        })),
      }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Solutions', url: '/solutions' },
    { name: solution.name, url: `/solutions/${solution.slug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [itemPage, mainService, breadcrumbSchema],
  };
}
