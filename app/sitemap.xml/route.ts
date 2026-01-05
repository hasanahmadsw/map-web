import { generateBroadcastUrls, generateEquipmentUrls } from '@/utils/seo/sitemap/sitemap-utils';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
const maxLocsPerSitemap = Number.parseInt(process.env.MAX_LOCS_PER_SITEMAP || '1000');

export async function GET() {
  const sitemapIndexXml = await generateSitemapIndex();

  return new NextResponse(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

async function generateSitemapIndex(): Promise<string> {
  const sitemaps = await generateSitemapEntities();

  const sitemapsXml = sitemaps
    .flatMap(sitemap =>
      Array.from(
        { length: sitemap.count },
        (_, id) => `
          <sitemap>
            <loc>${siteURL}/sitemap/${sitemap.entity}/${id + 1}.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
          </sitemap>
        `,
      ),
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapsXml}
  </sitemapindex>`;
}

async function generateSitemapEntities() {
  const { count: searchResultUrlsCount } = generateEquipmentUrls();
  const { count: broadcastUrlsCount } = await generateBroadcastUrls();

  // TODO: Get the count of the entities
  // const { data: stats } = await statisticService.getStatistics();

  return [
    {
      entity: 'rental',
      count: Math.ceil(searchResultUrlsCount / maxLocsPerSitemap),
    },
    {
      entity: 'broadcasts',
      count: Math.ceil(broadcastUrlsCount / maxLocsPerSitemap),
    },
    {
      entity: 'solutions',
      count: Math.ceil(1 / maxLocsPerSitemap),
    },
    {
      entity: 'services',
      count: Math.ceil(1 / maxLocsPerSitemap),
    },
    {
      entity: 'blog',
      count: Math.ceil(1 / maxLocsPerSitemap),
    },
    {
      entity: 'static',
      count: 1,
    },
  ];
}
