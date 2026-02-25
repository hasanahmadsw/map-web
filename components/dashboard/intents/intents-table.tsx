'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import { useIntentMutations } from '@/hooks/api/intents/mutations';
import { useIntentsController } from '@/hooks/api/intents/use-intents-controller';
import { useIntentColumns } from '@/components/dashboard/intents/columns';

import type { IIntentBase, IntentType } from '@/types/intents/intent.type';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';

const INTENT_TYPE_OPTIONS: { value: IntentType; label: string }[] = [
  { value: 'HUB', label: 'HUB' },
  { value: 'CLUSTER', label: 'CLUSTER' },
  { value: 'CATEGORY', label: 'CATEGORY' },
  { value: 'BRAND', label: 'BRAND' },
  { value: 'MODEL', label: 'MODEL' },
  { value: 'OFFER', label: 'OFFER' },
  { value: 'LOCATION', label: 'LOCATION' },
];

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  { ssr: false, loading: () => <DialogSkeleton /> },
);

type DialogType = 'delete' | null;

function IntentsTable() {
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedIntent, setSelectedIntent] = useState<IIntentBase | null>(null);

  const {
    items: intents,
    total,
    totalPages,
    error,
    isPending,
    refetch,
    currentPage,
    pageSize,
    searchTerm,
    urlState,
    setSearch,
    setPage,
    setPageSize,
    setFilter,
    clearAll,
    hasActiveFilters,
  } = useIntentsController();

  const typeFilter = urlState.type ?? undefined;

  const { del: deleteIntent } = useIntentMutations();

  const handleEdit = (intent: IIntentBase) => {
    router.push(`/dashboard/intents/${intent.id}`);
  };

  const handleDelete = (intent: IIntentBase) => {
    setSelectedIntent(intent);
    setActiveDialog('delete');
  };

  const handleDeleteIntent = async () => {
    if (!selectedIntent) return;
    try {
      await deleteIntent.mutateAsync(selectedIntent.id);
      toast.success('Intent deleted successfully');
      setSelectedIntent(null);
      setActiveDialog(null);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete intent');
    }
  };

  const columns = useIntentColumns({ onEdit: handleEdit, onDelete: handleDelete });

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];
    if (searchTerm) {
      filters.push({ key: 'search', label: 'Search', value: searchTerm });
    }
    if (typeFilter) {
      filters.push({ key: 'type', label: 'Type', value: typeFilter });
    }
    return filters;
  }, [searchTerm, typeFilter]);

  return (
    <>
      <Card>
        <TableHeader
          title="Intents"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={() => router.push('/dashboard/intents/add')}
          addButtonText="Add Intent"
          entityName="Intent"
          entityNamePlural="Intents"
        />

        <CardContent>
          <DataTable
            tableId="intents-table"
            columns={columns}
            data={intents}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage="No intents found"
            pageIndex={currentPage}
            pageSize={pageSize}
            totalRows={total}
            totalPages={totalPages}
            canNextPage={currentPage < totalPages}
            canPrevPage={currentPage > 1}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            enableClientSorting
            enableGlobalFilter
            onGlobalFilterChange={setSearch}
            initialGlobalFilter={searchTerm}
            manualFiltering
            messages={{ searchPlaceholder: 'Search...', noData: 'No intents found' }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <SelectFilter
                  value={typeFilter}
                  onValueChange={val => setFilter('type', val)}
                  options={INTENT_TYPE_OPTIONS}
                  allOptionLabel="All Types"
                  className="w-36"
                />
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
                    Clear All
                  </Button>
                )}
              </div>
            }
          />
        </CardContent>
      </Card>

      {activeDialog === 'delete' && (
        <ConfirmationDialogDynamic
          open
          onOpenChange={open => !open && setActiveDialog(null)}
          onConfirm={handleDeleteIntent}
          title="Confirm Delete"
          description="Are you sure you want to delete this intent? This action cannot be undone."
          loadingText="Deleting..."
          isLoading={deleteIntent.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

export default IntentsTable;
