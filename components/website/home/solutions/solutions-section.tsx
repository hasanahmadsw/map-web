import { solutionsService } from '@/services/solutions.service';
import { SolutionCard } from './solution-card';
import { Lightbulb } from 'lucide-react';
import SectionHeader from '../../common/section-header';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import CATSection from '../../common/cta-card';

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
    <section className="section-padding container space-y-4">
      <SectionHeader
        BadgeText="Solutions"
        title="Our Media"
        highlightedText="Solutions"
        description="We offer a wide range of solutions to meet your media production and broadcasting needs."
        Icon={Lightbulb}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>

      <MotionWrapper
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <CATSection
          title="Ready to Get Started?"
          description="Explore our comprehensive range of media production and broadcasting solutions tailored to your needs."
          buttonText="Explore Solutions"
          className="mx-auto max-w-4xl"
          href="/solutions"
        />
      </MotionWrapper>
    </section>
  );
}
