'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useArticleMutations } from '@/hooks/api/articles/mutations';
import { useArticlesController } from '@/hooks/api/articles/useArticlesController';

import { useArticleColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { Article } from '@/types/articles.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function ArticlesTable() {
  const router = useRouter();

  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const {
    items: articlesList,
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
  } = useArticlesController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const featuredFilter = urlState.isFeatured ?? undefined;

  const { del: deleteArticle } = useArticleMutations();

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle.mutateAsync(articleToDelete.id);

      toast.success('Article deleted successfully');

      setArticleToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Article';

      toast.error(errMsg);
      console.error('Error deleting article:', error);
    }
  };

  const columns = useArticleColumns({
    onDelete: setArticleToDelete,
  });

  const handleAddArticle = () => {
    router.push(`/dashboard/articles/add`);
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
          title="Articles Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddArticle}
          addButtonText={`Add Article`}
          entityName="Article"
          entityNamePlural="Articles"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="articles-table"
            columns={columns}
            data={articlesList}
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
                <SelectFilter
                  value={featuredFilter === undefined ? 'all' : featuredFilter ? 'yes' : 'no'}
                  onValueChange={val =>
                    setFilter('isFeatured', val === 'all' ? undefined : val === 'yes' ? true : false)
                  }
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  allOptionLabel="All Featured"
                  className="w-32"
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

      {/* ========================== Delete Modal ========================== */}
      {articleToDelete && (
        <ConfirmationDialogDynamic
          open={!!articleToDelete}
          onOpenChange={open => !open && setArticleToDelete(null)}
          onConfirm={handleDeleteArticle}
          title="Confirm Delete"
          description="Are you sure you want to delete this Article? This action cannot be undone and will permanently remove the Article from the system."
          loadingText="Deleting..."
          isLoading={deleteArticle.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
