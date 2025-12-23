'use client';

import { ReactNode } from 'react';
import { CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';

export interface FilterInfo {
  key: string;
  label: string;
  value: string;
}

export interface TableHeaderProps {
  title: string;
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  searchTerm?: string;
  filters: FilterInfo[];
  onClearAllFilters: () => void;
  onAdd?: () => void;
  addButtonText: string;
  entityName: string; // e.g., "post", "project", "property"
  entityNamePlural?: string; // e.g., "posts", "projects", "properties"
}

export function TableHeader({
  title,
  total,
  currentPage,
  totalPages,
  isLoading,
  searchTerm,
  filters,
  onClearAllFilters,
  onAdd,
  addButtonText,
  entityName,
  entityNamePlural,
}: TableHeaderProps) {
  const hasActiveFilters = searchTerm || filters.length > 0;
  const displayEntityName = entityNamePlural || `${entityName}s`;

  const renderFilterStatus = () => {
    if (!hasActiveFilters) return null;

    const filterElements: ReactNode[] = [];

    // Add search term
    if (searchTerm) {
      filterElements.push(
        <span key="search">
          Searching for: <span className="font-medium">&quot;{searchTerm}&quot;</span>
        </span>,
      );
    }

    // Add filters
    filters.forEach((filter, index) => {
      if (filter.value) {
        const hasPreviousElements = searchTerm || index > 0;
        filterElements.push(
          <span key={filter.key}>
            {hasPreviousElements && ' • '}
            {filter.label}: <span className="font-medium">{filter.value}</span>
          </span>,
        );
      }
    });

    return (
      <p className="text-muted-foreground text-sm">
        {isLoading ? (
          <>
            <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
            {filterElements}
          </>
        ) : (
          <>
            {filterElements}
            {total > 0 && (
              <span className="ml-2">
                • {total} {total !== 1 ? 'results' : 'result'} found
                {totalPages > 1 && (
                  <span className="ml-1">
                    ({currentPage} of {totalPages})
                  </span>
                )}
              </span>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAllFilters}
          className="text-muted-foreground hover:text-foreground ml-2 h-auto p-0 text-xs"
        >
          Clear All
        </Button>
      </p>
    );
  };

  const renderCountDisplay = () => {
    if (hasActiveFilters || total === 0) return null;

    return (
      <p className="text-muted-foreground text-sm">
        {total} {displayEntityName} total
        {totalPages > 1 && (
          <span className="ml-1">
            ({currentPage} of {totalPages})
          </span>
        )}
      </p>
    );
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-1">
        <CardTitle>{title}</CardTitle>
        {renderCountDisplay()}
        {renderFilterStatus()}
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>
      )}
    </CardHeader>
  );
}
