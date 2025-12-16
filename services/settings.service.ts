import { ApiResponse } from '@/types/common.types';
import type { Settings } from '@/types/settings.types';
import type { TUpdateSettingsDTO } from '@/schemas/settings.schemas';
import { ApiService } from './base.service';

const BASE = '/settings';

type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

export const settingsService = {
  async getSettings(opts?: RequestOpts): Promise<ApiResponse<Settings>> {
    const res = await ApiService.get<Settings>(`${BASE}`, opts);
    return res;
  },

  async updateSettings(payload: TUpdateSettingsDTO, opts?: RequestOpts): Promise<Settings> {
    const res = await ApiService.patch<Settings>(`/admin${BASE}`, payload, opts);
    return res.data;
  },
};
