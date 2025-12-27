import { buildOpenGraph } from './buildOpenGraph';
import { buildTwitter } from './buildTwitter';
import seoConfig from './seo.config';

import type { Metadata } from 'next';

/**
 * Input for enhanced SEO metadata generation.
 */
export interface EnhancedSeoInput {
  title: string | { absolute: string };
  description: string;
  type?: 'website' | 'article';
  image?: string;
  keywords?: string[];
  authors?: { name: string; url?: string }[];
  pathname?: string;
  mainOverrides?: Partial<Metadata>;
  openGraphOverrides?: Partial<Metadata['openGraph']>;
  twitterOverrides?: Partial<Metadata['twitter']>;
}

/**
 * Generates enhanced SEO metadata for Next.js pages.
 * @param input EnhancedSeoInput
 * @returns Metadata object for Next.js
 */
export async function createEnhancedMetadata(input: EnhancedSeoInput): Promise<Metadata> {
  const {
    title,
    description,
    type = 'website',
    keywords = [],
    authors,
    pathname = '',
    image,
    mainOverrides,
    openGraphOverrides,
    twitterOverrides,
  } = input;

  return {
    title,
    description,
    keywords,
    openGraph: buildOpenGraph({
      title,
      description,
      type,
      image,
      authors,
      pathname,
      openGraphOverrides,
    }),
    twitter: buildTwitter({
      title,
      description,
      image,
      twitterOverrides,
    }),

    alternates: {
      canonical: pathname,
    },
    ...(authors && { authors }),

    ...(seoConfig.siteURL && {
      metadataBase: new URL(seoConfig.siteURL),
    }),
    ...mainOverrides,
  };
}
