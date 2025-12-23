import type { Metadata } from 'next';
import seoConfig from './seo.config';

/**
 * Helper to build Twitter metadata.
 */
export function buildTwitter({
  title,
  description,
  image,
  twitterOverrides = {},
}: {
  title: string | { absolute: string };
  description: string;
  image?: string;
  twitterOverrides?: Partial<Metadata['twitter']>;
}): Metadata['twitter'] {
  const img = image || seoConfig.ogImage;

  return {
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
    card: 'summary_large_image',
    ...twitterOverrides,
  };
}
