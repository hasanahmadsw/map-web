"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { TCreateStaffDTO, TEditStaffDTO, TUpdateMeDTO } from "@/schemas/staff.schemas";
import { staffService } from "@/services/staff.service";
import type { PaginatedResponse } from "@/types/common.types";
import type { Role, Staff } from "@/types/staff.types";

const qk = {
  list: (page: number, limit: number) => ["staff", { page, limit }] as const,
  me: ["staff", "me"] as const,
  byId: (id: string | number) => ["staff", id] as const,
};

type StaffListPage = PaginatedResponse<Staff>;

const sameId = (a: string | number, b: string | number) => String(a) === String(b);

interface UseStaffOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  sort?: "createdAt" | "name";
  order?: "asc" | "desc";
  enabled?: boolean;
}

interface UseStaffReturn {
  staff: Staff[];
  currentStaff: Staff | undefined;
  pagination: StaffListPage["pagination"] | undefined;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  createStaff: (payload: TCreateStaffDTO) => Promise<Staff>;
  updateStaff: (id: string | number, payload: TEditStaffDTO | FormData) => Promise<Staff>;
  updateMe: (payload: TUpdateMeDTO) => Promise<Staff>;
  deleteStaff: (id: string | number) => Promise<void>;
  uploadPicture: (file: File) => Promise<{ url: string }>;

  isCreating: boolean;
  isUpdating: boolean;
  isUpdatingMe: boolean;
  isDeleting: boolean;
  isUploading: boolean;

  createError: string | null;
  updateError: string | null;
  updateMeError: string | null;
  deleteError: string | null;
  uploadError: string | null;

  refetch: () => void;
  refetchCurrentStaff: () => void;
}

export function useStaff(options: UseStaffOptions = {}): UseStaffReturn {
  const { page = 1, limit = 10, search, role, sort, order, enabled = true } = options;
  const [currentPage, setCurrentPage] = useState(page);
  const queryClient = useQueryClient();

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StaffListPage>({
    queryKey: qk.list(currentPage, limit),
    queryFn: () => staffService.getAll({ page: currentPage, limit, search, role, sort, order }),
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const {
    data: currentStaffData,
    isLoading: isLoadingCurrentStaff,
    isError: isCurrentStaffError,
    refetch: refetchCurrentStaff,
  } = useQuery<Staff>({
    queryKey: qk.me,
    queryFn: () => staffService.getById("me"),
    enabled,
    staleTime: 10_000,
    retry: 1,
  });

  const writeList = (updater: (old?: StaffListPage) => StaffListPage | unknown) => {
    queryClient.setQueriesData({ queryKey: ["staff"] }, updater);
  };

  const upsertItemInCaches = (item: Staff) => {
    writeList((old) => {
      const cur = old as StaffListPage | undefined;
      if (!cur?.data) return old;
      const idx = cur.data.findIndex((s) => sameId(s.id, item.id));
      const newData = idx === -1 ? [item, ...cur.data] : cur.data.map((s, i) => (i === idx ? { ...s, ...item } : s));
      return { ...cur, data: newData, meta: cur.meta };
    });
    queryClient.setQueryData(qk.byId(item.id), item);
  };

  const removeItemFromCaches = (id: string | number) => {
    writeList((old) => {
      const cur = old as StaffListPage | undefined;
      if (!cur?.data) return old;
      const newData = cur.data.filter((s) => !sameId(s.id, id));
      return {
        ...cur,
        data: newData,
        pagination: {
          ...cur.pagination,
          total: Math.max(0, (cur.pagination?.total ?? newData.length) - 1),
        },
        meta: cur.meta,
      };
    });
    queryClient.removeQueries({ queryKey: qk.byId(id) });
  };

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateStaffDTO) => staffService.create(payload),
    onSuccess: (created) => {
      upsertItemInCaches(created);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: TEditStaffDTO | FormData }) => staffService.update(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  // Update me
  const updateMeMutation = useMutation({
    mutationFn: (payload: TUpdateMeDTO) => staffService.updateMe(payload),
    onSuccess: (me) => {
      queryClient.setQueryData(qk.me, me);
      upsertItemInCaches(me);
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => staffService.delete(id),
    onSuccess: (_void, id) => {
      removeItemFromCaches(id);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  // Upload picture
  const uploadPictureMutation = useMutation({
    mutationFn: (file: File) => staffService.uploadPicture(file),
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  return {
    staff: pageData?.data ?? [],
    currentStaff: currentStaffData,
    pagination: pageData?.pagination,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: setCurrentPage,
    nextPage: () => hasNextPage && setCurrentPage((p) => p + 1),
    prevPage: () => hasPrevPage && setCurrentPage((p) => Math.max(1, p - 1)),

    isLoading: isLoading || isLoadingCurrentStaff,
    isError: isError || isCurrentStaffError,
    error: (error as Error | undefined)?.message ?? null,

    createStaff: (payload) => createMutation.mutateAsync(payload),
    updateStaff: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    updateMe: (payload) => updateMeMutation.mutateAsync(payload),
    deleteStaff: (id) => deleteMutation.mutateAsync(id),
    uploadPicture: (file) => uploadPictureMutation.mutateAsync(file),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingMe: updateMeMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadPictureMutation.isPending,

    createError: (createMutation.error as Error | undefined)?.message ?? null,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    updateMeError: (updateMeMutation.error as Error | undefined)?.message ?? null,
    deleteError: (deleteMutation.error as Error | undefined)?.message ?? null,
    uploadError: (uploadPictureMutation.error as Error | undefined)?.message ?? null,

    refetch,
    refetchCurrentStaff,
  };
}

// By ID
export function useStaffById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Staff>({
    queryKey: qk.byId(id),
    queryFn: () => staffService.getById(id),
    enabled: enabled && !!id,
    staleTime: 10_000,
    retry: 1,
  });

  return {
    staff: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
