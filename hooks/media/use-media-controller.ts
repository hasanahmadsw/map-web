"use client";

import type { Media, MediaParams } from "@/types/media.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMedia } from "./use-media";

export function useMediaController() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 24;
  const typeFilter = (searchParams.get("type") as 'image' | 'video' | 'all') || "all";
  const orderBy = (searchParams.get("orderBy") as 'created_at' | 'updated_at' | 'name') || "created_at";

  // Local state
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);

  // Build query parameters
  const queryParams: MediaParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    type: typeFilter || 'all',
    orderBy,
    orderDir: 'desc',
  }), [currentPage, pageSize, typeFilter, orderBy]);

  // Data fetching
  const {
    data: mediaData,
    error,
    isPending,
    refetch,
  } = useMedia(queryParams);

  const media = mediaData?.data || [];
  const total = mediaData?.pagination?.total || 0;
  const totalPages = mediaData?.pagination?.totalPages || 1;

  // URL state helpers
  const urlState = {
    page: currentPage,
    limit: pageSize,
    type: typeFilter,
    orderBy,
  };

  const hasActiveFilters = typeFilter !== "all";

  // Navigation helpers
  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const setPageSize = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", size.toString());
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const setTypeFilter = (type: 'image' | 'video' | 'all') => {
    const params = new URLSearchParams(searchParams);
    if (type !== "all") {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const setOrderBy = (order: 'created_at' | 'updated_at' | 'name') => {
    const params = new URLSearchParams(searchParams);
    params.set("orderBy", order);
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(window.location.pathname);
  };

  return {
    // Data
    items: media,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    // State
    currentPage,
    pageSize,
    typeFilter,
    orderBy,
    urlState,
    hasActiveFilters,
    mediaToDelete,
    setMediaToDelete,

    // Actions
    setPage,
    setPageSize,
    setTypeFilter,
    setOrderBy,
    clearAll,

    // Computed
    canNextPage: currentPage < totalPages,
    canPrevPage: currentPage > 1,
  };
}

