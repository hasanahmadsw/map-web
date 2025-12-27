import { articlesService } from '@/services/articles.service';
import { SimpleArticleCard } from './simple-article-card';

import Link from 'next/link';

import { ArrowRight, Newspaper } from 'lucide-react';
import SectionHeader from './about-us/home-headers';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import CATSection from './about-us/cta-card';

export async function ArticlesSection() {
  let articlesResponse;

  try {
    articlesResponse = await articlesService.getAll({
      limit: 6,
    });
  } catch {
    articlesResponse = { data: [] };
  }

  const articles = articlesResponse.data || [];

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="relative container w-full max-w-7xl space-y-4 overflow-hidden py-16">
      <SectionHeader
        BadgeText="Articles"
        title="Latest"
        highlightedText="Articles"
        description="Stay updated with our latest news and insights"
        Icon={Newspaper}
      />

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {articles.slice(0, 4).map((article, index) => (
          <SimpleArticleCard key={article.id} article={article} index={index} priority={index < 2} />
        ))}
      </div>
      <MotionWrapper
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
      >
        <CATSection
          title="Read Our Latest Articles"
          description="Read our latest articles that provide insights, tips, and valuable discussions to help you grow and succeed. Explore the latest conversations anytime."
          buttonText="Explore Blog"
          className="mx-auto max-w-4xl"
          href="/blog"
        />
      </MotionWrapper>
    </section>
  );
}
