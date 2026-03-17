'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { DataTable } from '@/components/shared/table/data-table'
import { SelectFilter } from '@/components/shared/selects/select-filter'
import { TableHeader } from '@/components/shared/table/table-header'

import dynamic from 'next/dynamic'
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton'
import { useIntentsTable } from './use-intents-table'

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  { ssr: false, loading: () => <DialogSkeleton /> },
)

function IntentsTable() {
  const {
    intents,
    total,
    totalPages,
    error,
    isPending,
    refetch,
    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,
    filterInfo,
    intentTypeOptions,
    columns,
    activeDialog,
    deleteIntent,
    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,
    handleAddIntent,
    handleDeleteIntent,
    typeSelectValue,
    handleTypeFilterChange,
  } = useIntentsTable()

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
          onAdd={handleAddIntent}
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
                  value={typeSelectValue}
                  onValueChange={handleTypeFilterChange}
                  options={intentTypeOptions}
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
  )
}

export default IntentsTable
