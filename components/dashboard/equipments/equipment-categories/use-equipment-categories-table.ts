'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useEquipmentCategoryMutations } from '@/hooks/api/equipments/equipment-categories/mutations'
import { useEquipmentCategoriesController } from '@/hooks/api/equipments/equipment-categories/use-equipment-categories-controller'
import type { FilterInfo } from '@/components/shared/table/table-header'
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type'
import { EquipmentType } from '@/types/equipments/equipment.enum'

import { useEquipmentCategoryColumns } from './columns'

type DialogType = 'add' | 'edit' | 'delete' | null

export function useEquipmentCategoriesTable() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedCategory, setSelectedCategory] = useState<IEquipmentCategory | null>(null)

  const {
    items: categories,
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
  } = useEquipmentCategoriesController()

  const isActiveFilter = urlState.isActive ?? undefined
  const typeFilter = urlState.type ?? undefined

  const { del: deleteCategory } = useEquipmentCategoryMutations()

  function handleAddCategory() {
    setActiveDialog('add')
  }

  function handleEdit(category: IEquipmentCategory) {
    setSelectedCategory(category)
    setActiveDialog('edit')
  }

  function handleDelete(category: IEquipmentCategory) {
    setSelectedCategory(category)
    setActiveDialog('delete')
  }

  async function handleDeleteCategory() {
    if (!selectedCategory) return

    try {
      await deleteCategory.mutateAsync(selectedCategory.id)
      toast.success('Equipment category deleted successfully')
      setSelectedCategory(null)
      setActiveDialog(null)
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete equipment category'
      toast.error(errMsg)
      console.error('Error deleting equipment category:', error)
    }
  }

  const columns = useEquipmentCategoryColumns({
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

    if (typeFilter)
      filters.push({
        key: 'type',
        label: 'Type',
        value: capitalizeLabel({ value: typeFilter }),
      })

    return filters
  }, [isActiveFilter, typeFilter])

  const equipmentTypeOptions = useMemo(
    () =>
      Object.values(EquipmentType).map(type => ({
        value: type,
        label: capitalizeLabel({ value: type }),
      })),
    [],
  )

  function handleTypeFilterChange(val: string | undefined) {
    if (!val || val === 'all') return setFilter('type', undefined)
    setFilter('type', val as EquipmentType)
  }

  function handleIsActiveFilterChange(val: string | undefined) {
    if (!val || val === 'all') return setFilter('isActive', undefined)
    setFilter('isActive', val === 'true')
  }

  return {
    categories,
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
    typeFilter,
    filterInfo,
    equipmentTypeOptions,
    columns,

    activeDialog,
    selectedCategory,
    deleteCategory,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,

    handleAddCategory,
    handleDeleteCategory,
    handleTypeFilterChange,
    handleIsActiveFilterChange,
  }
}

function capitalizeLabel({ value }: { value: string }) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

