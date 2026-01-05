import { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import seoConfig from '../../meta/seo.config';
import { BreadcrumbList, ItemPage, Product, WebSite, Organization } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

export async function singleBroadcastSchema(unit: BroadcastUnit): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | ItemPage | Product | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const typeSlug = unit.type.toLowerCase().replace(/_/g, '-');
  const currentURL = `${siteURL}/broadcasts/${typeSlug}/${unit.slug}`;

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
      name: unit.title || unit.slug,
      description: unit.summary || unit.description || `${unit.title || unit.slug} - Professional broadcast unit`,
      mainEntity: { '@id': mainProductId },
    },
    currentURL,
  );

  /* ----------------------------------
   * Main Product
   * ---------------------------------- */
  const images = unit.coverImage
    ? [
        unit.coverImage,
        ...(unit.gallery && unit.gallery.length > 0
          ? unit.gallery.sort((a, b) => a.order - b.order).map(item => item.path)
          : []),
      ]
    : unit.gallery && unit.gallery.length > 0
      ? unit.gallery.sort((a, b) => a.order - b.order).map(item => item.path)
      : undefined;

  const mainProduct: Product = {
    '@type': 'Product',
    '@id': mainProductId,
    name: unit.title || unit.slug,
    description: unit.description || unit.summary || `${unit.title || unit.slug} - Professional broadcast unit`,
    ...(images && images.length > 0 && { image: images }),
    category: `Broadcast ${unit.type.replace(/_/g, ' ')}`,
    sku: `BC-${unit.id}`,
    offers: {
      '@type': 'Offer',
      availability: unit.isPublished ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@id': organizationId },
    },
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Broadcasts', url: '/broadcasts' },
    { name: unit.type.replace(/_/g, ' '), url: `/broadcasts/${typeSlug}` },
    { name: unit.title || unit.slug, url: `/broadcasts/${typeSlug}/${unit.slug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, itemPage, mainProduct, breadcrumbSchema],
  };
}

