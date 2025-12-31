'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Solution {
  id: number;
  name: string;
  slug: string;
}

interface SolutionFiltersProps {
  solutions: Solution[];
}

export function SolutionFilters({ solutions }: SolutionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSolutionId = searchParams.get('solutionId');

  const handleSolutionClick = (solutionId: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedSolutionId === String(solutionId)) {
      // If clicking the same solution, remove the filter
      params.delete('solutionId');
    } else {
      // Set the new solution filter
      params.set('solutionId', String(solutionId));
    }

    // Reset page when filtering
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!solutions.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {solutions.map(solution => {
        const isSelected = selectedSolutionId === String(solution.id);
        return (
          <Badge
            key={solution.id}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer rounded-full px-4 py-2 text-sm transition-colors',
              isSelected && 'bg-primary text-primary-foreground',
            )}
            onClick={() => handleSolutionClick(solution.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSolutionClick(solution.id);
              }
            }}
          >
            {solution.name}
          </Badge>
        );
      })}
    </div>
  );
}
