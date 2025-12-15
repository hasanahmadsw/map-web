"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/translations-provider";

interface TableFooterProps {
  selectedCount: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onFirstPage?: () => void;
  onLastPage?: () => void;
}

export default function TableNavigationFooter({
  selectedCount,
  totalCount,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  onFirstPage,
  onLastPage,
}: TableFooterProps) {
  // Generate page numbers to display (max 4 pages)
  const getVisiblePages = () => {
    if (totalPages <= 4) {
      const lastPageNumber = totalPages < currentPage ? currentPage : totalPages;
      const pagesCount = Math.min(lastPageNumber, 4);
      return Array.from({ length: pagesCount }, (_, i) => lastPageNumber - pagesCount + i + 1);
    }

    const pages: number[] = [];

    if (currentPage <= 2) {
      // Show first 4 pages
      pages.push(1, 2, 3, 4);
    } else if (currentPage >= totalPages - 1) {
      // Show last 4 pages
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Show current page and surrounding pages
      pages.push(currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }

    return pages.filter((page) => page > 0 && page <= totalPages);
  };

  const visiblePages = getVisiblePages();
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalCount > 0 ? Math.min(currentPage * itemsPerPage, totalCount) : 0;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 md:flex-row items-center justify-between px-2 py-4 border-t">
      {/* Left side - Selection info */}
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount > 0
          ? `${t.common.selected} ${selectedCount} ${t.common.of} ${totalCount} ${t.common.entries}`
          : `${t.common.showing} ${startItem} ${t.common.to} ${endItem} ${t.common.of} ${totalCount} ${t.common.entries}`}
      </div>

      {/* Right side - Navigation */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Items per page info */}
        <div className="flex items-center space-x-2 w-fit mx-auto">
          <p className="text-sm font-medium text-foreground">
            {`${t.common.showing} ${startItem} ${t.common.to} ${endItem} ${t.common.of} ${totalCount} ${t.common.entries}`}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2 w-fit mx-auto">
          {/* First page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={onFirstPage || (() => onPageChange?.(1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t.common.goToFirstPage}</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          {/* Previous button */}
          <Button variant="outline" className="h-8 w-8 p-0" onClick={onPrevious} disabled={!canPrevious}>
            <span className="sr-only">{t.common.goToPreviousPage}</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          {/* Page numbers */}
          {onPageChange && totalPages > 0 && (
            <div className="flex items-center space-x-1">
              {visiblePages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}

          {/* Next button */}
          <Button variant="outline" className="h-8 w-8 p-0" onClick={onNext} disabled={!canNext}>
            <span className="sr-only">{t.common.goToNextPage}</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={onLastPage || (() => onPageChange?.(totalPages))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">{t.common.goToLastPage}</span>
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
