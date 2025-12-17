'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationContent,
  PaginationEllipsis,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { DOTS, usePagination } from './usePagination';

import { cn } from '@/lib/utils';

/** ----------------------------------------------
 * @description Custom Pagination
 * @param {number} totalCount Represent the total count of data available from the source.
 * @param {number} siblingCount (optional) Represents the min number of page buttons to be shown on each side of the current page button. Defaults to 1.
 * @param {number} currentPage Represents the current active page.
 *                              We'll use a 1-based index instead of a traditional
 *                              0-based index for our currentPage value.
 * @param {number} pageSize (optional) Represents the maximum data are visible in a single page.
 * @returns {JSX}
 -------------------------------------------------*/

interface CustomPaginationProps {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize?: number;
  className?: string;
}

const CustomPagination = ({
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize = 10,
  className = '',
}: CustomPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  const lastPage = paginationRange?.[paginationRange?.length - 1];

  if (currentPage === 0 || paginationRange?.length < 2 || !paginationRange) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrevious}
            className={cn(currentPage === 1 && 'pointer-events-none opacity-50', 'cursor-pointer')}
            title="Previous"
          />
        </PaginationItem>

        {paginationRange.map((pageNumber: number | string, i: number) => {
          if (pageNumber === DOTS) {
            return (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber as number)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={onNext}
            className={cn(currentPage === lastPage && 'pointer-events-none opacity-50', 'cursor-pointer')}
            title="Next"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
