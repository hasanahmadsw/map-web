import FAQAbout from '@/components/website/about/faq-about';

import AboutSection from '@/components/website/about/about-section';

import CoreValuesSection from '@/components/website/about/core-values-section';
import MissionVisionSection from '@/components/website/about/mission-vision-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import HeroSection from '@/components/shared/hero-section';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import { generateAboutPageSchema } from '@/utils/seo/schema/about/about-schema';

export async function generateMetadata() {
  const metaData = createEnhancedMetadata({
    title: 'About MAP Media Art Production | Creative Media Experts',
    description:
      'Learn about MAP Media Art Production, our story, values, and 25+ years of experience shaping creative media in the UAE and Middle East.',
    pathname: '/about',
    mainOverrides: {
      category: 'Company Profile',
    },
  });

  return metaData;
}

export default async function About() {
  // Markup Schema
  const jsonLd = await generateAboutPageSchema();

  return (
    <>
      {/* JSON-LD */}
      <script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Hero section with main title and background image */}
      <HeroSection imageSrc="/hero.webp" overlayDirection="left-to-right">
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-primary mb-4 text-center text-5xl font-extrabold drop-shadow-lg md:text-6xl">
            About Us
          </h1>
          <p className="text-primary-foreground/80 mx-auto max-w-2xl text-center text-xl">
            Learn more about our company and our mission
          </p>
        </MotionWrapper>
      </HeroSection>

      {/* Main about content with text and image */}
      <AboutSection />

      {/* Mission and vision cards with animated effects */}
      <MissionVisionSection />

      {/* Core values grid with icons and descriptions */}
      <CoreValuesSection />

      {/* FAQ section with questions and answers */}
      <FAQAbout />
    </>
  );
}
