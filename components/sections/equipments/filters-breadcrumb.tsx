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
  const { pathname } = extractPathname(filters, categories);

  // =============== Generate breadcrumb
  const base = pathname.split('/').slice(1);
  const crumbs =
    base.map((path, index) => ({
      label: capitalizeEachWord(path.replace(/-/g, ' ')) || 'Home',
      href: `${base.slice(0, index + 1).join('/')}`,
    })) || [];

  if (crumbs.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={index}>
              {!isFirst && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm">{capitalizeFirstLetter(crumb.label)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="text-sm" asChild>
                    <Link href={`/equipments/${crumb.href}`}>{capitalizeFirstLetter(crumb.label)}</Link>
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
