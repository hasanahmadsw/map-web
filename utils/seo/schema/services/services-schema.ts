import { BreadcrumbList, CollectionPage, ItemList, Service } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import { generateBreadcrumbSchema, withBaseSchema } from '../common/common';
import { ServiceResponse } from '@/types/services.types';

export async function servicesSchema(
  services: ServiceResponse[],
  currentPage: number,
): Promise<{
  '@context': 'https://schema.org';
  '@graph': (CollectionPage | ItemList | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/services${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  /* ----------------------------------
   * Services Page
   * ---------------------------------- */
  const servicesPage: CollectionPage = withBaseSchema(
    {
      '@type': 'CollectionPage',
      '@id': `${currentURL}#webpage`,
      url: currentURL,
      name: `Our Services - Page ${currentPage}`,
      description: 'Explore our full list of media production services...',
      mainEntity: {
        '@id': `${currentURL}#itemlist`,
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * Services ItemList
   * ---------------------------------- */
  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${currentURL}#itemlist`,
    name: 'Media Services List',
    itemListElement: services.map((service, index) => {
      const serviceSchema: Service = {
        '@type': 'Service',
        name: service.name,
        url: `${siteURL}/services/${service.slug}`,
        image: service.featuredImage,
        provider: { '@id': organizationId },
        ...(service.subServices &&
          service.subServices.length > 0 && {
            hasPart: service.subServices.map(subService => ({
              '@type': 'Service',
              name: subService.title,
              description: subService.description,
            })),
          }),
      };

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: serviceSchema,
      };
    }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Services', url: '/services' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [servicesPage, itemList, breadcrumbSchema],
  };
}
