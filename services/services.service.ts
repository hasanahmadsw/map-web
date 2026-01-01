import type { ApiResponse, BaseListParams } from '@/types/common.types';
import type { StaffService, ServiceResponse } from '@/types/services.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';
import { TCreateServiceForm } from '@/validations/services/create-service.schema';
import { TEditServiceForm } from '@/validations/services/edit-service.schema';

const BASE = '/services';
const ADMIN_BASE = '/admin/services';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export interface ServiceListParams extends BaseListParams {
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  solutionKey?: string;
}

export const servicesService = {
  // Staff Services
  async getAllForStaff(
    params: ServiceListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<StaffService[]>> {
    const res = await ApiService.get<StaffService[]>(`${ADMIN_BASE}/${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.get<StaffService>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateServiceForm, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.post<StaffService>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: Partial<TEditServiceForm>, opts?: RequestOpts): Promise<StaffService> {
    const res = await ApiService.patch<StaffService>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Services
  async getAll(params: ServiceListParams = {}, opts?: RequestOpts): Promise<ApiResponse<ServiceResponse[]>> {
    const res = await ApiService.get<ServiceResponse[]>(
      `/services/published${toQS(params)}`,
      opts,
      true, // withoutAuthHeader - public endpoint
    );
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<ServiceResponse> {
    const res = await ApiService.get<ServiceResponse>(`${BASE}/slug/${enc(slug)}`, opts, true); // withoutAuthHeader - public endpoint
    return res.data;
  },

  // Upload service image
  async uploadImage(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);

    const res = await ApiService.post<{ url: string }>(`${ADMIN_BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};
