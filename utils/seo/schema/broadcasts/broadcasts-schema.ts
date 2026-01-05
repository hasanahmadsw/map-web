import { BreadcrumbList, CollectionPage, ItemList, Service, WebSite, Organization } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

interface BroadcastTypeItem {
  type: string;
  slug: string;
  label: string;
  description: string;
  features?: string[];
}

export async function broadcastsSchema(broadcastTypes: BroadcastTypeItem[]): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | CollectionPage | ItemList | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/broadcasts`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * Broadcasts Page
   * ---------------------------------- */
  const broadcastsPage: CollectionPage = withBaseSchema(
    {
      '@type': 'CollectionPage',
      '@id': `${currentURL}#webpage`,
      url: currentURL,
      name: 'Broadcast Solutions | MAP Media Art Production',
      description:
        'Explore our comprehensive range of professional broadcast solutions including OBVAN units, Flight Cases, SNG systems, and Internet Broadcasting solutions designed for modern media production.',
      mainEntity: {
        '@id': `${currentURL}#itemlist`,
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * Broadcast Types ItemList
   * ---------------------------------- */
  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${currentURL}#itemlist`,
    name: 'Broadcast Solutions List',
    itemListElement: broadcastTypes.map((broadcastType, index) => {
      const serviceSchema: Service = {
        '@type': 'Service',
        name: broadcastType.label,
        url: `${siteURL}/broadcasts/${broadcastType.slug}`,
        description: broadcastType.description,
        serviceType: broadcastType.type,
        provider: { '@id': organizationId },

        ...(broadcastType.features
          ? {
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Broadcast Features',
                itemListElement: broadcastType.features.map((feature: string) => ({
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: feature,
                  },
                })),
              },
            }
          : {}),
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
    { name: 'Broadcasts', url: '/broadcasts' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, broadcastsPage, itemList, breadcrumbSchema],
  };
}
