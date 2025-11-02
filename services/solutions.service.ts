import type {
  TCreateSolutionForm,
  TEditSolutionForm,
  TCreateSolutionTranslationForm,
  TEditSolutionTranslationForm,
  TAutoTranslateSolutionForm,
  TBulkSolutionOperationForm,
  TSolutionSearchForm,
  TUpdateSolutionStatusForm,
} from "@/schemas/solutions.schemas";
import type { ApiResponse } from "@/types/common.types";
import type { StaffSolution, SolutionResponse, SolutionTranslation } from "@/types/solutions.types";
import { ApiService } from "./base.service";
import { toQS } from "@/utils/api-utils";

const BASE = "/solutions";

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

export const solutionsService = {
  // Staff Solutions
  async getAllForStaff(
    params: StaffListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<StaffSolution[]>> {
    const res = await ApiService.get<StaffSolution[]>(`${BASE}/staff${toQS(params)}`, opts);
    return res;
  },

  async getSolutionsByLanguage(lang: string, opts?: RequestOpts): Promise<ApiResponse<StaffSolution[]>> {
    const res = await ApiService.get<StaffSolution[]>(
      `${BASE}/staff/language/${enc(lang)}`,
      opts,
    );
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.get<StaffSolution>(`${BASE}/staff/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateSolutionForm, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.post<StaffSolution>(`${BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: TEditSolutionForm, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.patch<StaffSolution>(`${BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Bulk operations
  async bulkOperation(payload: TBulkSolutionOperationForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/bulk`, payload, opts);
    return res.data;
  },

  // Update solution status
  async updateStatus(id: Id, payload: TUpdateSolutionStatusForm, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.patch<StaffSolution>(`${BASE}/${enc(id)}/status`, payload, opts);
    return res.data;
  },

  // Staff Translations
  async getSolutionTranslations(id: Id, opts?: RequestOpts): Promise<SolutionTranslation[]> {
    const res = await ApiService.get<SolutionTranslation[]>(`${BASE}/${enc(id)}/translations`, opts);
    return res.data;
  },

  async createSolutionTranslation(
    id: Id,
    payload: TCreateSolutionTranslationForm,
    opts?: RequestOpts,
  ): Promise<SolutionTranslation> {
    const res = await ApiService.post<SolutionTranslation>(`${BASE}/${enc(id)}/translations`, payload, opts);
    return res.data;
  },

  async updateSolutionTranslation(
    id: Id,
    translationId: Id,
    payload: TEditSolutionTranslationForm,
    opts?: RequestOpts,
  ): Promise<SolutionTranslation> {
    const res = await ApiService.patch<SolutionTranslation>(
      `${BASE}/${enc(id)}/translations/${enc(translationId)}`,
      payload,
      opts,
    );
    return res.data;
  },

  async deleteSolutionTranslation(id: Id, translationId: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}/translations/${enc(translationId)}`, opts);
    return res.data;
  },

  async autoTranslateSolution(id: Id, payload: TAutoTranslateSolutionForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/${enc(id)}/translations/auto`, payload, opts);
    return res.data;
  },

  // Public Solutions
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
  ): Promise<ApiResponse<SolutionResponse[]>> {
    const res = await ApiService.get<SolutionResponse[]>(`/solutions/published${toQS(payload)}`, opts);
    return res;
  },

  async getBySlug(slug: string, lang: string, opts?: RequestOpts): Promise<SolutionResponse> {
    const res = await ApiService.get<SolutionResponse>(`${BASE}/slug/${enc(slug)}?lang=${enc(lang)}`, opts);
    return res.data;
  },

  // Search solutions
  async search(payload: TSolutionSearchForm, opts?: RequestOpts): Promise<ApiResponse<SolutionResponse[]>> {
    const res = await ApiService.get<SolutionResponse[]>(`${BASE}/search${toQS(payload as Record<string, unknown>)}`, opts);
    return res;
  },

  // Upload solution image
  async uploadImage(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    const res = await ApiService.post<{ url: string }>(`${BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};
