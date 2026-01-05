import {
  Blog,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  ItemList,
  WebSite,
  Organization,
  SiteNavigationElement,
} from 'schema-dts';
import seoConfig from '../../meta/seo.config';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';
import { Article as ArticleType } from '@/types/articles.types';

export async function articlesSchema(
  articles: ArticleType[],
  currentPage: number,
): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | CollectionPage | Blog | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`;

  /* ----------------------------------
   * Organization
   * ---------------------------------- */
  const organization = await generateOrganizationSchema();

  /* ----------------------------------
   * WebSite
   * ---------------------------------- */
  const website = generateWebsiteSchema();

  /* ----------------------------------
   * Articles Page
   * ---------------------------------- */
  const articlesPage: CollectionPage = withBaseSchema(
    {
      '@type': 'CollectionPage',
      '@id': `${currentURL}#webpage`,
      url: currentURL,
      name: `Our Articles - Page ${currentPage}`,
      description: 'Explore our latest articles and insights on media production...',
      mainEntity: {
        '@id': `${currentURL}#blog`,
      },
    },
    currentURL,
  );

  /* ----------------------------------
   * Articles ItemList
   * ---------------------------------- */
  const blog: Blog = {
    '@type': 'Blog',
    '@id': `${currentURL}#blog`,
    name: 'Media Articles List',
    blogPost: articles.map((article, index) => {
      const blogPosting: BlogPosting = {
        '@type': 'BlogPosting',
        name: article.name,
        headline: article.meta.title || article.name,
        description: article.meta.description || article.excerpt,
        url: `${siteURL}/blog/${article.slug}`,
        image: article.image || undefined,
        publisher: { '@id': organizationId },
        datePublished: article.createdAt,
        dateModified: article.updatedAt,
        position: index + 1,
        ...(article.author && {
          author: {
            '@type': 'Person',
            name: article.author.name,
          },
        }),
      };

      return blogPosting;
    }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Blog', url: '/blog' },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, articlesPage, blog, breadcrumbSchema],
  };
}
