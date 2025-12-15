import type {
  TBulkSolutionOperationForm,
  TSolutionSearchForm,
  TUpdateSolutionStatusForm,
} from '@/schemas/solutions.schemas';

import type { TCreateSolutionForm } from '@/validations/solutions/create-solution.schema';

import type { ApiResponse } from '@/types/common.types';
import type { StaffSolution, SolutionResponse } from '@/types/solutions.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';
import type { SolutionListParams } from '@/types/solutions.types';
import { TUpdateSolutionForm } from '@/validations/solutions/update-solution.schema';

const BASE = '/solutions';
const ADMIN_BASE = '/admin/solutions';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export const solutionsService = {
  // Staff Solutions
  async getAllForStaff(
    params: SolutionListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<StaffSolution[]>> {
    const res = await ApiService.get<StaffSolution[]>(`${ADMIN_BASE}/${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.get<StaffSolution>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateSolutionForm, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.post<StaffSolution>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: Partial<TUpdateSolutionForm>, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.patch<StaffSolution>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Bulk operations
  async bulkOperation(payload: TBulkSolutionOperationForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${ADMIN_BASE}/bulk`, payload, opts);
    return res.data;
  },

  // Update solution status
  async updateStatus(id: Id, payload: TUpdateSolutionStatusForm, opts?: RequestOpts): Promise<StaffSolution> {
    const res = await ApiService.patch<StaffSolution>(`${ADMIN_BASE}/${enc(id)}/status`, payload, opts);
    return res.data;
  },

  // Public Solutions
  async getAll(
    params: SolutionListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<SolutionResponse[]>> {
    const res = await ApiService.get<SolutionResponse[]>(`/solutions/published${toQS(params)}`, opts);
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<SolutionResponse> {
    const res = await ApiService.get<SolutionResponse>(`${BASE}/slug/${enc(slug)}`, opts);
    return res.data;
  },

  // Search solutions
  async search(payload: TSolutionSearchForm, opts?: RequestOpts): Promise<ApiResponse<SolutionResponse[]>> {
    const res = await ApiService.get<SolutionResponse[]>(
      `${BASE}/search${toQS(payload as Record<string, unknown>)}`,
      opts,
    );
    return res;
  },

  // Upload solution image
  async uploadImage(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);

    const res = await ApiService.post<{ url: string }>(`${ADMIN_BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};
