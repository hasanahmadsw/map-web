'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useIntentMutations } from '@/hooks/api/intents/mutations'
import { useIntentsController } from '@/hooks/api/intents/use-intents-controller'
import type { FilterInfo } from '@/components/shared/table/table-header'
import type { IIntentBase, IntentType } from '@/types/intents/intent.type'

import { useIntentColumns } from './columns'

const INTENT_TYPE_OPTIONS: { value: IntentType; label: string }[] = [
  { value: 'HUB', label: 'HUB' },
  { value: 'CLUSTER', label: 'CLUSTER' },
  { value: 'CATEGORY', label: 'CATEGORY' },
  { value: 'BRAND', label: 'BRAND' },
  { value: 'MODEL', label: 'MODEL' },
  { value: 'OFFER', label: 'OFFER' },
  { value: 'LOCATION', label: 'LOCATION' },
]

type DialogType = 'delete' | null

export function useIntentsTable() {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedIntent, setSelectedIntent] = useState<IIntentBase | null>(null)

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
  } = useIntentsController()

  const typeFilter = urlState.type ?? undefined

  const { del: deleteIntent } = useIntentMutations()

  function handleAddIntent() {
    router.push('/dashboard/intents/add')
  }

  function handleEdit(intent: IIntentBase) {
    router.push(`/dashboard/intents/${intent.id}`)
  }

  function handleDelete(intent: IIntentBase) {
    setSelectedIntent(intent)
    setActiveDialog('delete')
  }

  async function handleDeleteIntent() {
    if (!selectedIntent) return
    try {
      await deleteIntent.mutateAsync(selectedIntent.id)
      toast.success('Intent deleted successfully')
      setSelectedIntent(null)
      setActiveDialog(null)
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete intent')
    }
  }

  const columns = useIntentColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = []
    if (searchTerm) filters.push({ key: 'search', label: 'Search', value: searchTerm })
    if (typeFilter) filters.push({ key: 'type', label: 'Type', value: typeFilter })
    return filters
  }, [searchTerm, typeFilter])

  const typeSelectValue = typeFilter ?? 'all'

  function handleTypeFilterChange(val: string | undefined) {
    setFilter('type', val)
  }

  return {
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
    typeFilter,
    filterInfo,
    intentTypeOptions: INTENT_TYPE_OPTIONS,
    columns,
    activeDialog,
    selectedIntent,
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
  }
}
