import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { Info, Users } from 'lucide-react';
import SectionHeader from './home-headers';
import BackgroundElements from './background-elements';
import StatsCard from './stats-card';
import ContentSection from './content-section';
import CATSection from './cta-card';

export default function AboutUs() {
  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden py-20">
      <BackgroundElements />

      <div className="relative z-10 container mx-auto px-4">
        <SectionHeader
          title="Our"
          highlightedText="Story"
          description="From cinematic productions in Dubai to nationwide broadcasts in Saudi Arabia, our journey has been defined by innovation, quality, and deep regional understanding."
          Icon={Info}
          BadgeText="About Us"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <StatsCard />

          <ContentSection />
        </div>
      </div>
    </section>
  );
}
