'use client';

// Stub hook for backward compatibility with facilities form
// Solutions CRUD has been removed, but facilities still reference solutionId
// This will be updated when facilities are migrated to use solutionKey
export function useSolutionsStaff(_options: any = {}) {
  return {
    solutions: [],
    pagination: null,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    isLoading: false,
    isError: false,
    error: null,
    refetch: async () => ({}),
  };
}

