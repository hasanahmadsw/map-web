import { servicesService } from '@/services/services.service';
import { ServiceCard } from './service-card';

import { Settings } from 'lucide-react';
import SectionHeader from './about-us/home-headers';
import MotionWrapper from '@/components/shared/motion/motion-wrapper';
import CATSection from './about-us/cta-card';

export async function ServicesSection() {
  // Fetch services directly from API
  let servicesResponse;
  try {
    servicesResponse = await servicesService.getAll({
      limit: 6,
      isPublished: true,
      isFeatured: true,
    });
  } catch {
    servicesResponse = { data: [] };
  }

  const services = servicesResponse?.data || [];

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="relative container w-full max-w-7xl space-y-4 overflow-hidden px-6 py-16 md:px-0">
      <SectionHeader
        BadgeText="Services"
        title="Our Media"
        highlightedText="Services"
        description="We offer a wide range of services to meet your media production and broadcasting needs."
        Icon={Settings}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <MotionWrapper
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
      >
        <CATSection
          title="Ready to Get Started with Us?"
          description="Explore our comprehensive range of media production and broadcasting services tailored to your needs."
          buttonText="Explore Services"
          className="mx-auto max-w-4xl"
          href="/services"
        />
      </MotionWrapper>
    </section>
  );
}
