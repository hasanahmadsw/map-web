import type {
  TCreateServiceForm,
  TEditServiceForm,
  TCreateServiceTranslationForm,
  TEditServiceTranslationForm,
  TAutoTranslateServiceForm,
  TBulkServiceOperationForm,
  TServiceSearchForm,
  TUpdateServiceStatusForm,
} from "@/schemas/services.schemas";
import type { ApiResponse } from "@/types/common.types";
import type { StaffService, ServiceResponse, ServiceTranslation } from "@/types/services.types";
import { ApiService } from "./base.service";
import { toQS } from "@/utils/api-utils";

const BASE = "/services";

type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

type StaffListParams = {
  page?: number;
  limit?: number;
  search?: string;
  lang?: string;
  sort?: "createdAt" | "updatedAt" | "name" | "order";
  order?: "asc" | "desc";
  isPublished?: boolean;
  isFeatured?: boolean;
};

export const servicesService = {
  // Staff Services
  async getAllForStaff(
    params: StaffListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<StaffService[]>> {
    const res = await ApiService.get<StaffService[]>(`${BASE}/staff${toQS(params)}`, opts);
    return res;
  },

  async getServicesByLanguage(lang: string, opts?: RequestOpts): Promise<ApiResponse<StaffService[]>> {
    const res = await ApiService.get<StaffService[]>(
      `${BASE}/staff/language/${enc(lang)}`,
      opts,
    );
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.get<StaffService>(`${BASE}/staff/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateServiceForm, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.post<StaffService>(`${BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: TEditServiceForm, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.patch<StaffService>(`${BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Bulk operations
  async bulkOperation(payload: TBulkServiceOperationForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/bulk`, payload, opts);
    return res.data;
  },

  // Update service status
  async updateStatus(id: Id, payload: TUpdateServiceStatusForm, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.patch<StaffService>(`${BASE}/${enc(id)}/status`, payload, opts);
    return res.data;
  },

  // Staff Translations
  async getServiceTranslations(id: Id, opts?: RequestOpts): Promise<ServiceTranslation[]> {
    const res = await ApiService.get<ServiceTranslation[]>(`${BASE}/${enc(id)}/translations`, opts);
    return res.data;
  },

  async createServiceTranslation(
    id: Id,
    payload: TCreateServiceTranslationForm,
    opts?: RequestOpts,
  ): Promise<ServiceTranslation> {
    const res = await ApiService.post<ServiceTranslation>(`${BASE}/${enc(id)}/translations`, payload, opts);
    return res.data;
  },

  async updateServiceTranslation(
    id: Id,
    translationId: Id,
    payload: TEditServiceTranslationForm,
    opts?: RequestOpts,
  ): Promise<ServiceTranslation> {
    const res = await ApiService.patch<ServiceTranslation>(
      `${BASE}/${enc(id)}/translations/${enc(translationId)}`,
      payload,
      opts,
    );
    return res.data;
  },

  async deleteServiceTranslation(id: Id, translationId: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}/translations/${enc(translationId)}`, opts);
    return res.data;
  },

  async autoTranslateService(id: Id, payload: TAutoTranslateServiceForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/${enc(id)}/translations/auto`, payload, opts);
    return res.data;
  },

  // Public Services
  async getAll(
    payload: {
      lang: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: "createdAt" | "updatedAt" | "name" | "order";
      sortOrder?: "asc" | "desc";
      isPublished?: boolean;
      isFeatured?: boolean;
    },
    opts?: RequestOpts,
  ): Promise<ApiResponse<ServiceResponse[]>> {
    const res = await ApiService.get<ServiceResponse[]>(`/services/published${toQS(payload)}`, opts);
    return res;
  },

  async getBySlug(slug: string, lang: string, opts?: RequestOpts): Promise<ServiceResponse> {
    const res = await ApiService.get<ServiceResponse>(`${BASE}/slug/${enc(slug)}?lang=${enc(lang)}`, opts);
    return res.data;
  },

  // Search services
  async search(payload: TServiceSearchForm, opts?: RequestOpts): Promise<ApiResponse<ServiceResponse[]>> {
    const res = await ApiService.get<ServiceResponse[]>(`${BASE}/search${toQS(payload as Record<string, unknown>)}`, opts);
    return res;
  },

  // Upload service image
  async uploadImage(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    const res = await ApiService.post<{ url: string }>(`${BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};
