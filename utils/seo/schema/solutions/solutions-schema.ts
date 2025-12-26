import { BreadcrumbList, CollectionPage, ItemList, Service } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import { generateBreadcrumbSchema, withBaseSchema } from '../common/common';
import { SolutionResponse } from '@/types/solutions.types';

export async function solutionsSchema(
  solutions: SolutionResponse[],
  currentPage: number,
): Promise<{
  '@context': 'https://schema.org';
  '@graph': (CollectionPage | ItemList | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/solutions${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  /* ----------------------------------
   * Solutions Page
   * ---------------------------------- */
  const solutionsPage: CollectionPage = withBaseSchema(
    {
      '@type': 'CollectionPage',
      '@id': `${currentURL}#webpage`,
      url: currentURL,
      name: `Our Solutions - Page ${currentPage}`,
      description: 'Explore our full list of media production solutions...',
      mainEntity: {
        '@id': `${currentURL}#itemlist`,
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * Solutions ItemList
   * ---------------------------------- */
  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${currentURL}#itemlist`,
    name: 'Media Solutions List',
    itemListElement: solutions.map((solution, index) => {
      const service: Service = {
        '@type': 'Service',
        name: solution.name,
        url: `${siteURL}/solutions/${solution.slug}`,
        image: solution.featuredImage,
        provider: { '@id': organizationId },
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

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: service,
      };
    }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Solutions', url: '/solutions' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [solutionsPage, itemList, breadcrumbSchema],
  };
}
