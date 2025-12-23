import type { Metadata } from 'next';

import type { EnhancedSeoInput } from './enhanced-meta';
import seoConfig from './seo.config';

/**
 * Helper to build OpenGraph metadata.
 */
export function buildOpenGraph({
  lang,
  title,
  description,
  type = 'website',
  image,
  pathname,
  authors,
  openGraphOverrides = {},
}: EnhancedSeoInput & {
  openGraphOverrides?: Partial<Metadata['openGraph']>;
}): Metadata['openGraph'] {
  const { siteName, ogImage } = seoConfig;

  const img = image || ogImage;

  const og: Metadata['openGraph'] = {
    title: typeof title === 'string' ? title : title.absolute,
    description,
    images: [
      {
        url: img,
        width: 1200,
        height: 630,
        alt: typeof title === 'string' ? title : title.absolute,
      },
    ],
    siteName,
    url: `/${lang}${pathname}`,
    locale: lang,
    type,
    ...(type === 'article' && {
      // If only one author is provided, use 'author' field
      ...(authors?.length === 1 && { author: authors[0].name }),

      // If authors are provided, map them to the required format
      ...(authors && {
        authors: authors.map(author => (author.url ? `/${lang}${author.url}` : author.name)),
      }),
    }),
    ...openGraphOverrides,
  };
  return og;
}
