import type {
  TAutoTranslateStaffDTO,
  TCreateStaffDTO,
  TCreateStaffTranslationDTO,
  TEditStaffDTO,
  TUpdateMeDTO,
  TUpdateStaffTranslationDTO,
} from "@/schemas/staff.schemas";
import type { PaginatedResponse } from "@/types/common.types";
import type { Role, Staff, StaffTranslation } from "@/types/staff.types";
import { ApiService } from "./base.service";

const BASE = "/staff";

type Id = string | number;

type RequestOpts = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  sort?: "createdAt" | "name";
  order?: "asc" | "desc";
};

const toQS = (params: Record<string, unknown>) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? `?${new URLSearchParams(entries as [string, string][]).toString()}` : "";
};

const encId = (id: Id) => encodeURIComponent(String(id));

export const staffService = {
  async create(payload: TCreateStaffDTO, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.post<Staff>(`${BASE}`, payload, opts);
    return res.data;
  },

  async getAll(params: GetAllParams = {}, opts?: RequestOpts): Promise<PaginatedResponse<Staff>> {
    const qs = toQS({
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
      sort: params.sort,
      order: params.order,
    });

    const res = await ApiService.get<PaginatedResponse<Staff>>(`${BASE}${qs}`, opts);
    return res as unknown as PaginatedResponse<Staff>;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.get<Staff>(`${BASE}/${encId(id)}`, opts);
    return res.data;
  },

  async update(id: Id, payload: TEditStaffDTO | FormData, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.patch<Staff>(`${BASE}/${encId(id)}`, payload, opts);
    return res.data;
  },

  async updateMe(payload: TUpdateMeDTO, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.patch<Staff>(`${BASE}/me`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${encId(id)}`, opts);
    return res.data;
  },

  // Staff Translations
  async getStaffTranslations(id: Id, opts?: RequestOpts): Promise<StaffTranslation[]> {
    const res = await ApiService.get<StaffTranslation[]>(`${BASE}/${encId(id)}/translations`, opts);
    return res.data;
  },

  async createStaffTranslation(
    id: Id,
    payload: TCreateStaffTranslationDTO,
    opts?: RequestOpts,
  ): Promise<StaffTranslation> {
    const res = await ApiService.post<StaffTranslation>(`${BASE}/${encId(id)}/translations`, payload, opts);
    return res.data;
  },

  async updateStaffTranslation(
    id: Id,
    translationId: Id,
    payload: TUpdateStaffTranslationDTO,
    opts?: RequestOpts,
  ): Promise<StaffTranslation> {
    const res = await ApiService.patch<StaffTranslation>(
      `${BASE}/${encId(id)}/translations/${encId(translationId)}`,
      payload,
      opts,
    );
    return res.data;
  },

  async deleteStaffTranslation(id: Id, translationId: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${encId(id)}/translations/${encId(translationId)}`, opts);
    return res.data;
  },

  async autoTranslateStaff(id: Id, payload: TAutoTranslateStaffDTO, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/${encId(id)}/translations/auto`, payload, opts);
    return res.data;
  },

  // Upload picture
  async uploadPicture(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    // Backend expects the binary under the "picture" key
    formData.append('picture', file, file.name);
    
    const res = await ApiService.post<{ url: string }>(`${BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};
