import type { ApiResponse } from '@/types/common.types';
import type { SolutionResponse, SolutionListParams } from '@/types/solutions.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';

const BASE = '/solutions';
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export const solutionsService = {
  // Public Solutions only
  async getAll(
    params: SolutionListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<SolutionResponse[]>> {
    const res = await ApiService.get<SolutionResponse[]>(
      `/solutions/published${toQS(params)}`,
      opts,
      true, // withoutAuthHeader - public endpoint
    );
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<SolutionResponse> {
    const res = await ApiService.get<SolutionResponse>(`${BASE}/slug/${enc(slug)}`, opts, true); // withoutAuthHeader - public endpoint
    return res.data;
  },
};
