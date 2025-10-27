export interface ApiMeta {
  message: string;
  statusCode: number;
  timestamp: string;
  status?: "success" | "error";
  path?: string;
  method?: string;
  requestId?: string;
}

export interface ApiErrorDetail {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ErrorResponse {
  meta: ApiMeta;
  error: ApiErrorDetail;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface PaginationMeta {
  limit: number;
  currentPage: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<TItem> {
  data: TItem[];
  pagination: PaginationMeta;
  meta: ApiMeta;
}

export enum SortBy {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  VIEW_COUNT = "viewCount",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
