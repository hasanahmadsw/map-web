import { FileText } from 'lucide-react';

import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { articlesService } from '@/services/articles.service';
import { BlogArticleCard } from './blog-article-card';

interface BlogSectionProps {
  page: number;
  limit: number;
  search: string;
  isFeatured?: boolean;
}

export async function BlogSection({ page, limit, search, isFeatured }: BlogSectionProps) {
  let res;
  try {
    res = await articlesService.getAll({
      search,
      page,
      limit,
      isFeatured,
    });
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load blog articles</p>
      </div>
    );
  }

  const articles = res.data || [];
  const pagination = res.pagination;

  if (!articles.length && search) {
    return <EmptyState type="no-filter-results" />;
  } else if (!articles.length) {
    return <EmptyState type="no-data" icon={<FileText />} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, idx) => (
          <BlogArticleCard key={article.id} article={article} lang="en" priority={idx < 3} />
        ))}
      </div>

      {!!pagination && (
        <CustomPagination
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.limit}
          className="mt-8"
        />
      )}
    </>
  );
}

export { BlogSectionSkeleton } from './blog-section-skeleton';
