import { ApiResponse } from '@/types/common.types';
import type { Settings } from '@/types/settings.types';

import { ApiService } from './base.service';
import { TUpdateSettingsForm } from '@/validations/settings/update-settings.schema';

const BASE = '/settings';

type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

export const settingsService = {
  async getSettings(opts?: RequestOpts): Promise<ApiResponse<Settings>> {
    const res = await ApiService.get<Settings>(`${BASE}`, {
      ...opts,
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60 * 24, // 24 hours
      },
    });
    return res;
  },

  async updateSettings(
    payload: Partial<TUpdateSettingsForm> | FormData,
    opts?: RequestOpts,
  ): Promise<Settings> {
    const res = await ApiService.patch<Settings>(`/admin${BASE}`, payload, opts);
    return res.data;
  },
};
