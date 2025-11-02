"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { TCreateSolutionForm, TEditSolutionForm, TBulkSolutionOperationForm, TUpdateSolutionStatusForm } from "@/schemas/solutions.schemas";
import { solutionsService } from "@/services/solutions.service";
import type { StaffSolution, SolutionResponse } from "@/types/solutions.types";
import type { ApiResponse } from "@/types/common.types";

const qk = {
  list: (page: number, limit: number, lang?: string) => ["solutions", "staff", { page, limit, lang }] as const,
  byId: (id: number) => ["solutions", "staff", id] as const,
  public: (lang: string, page: number, limit: number) => ["solutions", "public", { lang, page, limit }] as const,
  bySlug: (slug: string, lang: string) => ["solutions", "public", "slug", { slug, lang }] as const,
  search: (params: Record<string, unknown>) => ["solutions", "search", params] as const,
};

type StaffSolutionsPage = ApiResponse<StaffSolution[]>;
type PublicSolutionsPage = ApiResponse<SolutionResponse[]>;

const sameId = (a: string | number, b: string | number) => String(a) === String(b);

interface UseSolutionsStaffOptions {
  page?: number;
  limit?: number;
  lang?: string;
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sort?: "createdAt" | "updatedAt" | "name" | "order";
  order?: "asc" | "desc";
  enabled?: boolean;
}

interface UseSolutionsStaffReturn {
  solutions: StaffSolution[];
  pagination: StaffSolutionsPage["pagination"];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  getById: (id: number) => Promise<StaffSolution>;
  createSolution: (payload: TCreateSolutionForm) => Promise<StaffSolution>;
  updateSolution: (id: number, payload: TEditSolutionForm) => Promise<StaffSolution>;
  deleteSolution: (id: number) => Promise<void>;
  bulkOperation: (payload: TBulkSolutionOperationForm) => Promise<void>;
  updateStatus: (id: number, payload: TUpdateSolutionStatusForm) => Promise<StaffSolution>;
  uploadImage: (file: File) => Promise<{ url: string }>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isBulkOperating: boolean;
  isUpdatingStatus: boolean;
  isUploading: boolean;

  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  bulkOperationError: string | null;
  updateStatusError: string | null;
  uploadError: string | null;

  refetch: () => void;
}

export function useSolutionsStaff(options: UseSolutionsStaffOptions = {}): UseSolutionsStaffReturn {
  const { 
    page = 1, 
    limit = 10, 
    lang, 
    search, 
    isPublished, 
    isFeatured, 
    sort, 
    order, 
    enabled = true 
  } = options;
  const [currentPage, setCurrentPage] = useState(page);
  const queryClient = useQueryClient();

  const fetchList = () => {
    if (lang) {
      return solutionsService.getSolutionsByLanguage(lang);
    }
    return solutionsService.getAllForStaff({ 
      page: currentPage, 
      limit, 
      search, 
      isPublished, 
      isFeatured, 
      sort, 
      order 
    });
  };

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StaffSolutionsPage>({
    queryKey: qk.list(currentPage, limit, lang),
    queryFn: fetchList,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const writeList = (updater: (old?: StaffSolutionsPage) => StaffSolutionsPage | unknown) => {
    queryClient.setQueriesData({ queryKey: ["solutions", "staff"] }, updater);
  };

  const upsertItemInCaches = (item: StaffSolution) => {
    writeList((old) => {
      const cur = old as StaffSolutionsPage | undefined;
      if (!cur?.data) return old;
      const idx = cur.data.findIndex((s) => sameId(s.id, item.id));
      const newData = idx === -1 ? [item, ...cur.data] : cur.data.map((s, i) => (i === idx ? { ...s, ...item } : s));
      return { ...cur, data: newData };
    });
    queryClient.setQueryData(qk.byId(item.id), item);
  };

  const removeItemFromCaches = (id: number) => {
    writeList((old) => {
      const cur = old as StaffSolutionsPage | undefined;
      if (!cur?.data) return old;
      const newData = cur.data.filter((s) => !sameId(s.id, id));
      return {
        ...cur,
        data: newData,
        pagination: cur.pagination ? {
          ...cur.pagination,
          total: Math.max(0, (cur.pagination.total ?? newData.length) - 1),
        } : undefined,
      };
    });
    queryClient.removeQueries({ queryKey: qk.byId(id) });
  };

  // CRUD mutations
  const createMutation = useMutation({
    mutationFn: (payload: TCreateSolutionForm) => solutionsService.create(payload),
    onSuccess: (created) => {
      upsertItemInCaches(created);
      queryClient.invalidateQueries({ queryKey: ["solutions", "staff"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TEditSolutionForm }) => solutionsService.update(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["solutions", "staff"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => solutionsService.delete(id),
    onSuccess: (_void, id) => {
      removeItemFromCaches(id);
      queryClient.invalidateQueries({ queryKey: ["solutions", "staff"] });
    },
  });

  const bulkOperationMutation = useMutation({
    mutationFn: (payload: TBulkSolutionOperationForm) => solutionsService.bulkOperation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions", "staff"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TUpdateSolutionStatusForm }) => 
      solutionsService.updateStatus(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["solutions", "staff"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => solutionsService.uploadImage(file),
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  // Ensure solutions is always an array
  const solutionsData = pageData?.data;
  const solutions = Array.isArray(solutionsData) ? solutionsData : [];

  return {
    solutions,
    pagination: pageData?.pagination,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: setCurrentPage,
    nextPage: () => hasNextPage && setCurrentPage((p) => p + 1),
    prevPage: () => hasPrevPage && setCurrentPage((p) => Math.max(1, p - 1)),

    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,

    getById: (id) => solutionsService.getById(id),
    createSolution: (payload) => createMutation.mutateAsync(payload),
    updateSolution: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    deleteSolution: (id) => deleteMutation.mutateAsync(id),
    bulkOperation: (payload) => bulkOperationMutation.mutateAsync(payload),
    updateStatus: (id, payload) => updateStatusMutation.mutateAsync({ id, payload }),
    uploadImage: (file) => uploadImageMutation.mutateAsync(file),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkOperating: bulkOperationMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isUploading: uploadImageMutation.isPending,

    createError: (createMutation.error as Error | undefined)?.message ?? null,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    deleteError: (deleteMutation.error as Error | undefined)?.message ?? null,
    bulkOperationError: (bulkOperationMutation.error as Error | undefined)?.message ?? null,
    updateStatusError: (updateStatusMutation.error as Error | undefined)?.message ?? null,
    uploadError: (uploadImageMutation.error as Error | undefined)?.message ?? null,

    refetch,
  };
}

// Get solution by ID hook
export function useSolutionStaffById(id: number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<StaffSolution>({
    queryKey: qk.byId(id),
    queryFn: () => solutionsService.getById(id),
    enabled: enabled && !!id,
    retry: 1,
  });
  return { data, isLoading, isError, error, refetch };
}


// Search solutions hook
interface UseSolutionSearchOptions {
  query?: string;
  languageCode?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "order";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useSolutionSearch(options: UseSolutionSearchOptions = {}) {
  const { enabled = true, ...searchParams } = options;
  const queryClient = useQueryClient();

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PublicSolutionsPage>({
    queryKey: qk.search(searchParams),
    queryFn: () => solutionsService.search(searchParams),
    enabled,
    staleTime: 10_000,
    retry: 1,
  });

  // Ensure solutions is always an array
  const solutionsData = pageData?.data;
  const solutions = Array.isArray(solutionsData) ? solutionsData : [];

  return {
    solutions,
    pagination: pageData?.pagination,
    totalPages: pageData?.pagination?.totalPages ?? 0,
    hasNextPage: !!pageData?.pagination?.hasNextPage,
    hasPrevPage: !!pageData?.pagination?.hasPrevPage,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
