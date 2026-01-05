import { Article as ArticleType } from '@/types/articles.types';
import seoConfig from '../../meta/seo.config';
import { Article, BreadcrumbList, ItemPage, WebSite, Organization, SiteNavigationElement } from 'schema-dts';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  withBaseSchema,
} from '../common/common';

export async function singleArticleSchema(article: ArticleType): Promise<{
  '@context': 'https://schema.org';
  '@graph': (WebSite | Organization | ItemPage | Article | BreadcrumbList)[];
}> {
  const { siteURL, organizationId } = seoConfig;
  const currentURL = `${siteURL}/blog/${article.slug}`;

  const mainArticleId = `${currentURL}#article`;

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
      name: article.meta.title || article.name,
      description: article.meta.description || article.excerpt,
      mainEntity: { '@id': mainArticleId },
    },
    currentURL,
  );

  /* ----------------------------------
   * Main Article
   * ---------------------------------- */
  const mainArticle: Article = {
    '@type': 'Article',
    '@id': mainArticleId,
    headline: article.meta.title || article.name,
    description: article.meta.description || article.excerpt,
    articleBody: article.content,
    image: article.image || undefined,
    publisher: { '@id': organizationId },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    ...(article.author && {
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    }),
    ...(article.tags &&
      article.tags.length > 0 && {
        keywords: article.tags.join(', '),
      }),
  };

  /* ----------------------------------
   * BreadcrumbList
   * ---------------------------------- */
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '' },
    { name: 'Blog', url: '/blog' },
    { name: article.name, url: `/blog/${article.slug}` },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, itemPage, mainArticle, breadcrumbSchema],
  };
}
