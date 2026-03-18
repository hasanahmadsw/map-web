'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';

import { useArticleMutations } from '@/hooks/api/articles/mutations';
import { useArticlesController } from '@/hooks/api/articles/useArticlesController';
import type { FilterInfo } from '@/components/shared/table/table-header';
import type { Article } from '@/types/articles.types';

import { useArticleColumns } from './columns';

export function useArticlesTable() {
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

  const columns = useArticleColumns({
    onDelete: setArticleToDelete,
  });

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined)
      filters.push({
        key: 'isPublished',
        label: 'Status',
        value: publishedFilter ? 'Published' : 'Draft',
      });

    if (featuredFilter !== undefined)
      filters.push({
        key: 'isFeatured',
        label: 'Featured',
        value: featuredFilter ? 'Yes' : 'No',
      });

    return filters;
  }, [publishedFilter, featuredFilter]);

  async function handleDeleteArticle() {
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
  }

  function handleAddArticle() {
    router.push(`/dashboard/articles/add`);
  }

  const publishedSelectValue = publishedFilter === undefined ? 'all' : publishedFilter ? 'true' : 'false';

  const featuredSelectValue = featuredFilter === undefined ? 'all' : featuredFilter ? 'yes' : 'no';

  function handlePublishedFilterChange(val: string | undefined) {
    setFilter('isPublished', val === undefined ? undefined : val === 'true');
  }

  function handleFeaturedFilterChange(val: string | undefined) {
    setFilter('isFeatured', val === undefined ? undefined : val === 'yes');
  }

  return {
    articlesList,
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

    publishedFilter,
    featuredFilter,
    publishedSelectValue,
    featuredSelectValue,
    filterInfo,

    columns,
    articleToDelete,
    deleteArticle,

    setSearch,
    setPage,
    setPageSize,
    setFilter,
    clearAll,
    setArticleToDelete,

    handleAddArticle,
    handleDeleteArticle,
    handlePublishedFilterChange,
    handleFeaturedFilterChange,
  };
}
