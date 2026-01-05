import { ServiceResponse } from '@/types/services.types';
import seoConfig from '../../meta/seo.config';
import { BreadcrumbList, ItemPage, Service, WebSite, Organization, SiteNavigationElement } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

export async function singleServiceSchema(service: ServiceResponse): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | ItemPage | Service | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/services/${service.slug}`;

  const mainServiceId = `${currentURL}#service`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * ItemPage
   * ---------------------------------- */
  const itemPage: ItemPage = withBaseSchema(
    {
      '@type': 'ItemPage',
      '@id': `${currentURL}#itempage`,
      url: currentURL,
      name: service.meta.title || service.name,
      description: service.meta.description || service.shortDescription,
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
    name: service.name,
    description: service.description,
    image: service.featuredImage,
    provider: { '@id': organizationId },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },

    ...(service.subServices &&
      service.subServices.length > 0 && {
        hasPart: service.subServices.map(subService => ({
          '@type': 'Service',
          name: subService.title,
          description: subService.description,
        })),
      }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, itemPage, mainService, breadcrumbSchema],
  };
}
