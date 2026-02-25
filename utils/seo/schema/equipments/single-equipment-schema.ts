import { IEquipment } from '@/types/equipments/equipment.type';
import seoConfig from '../../meta/seo.config';
import { BreadcrumbList, ItemPage, Product, WebSite, Organization, SiteNavigationElement } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

export async function singleEquipmentSchema(equipment: IEquipment): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | ItemPage | Product | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/equipments/${equipment.slug}`;

  const mainProductId = `${currentURL}#product`;

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
      name: equipment.name,
      description: equipment.summary || equipment.description,
      mainEntity: { '@id': mainProductId },
    },
    currentURL,
  );

  /* ----------------------------------
   * Main Product
   * ---------------------------------- */
  const mainProduct: Product = {
    '@type': 'Product',
    '@id': mainProductId,
    name: equipment.name,
    description: equipment.description || equipment.summary,
    image:
      equipment.gallery && equipment.gallery.length > 0
        ? [equipment.coverPath, ...equipment.gallery.sort((a, b) => a.order - b.order).map(item => item.path)]
        : equipment.coverPath,
    brand: {
      '@type': 'Brand',
      name: equipment.brand.name,
    },
    category: equipment.category.name,
    sku: `EQ-${equipment.id}`,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: { '@id': organizationId },
    },
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Rent', url: '/equipment-rental' },
    { name: equipment.name, url: `/equipments/${equipment.slug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, itemPage, mainProduct, breadcrumbSchema],
  };
}
