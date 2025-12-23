import { articlesService } from '@/services/articles.service';
import { SimpleArticleCard } from './simple-article-card';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

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
      <h2 className="max-w-2xl text-3xl font-medium"> Latest Articles</h2>
      <p className="text-muted-foreground max-w-2xl pb-6">'Stay updated with our latest news and insights'</p>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {articles.slice(0, 4).map((article, index) => (
          <SimpleArticleCard key={article.id} article={article} index={index} priority={index < 2} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
          href="/news"
        >
          View All
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
