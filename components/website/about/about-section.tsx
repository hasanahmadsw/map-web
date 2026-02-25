import { PageIntro } from '@/components/website/common/page-components';
import { aboutStory } from './data';

export default async function AboutSection() {
  return (
    <section className="container py-8 md:py-10">
      <div className="rounded-2xl border border-border/60 bg-muted/10 px-6 py-8 md:px-10 md:py-12">
        <PageIntro
          title={aboutStory.title}
          paragraphs={aboutStory.paragraphs}
        />
      </div>
    </section>
  );
}
