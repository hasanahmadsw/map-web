'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useEquipmentBrandMutations } from '@/hooks/api/equipments/equipment-brands/mutations'
import { useEquipmentBrandsController } from '@/hooks/api/equipments/equipment-brands/use-equipment-brands-controller'
import type { FilterInfo } from '@/components/shared/table/table-header'
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type'

import { useEquipmentBrandColumns } from './columns'

type DialogType = 'add' | 'edit' | 'delete' | null

export function useEquipmentBrandsTable() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedBrand, setSelectedBrand] = useState<IEquipmentBrand | null>(null)

  const {
    items: brands,
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
  } = useEquipmentBrandsController()

  const isActiveFilter = urlState.isActive ?? undefined

  const { del: deleteBrand } = useEquipmentBrandMutations()

  function handleAddBrand() {
    setActiveDialog('add')
  }

  function handleEdit(brand: IEquipmentBrand) {
    setSelectedBrand(brand)
    setActiveDialog('edit')
  }

  function handleDelete(brand: IEquipmentBrand) {
    setSelectedBrand(brand)
    setActiveDialog('delete')
  }

  async function handleDeleteBrand() {
    if (!selectedBrand) return

    try {
      await deleteBrand.mutateAsync(selectedBrand.id)
      toast.success('Equipment brand deleted successfully')
      setSelectedBrand(null)
      setActiveDialog(null)
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete equipment brand'
      toast.error(errMsg)
      console.error('Error deleting equipment brand:', error)
    }
  }

  const columns = useEquipmentBrandColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = []

    if (isActiveFilter !== undefined)
      filters.push({
        key: 'isActive',
        label: 'Status',
        value: isActiveFilter ? 'Active' : 'Inactive',
      })

    return filters
  }, [isActiveFilter])

  const isActiveSelectValue =
    isActiveFilter === undefined ? 'all' : isActiveFilter ? 'true' : 'false'

  function handleIsActiveFilterChange(val: string | undefined) {
    setFilter('isActive', val === undefined ? undefined : val === 'true')
  }

  return {
    brands,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    isActiveFilter,
    filterInfo,
    columns,

    activeDialog,
    selectedBrand,
    deleteBrand,

    isActiveSelectValue,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,

    handleAddBrand,
    handleDeleteBrand,
    handleIsActiveFilterChange,
  }
}

