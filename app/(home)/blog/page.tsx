import { Suspense } from 'react';

import { BlogSection, BlogSectionSkeleton } from '@/components/website/blog/blog-section';
import { PageHero, PageSection } from '@/components/website/common/page-components';
import CustomSearch from '@/components/shared/search/custom-search';
import { CTASection } from '@/components/website/common/cta-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Newspaper } from 'lucide-react';

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
    title: 'Media Production Insights & Creative Blog | MAP Media Art Production',
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
    <div className="bg-background min-h-screen">
      <PageHero
        title="Media Production Insights & Blog"
        description="Stay updated with our latest news and insights on video production, broadcasting, and creative strategies from MAP professionals."
        buttons={[
          { text: 'Contact Us', href: '/contact' },
          { text: 'View Services', href: '/services', variant: 'outline' },
        ]}
        minHeight="55vh"
      />


      <PageSection>
        <Suspense
          key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
          fallback={<BlogSectionSkeleton />}
        >
          <BlogSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
        </Suspense>
      </PageSection>

      <div className="section-padding container">
        <CTASection
          title="Want to Learn More?"
          description="Explore our services and solutions to discover how we can help transform your media production and broadcasting needs. Get in touch with our team for personalized guidance."
          buttons={[
            { text: 'Contact Us', href: '/contact' },
            { text: 'View Services', href: '/services' },
          ]}
          offices={[]}
        />
      </div>
    </div>
  );
}
