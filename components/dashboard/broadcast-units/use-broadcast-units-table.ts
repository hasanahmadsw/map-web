'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { toast } from 'sonner';

import { useBroadcastUnitMutations } from '@/hooks/api/broadcasts/broadcast-unit-mutations';
import { useBroadcastUnitsController } from '@/hooks/api/broadcasts/useBroadcastUnitsController';
import type { FilterInfo } from '@/components/shared/table/table-header';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

import { useBroadcastUnitColumns } from './columns';

export function useBroadcastUnitsTable() {
  const router = useRouter();
  const [broadcastUnitToDelete, setBroadcastUnitToDelete] = useState<BroadcastUnit | null>(null);

  const {
    items: broadcastUnitsList,
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
  } = useBroadcastUnitsController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const typeFilter = urlState.type ?? undefined;

  const { del: deleteBroadcastUnit } = useBroadcastUnitMutations();

  const columns = useBroadcastUnitColumns({
    onDelete: setBroadcastUnitToDelete,
  });

  function handleAddBroadcastUnit() {
    router.push(`/dashboard/broadcast-units/add`);
  }

  async function handleDeleteBroadcastUnit() {
    if (!broadcastUnitToDelete) return;

    try {
      await deleteBroadcastUnit.mutateAsync(broadcastUnitToDelete.id);
      toast.success('Broadcast unit deleted successfully');
      setBroadcastUnitToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Broadcast Unit';
      toast.error(errMsg);
      console.error('Error deleting broadcast unit:', error);
    }
  }

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined)
      filters.push({
        key: 'isPublished',
        label: 'Status',
        value: publishedFilter ? 'Published' : 'Draft',
      });

    if (typeFilter)
      filters.push({
        key: 'type',
        label: 'Type',
        value: titleize({ value: typeFilter }),
      });

    return filters;
  }, [publishedFilter, typeFilter]);

  const broadcastTypeOptions = useMemo(
    () =>
      Object.values(BroadcastType).map(type => ({
        value: type,
        label: titleize({ value: type }),
      })),
    [],
  );

  const publishedSelectValue = publishedFilter === undefined ? 'all' : publishedFilter ? 'true' : 'false';

  const typeSelectValue = typeFilter ?? 'all';

  function handlePublishedFilterChange(val: string | undefined) {
    setFilter('isPublished', val === undefined ? undefined : val === 'true');
  }

  function handleTypeFilterChange(val: string | undefined) {
    setFilter('type', val as BroadcastType);
  }

  return {
    broadcastUnitsList,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    publishedFilter,
    typeFilter,
    filterInfo,
    broadcastTypeOptions,

    publishedSelectValue,
    typeSelectValue,

    columns,
    broadcastUnitToDelete,
    deleteBroadcastUnit,
    setBroadcastUnitToDelete,

    setSearch,
    setPage,
    setPageSize,
    clearAll,

    handleAddBroadcastUnit,
    handleDeleteBroadcastUnit,
    handlePublishedFilterChange,
    handleTypeFilterChange,
  };
}

function titleize({ value }: { value: string }) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
