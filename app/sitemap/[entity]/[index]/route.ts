import { articlesService } from '@/services/articles.service';
import {
  generateBroadcastUrls,
  generateIntentUrls,
  generateSitemapXml,
} from '@/utils/seo/sitemap/sitemap-utils';
import { MetadataRoute } from 'next';
import { NextResponse } from 'next/server';

// TODO: add MAX_LOCS_PER_SITEMAP to the .env file with 1000 value
const maxLocsPerSitemap = Number.parseInt(process.env.MAX_LOCS_PER_SITEMAP || '100');

export async function GET(_request: Request, props: { params: Promise<{ entity: string; index: string }> }) {
  const { entity, index } = await props.params;

  let page = Number.parseInt(index);
  if (Number.isNaN(page)) {
    page = 1;
  }

  page = Math.max(1, page);

  // To generate the URLs for the entity
  const urls = await generateEntityUrls(entity, page);

  // To generate the sitemap XML structure
  const sitemap = generateSitemapXml(urls);

  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
}

async function generateEntityUrls(entity: string, page: number): Promise<MetadataRoute.Sitemap> {
  switch (entity) {
    case 'services': {
      return [
        {
          url: '/services',
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        },
      ];
    }
    case 'blog': {
      const { data: posts } = await articlesService.getAll({
        page,
        limit: maxLocsPerSitemap,
      });

      return posts.map(post => ({
        url: `/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }
    case 'broadcasts': {
      const { urls: broadcastUrls } = await generateBroadcastUrls(page);

      return broadcastUrls.map(url => ({
        url: url.startsWith('/') ? url : `/${url}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }
    case 'intents': {
      const { items } = await generateIntentUrls(page);

      return items.map(item => ({
        url: item.url,
        lastModified: new Date(item.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }

    default:
      return [
        {
          url: ``,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1,
        },
        {
          url: `/about`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        },
        {
          url: `/contact`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        },
        {
          url: `/broadcasts`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
        {
          url: `/broadcasting`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        },
        {
          url: `/broadcasting/outside-broadcast`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/broadcasting/portable-broadcast-systems`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/services`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
        {
          url: `/commercial-video-production`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/corporate-video-production`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/event-video-production`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/live-event-production`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/studio-video-production`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        {
          url: `/blog`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
      ];
  }
}
