import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { extractPathname } from '@/utils/filters/format-utils';
import { capitalizeEachWord, capitalizeFirstLetter } from '@/utils/format';

import Link from 'next/link';
import { Fragment } from 'react';

interface FiltersBreadcrumbProps {
  filters: string[];
  categories: string[];
}

async function FiltersBreadcrumb({ filters, categories }: FiltersBreadcrumbProps) {
  // =============== Extract filters
  const { crumbs } = extractPathname(filters, categories);
  const crumbsWithoutHome = crumbs.slice(1);

  if (crumbsWithoutHome.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink className="text-sm" asChild>
          <Link href="/rental">Rental</Link>
        </BreadcrumbLink>
        {crumbsWithoutHome.map((crumb, index) => {
          const isLast = index === crumbsWithoutHome.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm">{capitalizeFirstLetter(crumb.name)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="text-sm" asChild>
                    <Link href={`/rental${crumb.url}`}>{capitalizeFirstLetter(crumb.name)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default FiltersBreadcrumb;
