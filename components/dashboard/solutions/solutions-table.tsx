'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useSolutionMutations } from '@/hooks/solutions/mutations';
import { useSolutionsController } from '@/hooks/solutions/useSolutionsController';
import { useLang } from '@/hooks/useLang';
import { useSolutionColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { StaffSolution } from '@/types/solutions.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function SolutionsTable() {
  const lang = useLang();
  const router = useRouter();

  const [solutionToDelete, setSolutionToDelete] = useState<StaffSolution | null>(null);

  const {
    items: solutionsList,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    urlState,
    hasActiveFilters,

    setSearch,
    setPage,
    setPageSize,
    setFilter,
    clearAll,
  } = useSolutionsController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const featuredFilter = urlState.isFeatured ?? undefined;

  const { del: deleteSolution } = useSolutionMutations();

  const handleDeleteSolution = async () => {
    if (!solutionToDelete) return;

    try {
      await deleteSolution.mutateAsync(solutionToDelete.id);

      toast.success('Solution deleted successfully');

      setSolutionToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Solution';

      toast.error(errMsg);
      console.error('Error deleting solution:', error);
    }
  };

  const columns = useSolutionColumns({
    lang,
    onDelete: setSolutionToDelete,
  });

  const handleAddSolution = () => {
    router.push(`/${lang}/dashboard/solutions/add`);
  };

  // Prepare filter information for the header
  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined) {
      filters.push({
        key: 'isPublished',
        label: 'Status',
        value: publishedFilter ? 'Published' : 'Draft',
      });
    }

    if (featuredFilter !== undefined) {
      filters.push({
        key: 'isFeatured',
        label: 'Featured',
        value: featuredFilter ? 'Yes' : 'No',
      });
    }

    return filters;
  }, [publishedFilter, featuredFilter]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Solutions Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddSolution}
          addButtonText={`Add Solution`}
          entityName="Solution"
          entityNamePlural="Solutions"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="solutions-table"
            columns={columns}
            data={solutionsList}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage="No data found"
            pageIndex={currentPage}
            pageSize={pageSize}
            totalRows={total}
            totalPages={totalPages}
            canNextPage={currentPage < totalPages}
            canPrevPage={currentPage > 1}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            enableClientSorting={true}
            enableGlobalFilter={true}
            onGlobalFilterChange={setSearch}
            initialGlobalFilter={searchTerm}
            manualFiltering={true}
            messages={{
              searchPlaceholder: 'Search...',
              noData: 'No data found',
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <SelectFilter
                  value={publishedFilter === undefined ? 'all' : publishedFilter ? 'published' : 'draft'}
                  onValueChange={val =>
                    setFilter('isPublished', val === 'all' ? undefined : val === 'published' ? true : false)
                  }
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'published', label: 'Published' },
                    { value: 'draft', label: 'Draft' },
                  ]}
                  allOptionLabel="All Status"
                  className="w-32"
                />

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
                    Clear All
                  </Button>
                )}
              </div>
            }
            lang={lang}
          />
        </CardContent>
      </Card>

      {/* ========================== Delete Modal ========================== */}
      {solutionToDelete && (
        <ConfirmationDialogDynamic
          open={!!solutionToDelete}
          onOpenChange={open => !open && setSolutionToDelete(null)}
          onConfirm={handleDeleteSolution}
          title="Confirm Delete"
          description="Are you sure you want to delete this Solution? This action cannot be undone and will permanently remove the Solution from the system."
          isLoading={deleteSolution.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
