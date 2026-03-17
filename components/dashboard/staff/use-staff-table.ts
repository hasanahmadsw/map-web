'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useStaffMutations } from '@/hooks/api/staff/mutations';
import { useStaffController } from '@/hooks/api/staff/useStaffController';
import type { FilterInfo } from '@/components/shared/table/table-header';
import type { Staff } from '@/types/staff.types';

import { useStaffColumns } from './columns';
import { Role } from '@/types/roles.enum';

type DialogType = 'add' | 'edit' | 'delete' | null;

export function useStaffTable() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const {
    items: staff,
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
  } = useStaffController();

  const roleFilter = urlState.role ?? undefined;

  const { del: deleteStaff } = useStaffMutations();

  function handleAddStaff() {
    setActiveDialog('add');
  }

  function handleEdit(staff: Staff) {
    setSelectedStaff(staff);
    setActiveDialog('edit');
  }

  function handleDelete(staff: Staff) {
    setSelectedStaff(staff);
    setActiveDialog('delete');
  }

  async function handleDeleteStaff() {
    if (!selectedStaff) return;

    try {
      await deleteStaff.mutateAsync(selectedStaff.id);
      toast.success('Staff deleted successfully');
      setSelectedStaff(null);
      setActiveDialog(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete staff';
      toast.error(errMsg);
      console.error('Error deleting staff:', error);
    }
  }

  const columns = useStaffColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];
    if (!roleFilter) return filters;

    filters.push({
      key: 'role',
      label: 'Role',
      value: getRoleLabel(roleFilter),
    });

    return filters;
  }, [roleFilter]);

  function handleRoleFilterChange(val: string | undefined) {
    setFilter('role', val as Role);
  }

  return {
    staff,
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

    roleFilter,
    filterInfo,
    columns,

    activeDialog,
    selectedStaff,
    deleteStaff,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,
    setSelectedStaff,

    handleAddStaff,
    handleDeleteStaff,
    handleRoleFilterChange,
  };
}

function getRoleLabel(role: string) {
  if (role === 'superadmin') return 'Super Admin';
  if (role === 'admin') return 'Admin';
  if (role === 'author') return 'Author';
  return role;
}
