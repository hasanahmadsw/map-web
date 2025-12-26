import { Suspense } from 'react';

import { BlogSection, BlogSectionSkeleton } from '@/components/website/blog/blog-section';
import { BlogCTASection } from '@/components/website/blog/blog-cta-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Newspaper } from 'lucide-react';
import SectionHeader from '@/components/website/home/about-us/home-headers';
import CustomSearch from '@/components/shared/search/custom-search';

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
    title: 'Media Production Insights & Creative Blog | MAP',
    description:
      'Read expert insights, trends, and tips on media production, video marketing, storytelling, and creative strategies from MAP professionals.',

    pathname: '/blog',
    mainOverrides: {
      category: 'Media Production Insights',
    },
  });
}

export default async function BlogPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const isFeatured = searchParams?.isFeatured === 'true' ? true : undefined;

  return (
    <section className="pt-edge-nav-margin container mx-auto max-w-7xl space-y-4 py-10">
      <SectionHeader
        BadgeText="Articles"
        title="Our"
        highlightedText="Articles"
        description="Stay updated with our latest news and insights"
        Icon={Newspaper}
      />

      <div className="mb-16 flex w-full items-center justify-center gap-4">
        <CustomSearch
          query="search"
          placeholder="Search articles..."
          Icon={
            <Newspaper className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
          }
          className="w-full sm:w-2xl"
        />
      </div>

      <Suspense
        key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
        fallback={<BlogSectionSkeleton />}
      >
        <BlogSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
      </Suspense>

      <div className="mt-16 max-w-6xl">
        <BlogCTASection />
      </div>
    </section>
  );
}
