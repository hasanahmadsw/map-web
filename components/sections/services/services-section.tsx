import { servicesService } from '@/services/services.service';

import { ServiceCard } from '@/components/website/home/service-card';

import EmptyState from '@/components/shared/data-states/empty-state';
import { Package } from 'lucide-react';
import CustomPagination from '@/components/shared/pagination/custom-pagination';

interface ServicesSectionProps {
  page: number;
  limit: number;
  search: string;
  isFeatured?: boolean;
}

export async function ServicesSection({ page, limit, search, isFeatured }: ServicesSectionProps) {
  let res;
  try {
    res = await servicesService.getAll({
      search,
      page,
      limit,
      isPublished: true,
      isFeatured,
    });
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load services</p>
      </div>
    );
  }

  const services = res.data || [];
  const pagination = res.pagination;

  if (!services.length && search) {
    return <EmptyState type="no-filter-results" />;
  } else if (!services.length) {
    return <EmptyState type="no-data" icon={<Package />} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <ServiceCard key={service.id} service={service} lang="en" priority={idx < 3} />
        ))}
      </div>

      {/* Pagination */}
      <CustomPagination
        currentPage={pagination!.currentPage}
        totalCount={pagination!.total}
        pageSize={pagination!.limit}
        className="mt-8"
      />
    </>
  );
}
