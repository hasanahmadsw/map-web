import { solutionsService } from '@/services/solutions.service';

import { SolutionCard } from '@/components/website/home/solution-card';

import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { Lightbulb } from 'lucide-react';

interface SolutionsSectionProps {
  page: number;
  limit: number;
  search: string;
  isFeatured?: boolean;
}

export async function SolutionsSection({ page, limit, search, isFeatured }: SolutionsSectionProps) {
  let res;
  try {
    res = await solutionsService.getAll({
      search,
      page,
      limit,
      isPublished: true,
      isFeatured,
    });
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load solutions</p>
      </div>
    );
  }

  const solutions = res.data || [];
  const pagination = res.pagination!;

  if (!solutions.length && search) {
    return <EmptyState type="no-filter-results" />;
  } else if (!solutions.length) {
    return <EmptyState type="no-data" icon={<Lightbulb />} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, idx) => (
          <SolutionCard key={solution.id} solution={solution} lang="en" priority={idx < 3} />
        ))}
      </div>

      <CustomPagination
        currentPage={pagination.currentPage}
        totalCount={pagination.total}
        pageSize={pagination.limit}
        className="mt-8"
      />
    </>
  );
}

export { SolutionsSectionSkeleton } from './solutions-section-skeleton';
