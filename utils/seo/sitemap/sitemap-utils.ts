import { EquipmentType } from '@/types/equipments/equipment.enum';
import { MetadataRoute } from 'next';

const EQUIPMENT_BRAND_TYPES = [
  'arri',
  'sony',
  'canon',
  'zeiss',
  'cooke-optics',
  'angenieux',
  'leica',
  'fujinon',
] as const;

const EQUIPMENT_CATEGORY_TYPES = [
  'cinema-cameras',
  'broadcast-cameras',
  'prime-lenses',
  'zoom-lenses',
  'led-lights',
  'microphones',
  'tripods-heads',
  'wireless-audio',
  'audio-recorders',
  'power',
] as const;

const EQUIPMENT_TYPES = Object.values(EquipmentType);

const maxLocsPerSitemap = Number.parseInt(process.env.MAX_LOCS_PER_SITEMAP || '1000');

export function generateEquipmentUrls(page: number = 1) {
  const urls: string[] = [];

  // Type - only
  for (const type of EQUIPMENT_TYPES) {
    urls.push(`/${type}`);
  }

  // Category - only
  for (const category of EQUIPMENT_CATEGORY_TYPES) {
    urls.push(`/${category}`);
  }

  // Brand - only
  for (const brand of EQUIPMENT_BRAND_TYPES) {
    urls.push(`/${brand}`);
  }

  // Type + category
  for (const type of EQUIPMENT_TYPES) {
    for (const category of EQUIPMENT_CATEGORY_TYPES) {
      urls.push(`/${type}/${category}`);
    }
  }

  // Type + brand
  for (const type of EQUIPMENT_TYPES) {
    for (const brand of EQUIPMENT_BRAND_TYPES) {
      urls.push(`/${type}/${brand}`);
    }
  }

  // Category + brand
  for (const category of EQUIPMENT_CATEGORY_TYPES) {
    for (const brand of EQUIPMENT_BRAND_TYPES) {
      urls.push(`/${category}/${brand}`);
    }
  }

  // Type + Category + brand
  for (const type of EQUIPMENT_TYPES) {
    for (const category of EQUIPMENT_CATEGORY_TYPES) {
      for (const brand of EQUIPMENT_BRAND_TYPES) {
        urls.push(`/${type}/${category}/${brand}`);
      }
    }
  }

  const start = (page - 1) * maxLocsPerSitemap;
  const end = start + maxLocsPerSitemap;

  const currentUrls = urls.slice(start, end);

  return { urls: currentUrls, count: urls.length };
}

const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
export function generateSitemapXml(urls: MetadataRoute.Sitemap): string {
  const urlsXml = urls
    .map(
      url => `
       <url>
         <loc>${siteURL}${url.url}</loc>
         <lastmod>${
           typeof url.lastModified === 'string'
             ? url.lastModified
             : (url.lastModified ?? new Date())?.toISOString()
         }</lastmod>
         <changefreq>${url.changeFrequency}</changefreq>
         <priority>${url.priority}</priority>
       </url>
     `,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              ${urlsXml}
            </urlset>`;
}
