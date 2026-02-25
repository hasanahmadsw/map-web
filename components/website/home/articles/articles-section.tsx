import Link from 'next/link';
import { articlesService } from '@/services/articles.service';
import { SimpleArticleCard } from './simple-article-card';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl tracking-tight">Latest Articles</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          Expert insights, production tips, and industry updates from the MAP team.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 4).map((article, i) => (
          <SimpleArticleCard key={article.id} article={article} index={i} priority={i < 2} />
        ))}
      </div>
      <div className="pt-4">
        <Link
          href="/blog"
          className="text-primary hover:underline text-sm font-medium"
        >
          View all articles →
        </Link>
      </div>
    </div>
  );
}
