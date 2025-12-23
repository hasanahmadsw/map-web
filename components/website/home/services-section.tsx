import { servicesService } from '@/services/services.service';
import { ServiceCard } from './service-card';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      <h2 className="max-w-2xl text-3xl font-medium">Our Services</h2>
      <p className="text-muted-foreground max-w-2xl pb-6">
        We offer a wide range of services to help you with your media production and broadcasting needs.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} priority={index < 3} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
          href="/services"
        >
          View All Services
          <ArrowRight className="ml-2 inline h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
