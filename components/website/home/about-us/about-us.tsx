import { Info } from 'lucide-react';
import SectionHeader from './home-headers';
import StatsCard from './stats-card';
import ContentSection from './content-section';

export default function AboutUs() {
  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden py-20">
      <div className="relative z-10 container mx-auto max-w-7xl space-y-12 px-4">
        <SectionHeader
          title="Our"
          highlightedText="Story"
          description="From cinematic productions in Dubai to nationwide broadcasts in Saudi Arabia, our journey has been defined by innovation, quality, and deep regional understanding."
          Icon={Info}
          BadgeText="About Us"
        />

        <StatsCard />

        <ContentSection />
      </div>
    </section>
  );
}
