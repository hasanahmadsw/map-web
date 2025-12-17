import { solutionsService } from '@/services/solutions.service';
import { SolutionCard } from './solution-card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function SolutionsSection() {
  let solutionsResponse;

  try {
    solutionsResponse = await solutionsService.getAll({
      limit: 6,
      isPublished: true,
      isFeatured: true,
    });
  } catch {
    solutionsResponse = { data: [] };
  }

  const solutions = solutionsResponse?.data || [];

  if (solutions.length === 0) {
    return null;
  }

  return (
    <section className="relative container w-full max-w-7xl space-y-4 overflow-hidden px-6 py-16 md:px-0">
      <h2 className="max-w-2xl text-3xl font-medium">Solutions</h2>
      <p className="text-muted-foreground max-w-2xl pb-6">
        We offer a wide range of solutions to meet your media production and broadcasting needs.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <SolutionCard key={solution.id} solution={solution} lang="en" priority={index < 3} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
          href="/solutions"
        >
          View All Solutions
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
