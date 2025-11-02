"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { TCreateServiceForm, TEditServiceForm, TBulkServiceOperationForm, TUpdateServiceStatusForm } from "@/schemas/services.schemas";
import { servicesService } from "@/services/services.service";
import type { StaffService, ServiceResponse } from "@/types/services.types";
import type { ApiResponse } from "@/types/common.types";

const qk = {
  list: (page: number, limit: number, lang?: string) => ["services", "staff", { page, limit, lang }] as const,
  byId: (id: number) => ["services", "staff", id] as const,
  public: (lang: string, page: number, limit: number) => ["services", "public", { lang, page, limit }] as const,
  bySlug: (slug: string, lang: string) => ["services", "public", "slug", { slug, lang }] as const,
  search: (params: Record<string, unknown>) => ["services", "search", params] as const,
};

type StaffServicesPage = ApiResponse<StaffService[]>;
type PublicServicesPage = ApiResponse<ServiceResponse[]>;

const sameId = (a: string | number, b: string | number) => String(a) === String(b);

interface UseServicesStaffOptions {
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

interface UseServicesStaffReturn {
  services: StaffService[];
  pagination: StaffServicesPage["pagination"];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  getById: (id: number) => Promise<StaffService>;
  createService: (payload: TCreateServiceForm) => Promise<StaffService>;
  updateService: (id: number, payload: TEditServiceForm) => Promise<StaffService>;
  deleteService: (id: number) => Promise<void>;
  bulkOperation: (payload: TBulkServiceOperationForm) => Promise<void>;
  updateStatus: (id: number, payload: TUpdateServiceStatusForm) => Promise<StaffService>;
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

export function useServicesStaff(options: UseServicesStaffOptions = {}): UseServicesStaffReturn {
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
      return servicesService.getServicesByLanguage(lang);
    }
    return servicesService.getAllForStaff({ 
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
  } = useQuery<StaffServicesPage>({
    queryKey: qk.list(currentPage, limit, lang),
    queryFn: fetchList,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const writeList = (updater: (old?: StaffServicesPage) => StaffServicesPage | unknown) => {
    queryClient.setQueriesData({ queryKey: ["services", "staff"] }, updater);
  };

  const upsertItemInCaches = (item: StaffService) => {
    writeList((old) => {
      const cur = old as StaffServicesPage | undefined;
      if (!cur?.data) return old;
      const idx = cur.data.findIndex((s) => sameId(s.id, item.id));
      const newData = idx === -1 ? [item, ...cur.data] : cur.data.map((s, i) => (i === idx ? { ...s, ...item } : s));
      return { ...cur, data: newData };
    });
    queryClient.setQueryData(qk.byId(item.id), item);
  };

  const removeItemFromCaches = (id: number) => {
    writeList((old) => {
      const cur = old as StaffServicesPage | undefined;
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
    mutationFn: (payload: TCreateServiceForm) => servicesService.create(payload),
    onSuccess: (created) => {
      upsertItemInCaches(created);
      queryClient.invalidateQueries({ queryKey: ["services", "staff"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TEditServiceForm }) => servicesService.update(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["services", "staff"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => servicesService.delete(id),
    onSuccess: (_void, id) => {
      removeItemFromCaches(id);
      queryClient.invalidateQueries({ queryKey: ["services", "staff"] });
    },
  });

  const bulkOperationMutation = useMutation({
    mutationFn: (payload: TBulkServiceOperationForm) => servicesService.bulkOperation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", "staff"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TUpdateServiceStatusForm }) => 
      servicesService.updateStatus(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["services", "staff"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => servicesService.uploadImage(file),
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  // Ensure services is always an array
  const servicesData = pageData?.data;
  const services = Array.isArray(servicesData) ? servicesData : [];

  return {
    services,
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

    getById: (id) => servicesService.getById(id),
    createService: (payload) => createMutation.mutateAsync(payload),
    updateService: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    deleteService: (id) => deleteMutation.mutateAsync(id),
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

// Get service by ID hook
export function useServiceStaffById(id: number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<StaffService>({
    queryKey: qk.byId(id),
    queryFn: () => servicesService.getById(id),
    enabled: enabled && !!id,
    retry: 1,
  });
  return { data, isLoading, isError, error, refetch };
}

// Public services hooks
interface UsePublicServicesOptions {
  lang: string;
  page?: number;
  limit?: number;
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name" | "order";
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
}

interface UsePublicServicesReturn {
  services: ServiceResponse[];
  pagination: PublicServicesPage["pagination"];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  refetch: () => void;
}

export function usePublicServices(options: UsePublicServicesOptions): UsePublicServicesReturn {
  const { 
    lang, 
    page = 1, 
    limit = 10, 
    search, 
    isPublished, 
    isFeatured, 
    sortBy, 
    sortOrder, 
    enabled = true 
  } = options;
  const [currentPage, setCurrentPage] = useState(page);
  const queryClient = useQueryClient();

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PublicServicesPage>({
    queryKey: qk.public(lang, currentPage, limit),
    queryFn: () => servicesService.getAll({
      lang,
      page: currentPage,
      limit,
      search,
      isPublished,
      isFeatured,
      sortBy,
      sortOrder,
    }),
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  // Ensure services is always an array
  const servicesData = pageData?.data;
  const services = Array.isArray(servicesData) ? servicesData : [];

  return {
    services,
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

    refetch,
  };
}

// Get service by slug hook (public)
export function useServiceBySlug(slug: string, lang: string, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<ServiceResponse>({
    queryKey: qk.bySlug(slug, lang),
    queryFn: () => servicesService.getBySlug(slug, lang),
    enabled: enabled && !!slug && !!lang,
    retry: 1,
  });
  return { data, isLoading, isError, error, refetch };
}

// Search services hook
interface UseServiceSearchOptions {
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

export function useServiceSearch(options: UseServiceSearchOptions = {}) {
  const { enabled = true, ...searchParams } = options;
  const queryClient = useQueryClient();

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PublicServicesPage>({
    queryKey: qk.search(searchParams),
    queryFn: () => servicesService.search(searchParams),
    enabled,
    staleTime: 10_000,
    retry: 1,
  });

  // Ensure services is always an array
  const servicesData = pageData?.data;
  const services = Array.isArray(servicesData) ? servicesData : [];

  return {
    services,
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
