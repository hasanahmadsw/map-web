'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useEquipmentMutations } from '@/hooks/api/equipments/mutations'
import { useEquipmentsController } from '@/hooks/api/equipments/use-equipments-controller'
import { useEquipmentCategoryById } from '@/hooks/api/equipments/equipment-categories/use-equipment-categories'
import { useEquipmentBrandById } from '@/hooks/api/equipments/equipment-brands/use-equipment-brands'
import type { FilterInfo } from '@/components/shared/table/table-header'
import type { IEquipment } from '@/types/equipments/equipment.type'
import { EquipmentType } from '@/types/equipments/equipment.enum'

import { useEquipmentColumns } from './columns'

export function useEquipmentsTable() {
  const router = useRouter()

  const [equipmentToDelete, setEquipmentToDelete] = useState<IEquipment | null>(null)
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | undefined>()
  const [selectedBrandLabel, setSelectedBrandLabel] = useState<string | undefined>()

  const {
    items: equipmentsList,
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
  } = useEquipmentsController()

  const publishedFilter = urlState.isPublished ?? undefined
  const featuredFilter = urlState.isFeatured ?? undefined
  const equipmentTypeFilter = urlState.equipmentType ?? undefined
  const categoryIdFilter = urlState.categoryId ? Number(urlState.categoryId) : undefined
  const brandIdFilter = urlState.brandId ? Number(urlState.brandId) : undefined

  const shouldFetchCategoryLabel = !!(categoryIdFilter && !selectedCategoryLabel)
  const shouldFetchBrandLabel = !!(brandIdFilter && !selectedBrandLabel)

  const { category: categoryItem } = useEquipmentCategoryById(
    shouldFetchCategoryLabel ? categoryIdFilter : 0,
    shouldFetchCategoryLabel,
  )

  const { brand: brandItem } = useEquipmentBrandById(
    shouldFetchBrandLabel ? brandIdFilter : 0,
    shouldFetchBrandLabel,
  )

  const displayCategoryLabel = useMemo(() => {
    if (selectedCategoryLabel) return selectedCategoryLabel
    if (categoryItem && categoryIdFilter) return categoryItem.name
    return undefined
  }, [selectedCategoryLabel, categoryItem, categoryIdFilter])

  const displayBrandLabel = useMemo(() => {
    if (selectedBrandLabel) return selectedBrandLabel
    if (brandItem && brandIdFilter) return brandItem.name
    return undefined
  }, [selectedBrandLabel, brandItem, brandIdFilter])

  const { del: deleteEquipment } = useEquipmentMutations()

  const columns = useEquipmentColumns({
    onDelete: setEquipmentToDelete,
  })

  async function handleDeleteEquipment() {
    if (!equipmentToDelete) return

    try {
      await deleteEquipment.mutateAsync(equipmentToDelete.id)
      toast.success('Equipment deleted successfully')
      setEquipmentToDelete(null)
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Equipment'
      toast.error(errMsg)
      console.error('Error deleting equipment:', error)
    }
  }

  function handleAddEquipment() {
    router.push(`/dashboard/equipments/add`)
  }

  function handleClearAll() {
    clearAll()
    setSelectedCategoryLabel(undefined)
    setSelectedBrandLabel(undefined)
  }

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = []

    if (publishedFilter !== undefined)
      filters.push({
        key: 'isPublished',
        label: 'Status',
        value: publishedFilter ? 'Published' : 'Draft',
      })

    if (featuredFilter !== undefined)
      filters.push({
        key: 'isFeatured',
        label: 'Featured',
        value: featuredFilter ? 'Yes' : 'No',
      })

    if (equipmentTypeFilter)
      filters.push({
        key: 'equipmentType',
        label: 'Type',
        value: getEquipmentTypeLabel({ type: equipmentTypeFilter as string }),
      })

    if (categoryIdFilter && displayCategoryLabel)
      filters.push({
        key: 'categoryId',
        label: 'Category',
        value: displayCategoryLabel,
      })

    if (brandIdFilter && displayBrandLabel)
      filters.push({
        key: 'brandId',
        label: 'Brand',
        value: displayBrandLabel,
      })

    return filters
  }, [
    publishedFilter,
    featuredFilter,
    equipmentTypeFilter,
    categoryIdFilter,
    brandIdFilter,
    displayCategoryLabel,
    displayBrandLabel,
  ])

  const publishedSelectValue =
    publishedFilter === undefined ? 'all' : publishedFilter ? 'true' : 'false'

  const featuredSelectValue =
    featuredFilter === undefined ? 'all' : featuredFilter ? 'yes' : 'no'

  const equipmentTypeSelectValue =
    equipmentTypeFilter === undefined ? 'all' : (equipmentTypeFilter as string)

  function handlePublishedFilterChange(val: string | undefined) {
    setFilter('isPublished', val === undefined ? undefined : val === 'true')
  }

  function handleFeaturedFilterChange(val: string | undefined) {
    setFilter('isFeatured', val === undefined ? undefined : val === 'yes')
  }

  function handleEquipmentTypeFilterChange(val: string | undefined) {
    if (!val || val === 'all') return setFilter('equipmentType', undefined)
    setFilter('equipmentType', val as EquipmentType)
  }

  function handleCategoryChange(
    option:
      | {
          value: string | number
          label: string
          searchableText?: string
        }
      | undefined,
  ) {
    if (option) {
      setSelectedCategoryLabel(option.label)
      setFilter('categoryId', Number(option.value))
      return
    }

    setSelectedCategoryLabel(undefined)
    setFilter('categoryId', undefined)
  }

  function handleBrandChange(
    option:
      | {
          value: string | number
          label: string
          searchableText?: string
        }
      | undefined,
  ) {
    if (option) {
      setSelectedBrandLabel(option.label)
      setFilter('brandId', Number(option.value))
      return
    }

    setSelectedBrandLabel(undefined)
    setFilter('brandId', undefined)
  }

  return {
    equipmentsList,
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
    featuredFilter,
    equipmentTypeFilter,
    categoryIdFilter,
    brandIdFilter,
    displayCategoryLabel,
    displayBrandLabel,
    filterInfo,

    publishedSelectValue,
    featuredSelectValue,
    equipmentTypeSelectValue,

    columns,
    equipmentToDelete,
    deleteEquipment,
    setEquipmentToDelete,

    setSearch,
    setPage,
    setPageSize,
    handleClearAll,

    handleAddEquipment,
    handleDeleteEquipment,
    handlePublishedFilterChange,
    handleFeaturedFilterChange,
    handleEquipmentTypeFilterChange,
    handleCategoryChange,
    handleBrandChange,
  }
}

function getEquipmentTypeLabel({ type }: { type: string }) {
  const typeMap: Record<string, string> = {
    [EquipmentType.CAMERA]: 'Camera',
    [EquipmentType.LENS]: 'Lens',
    [EquipmentType.LIGHT]: 'Light',
    [EquipmentType.AUDIO]: 'Audio',
    [EquipmentType.ACCESSORY]: 'Accessory',
  }
  return typeMap[type] || type
}

