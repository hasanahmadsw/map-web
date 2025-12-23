import { Suspense } from 'react';

import { BlogSection, BlogSectionSkeleton } from '@/components/website/blog/blog-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    isFeatured?: string;
  }>;
}

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Blog',
    description: 'Read our latest articles, insights, and updates.',
    type: 'website',
    pathname: '/blog',
  });
}

export default async function BlogPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const isFeatured = searchParams?.isFeatured === 'true' ? true : undefined;

  return (
    <div className="container mx-auto max-w-7xl space-y-4 py-10">
      <header>
        <h1 className="mb-3 max-w-2xl text-3xl font-medium">Blog</h1>
        <p className="text-muted-foreground max-w-2xl pb-6">
          Read our latest articles, insights, and updates.
        </p>
      </header>

      <Suspense
        key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
        fallback={<BlogSectionSkeleton />}
      >
        <BlogSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
      </Suspense>
    </div>
  );
}
