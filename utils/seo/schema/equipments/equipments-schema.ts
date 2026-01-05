import { SearchResultsPage, ItemList, Product, BreadcrumbList, Organization, WebSite } from 'schema-dts';

import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';
import { IEquipment } from '@/types/equipments/equipment.type';

import { generateSearchResultsMetadata } from '../../meta/equipment-meta/build-equipment-meta';

export async function generateEquipmentSearchSchema(
  equipments: IEquipment[],
  filters: string[],
  categories: string[],
): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | SearchResultsPage | ItemList | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;

  // =============== Extract filters
  const { title, description, keywords, pathname, crumbs } = await generateSearchResultsMetadata(
    filters,
    categories,
  );

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * SearchResultsPage
   * ---------------------------------- */
  const searchPage = withBaseSchema<SearchResultsPage>(
    {
      '@type': 'SearchResultsPage',
      '@id': `${pathname}#searchPage`,
      url: pathname,
      name: title,
      description,
      keywords,
      mainEntity: { '@id': `${pathname}#equipmentList` },
    },
    pathname,
  );

  /* ----------------------------------
   * EquipmentList
   * ---------------------------------- */
  const equipmentList: ItemList = {
    '@type': 'ItemList',
    '@id': `${pathname}#equipmentList`,
    numberOfItems: equipments.length,
    itemListElement: equipments.map((eq, index) => {
      const item: Product = {
        '@type': 'Product',
        name: eq.name,
        image: eq.coverPath,
        description: eq.summary,

        url: `${siteURL}/equipments/${eq.slug}`,
        brand: {
          '@type': 'Brand',
          name: eq.brand.name,
        },
        category: eq.category.name,
        sku: `EQ-${eq.id}`,
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          seller: { '@id': organizationId },
        },
      };

      return {
        '@type': 'ListItem',
        position: index + 1,
        item,
      };
    }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    ...crumbs.map(crumb => ({
      name: crumb.name || 'Rental',
      url: `/rental${crumb.url}`,
    })),
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, searchPage, equipmentList, breadcrumbSchema],
  };
}
