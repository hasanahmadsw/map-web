import { BreadcrumbList, CollectionPage, ItemList, Product, WebSite, Organization } from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';
import { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

function formatBroadcastType(type: BroadcastType | `${BroadcastType}`): string {
  return String(type)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export async function broadcastTypeSchema(
  units: BroadcastUnit[],
  type: BroadcastType | `${BroadcastType}`,
  currentPage: number = 1,
): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | CollectionPage | ItemList | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const typeSlug = String(type).toLowerCase().replace(/_/g, '-');
  const currentURL = `${siteURL}/broadcasts/${typeSlug}${currentPage > 1 ? `?page=${currentPage}` : ''}`;
  const typeName = formatBroadcastType(type);

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * Broadcast Type Page
   * ---------------------------------- */
  const typePage: CollectionPage = withBaseSchema(
    {
      '@type': 'CollectionPage',
      '@id': `${currentURL}#webpage`,
      url: currentURL,
      name: `${typeName} Broadcast Units - Page ${currentPage}`,
      description: `Explore our collection of professional ${typeName.toLowerCase()} broadcast units designed for modern media production.`,
      mainEntity: {
        '@id': `${currentURL}#itemlist`,
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * Broadcast Units ItemList
   * ---------------------------------- */
  const itemList: ItemList = {
    '@type': 'ItemList',
    '@id': `${currentURL}#itemlist`,
    name: `${typeName} Broadcast Units List`,
    itemListElement: units.map((unit, index) => {
      const product: Product = {
        '@type': 'Product',
        name: unit.title || unit.slug,
        url: `${siteURL}/broadcasts/${typeSlug}/${unit.slug}`,
        image: unit.coverImage,
        description: unit.summary || unit.description,
        category: `Broadcast ${typeName}`,
        sku: `BC-${unit.id}`,
        offers: {
          '@type': 'Offer',
          availability: unit.isPublished ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          seller: { '@id': organizationId },
        },
      };

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: product,
      };
    }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Broadcasts', url: '/broadcasts' },
    { name: typeName, url: `/broadcasts/${typeSlug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, typePage, itemList, breadcrumbSchema],
  };
}
