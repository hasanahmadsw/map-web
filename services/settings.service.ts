import { ApiResponse } from '@/types/common.types';
import type { Settings, SettingsWithTranslations, UpdateSettingsTranslationDTO } from "@/types/settings.types";
import type { TUpdateSettingsDTO, TUpdateSettingsTranslationDTO } from "@/schemas/settings.schemas";
import { ApiService } from "./base.service";

const BASE = "/settings";

type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };



type GetSettingsParams = {
  lang?: string;
};

export const settingsService = {
  async getSettings(params: GetSettingsParams = {}, opts?: RequestOpts): Promise<ApiResponse<Settings>> {
    const res = await ApiService.get<Settings>(`${BASE}?lang=${params.lang}`, opts);
    return res;
  },

  async getSettingsWithTranslations(params: GetSettingsParams = {}, opts?: RequestOpts): Promise<ApiResponse<SettingsWithTranslations>> {
          const res = await ApiService.get<SettingsWithTranslations>(`${BASE}/translations?lang=${params.lang}`, opts);
    return res;
  },

  async updateSettings(payload: TUpdateSettingsDTO, opts?: RequestOpts): Promise<Settings> {
    const res = await ApiService.patch<Settings>(`${BASE}`, payload, opts);
    return res.data;
  },

  async updateSettingsTranslation(translationId: number, payload: TUpdateSettingsTranslationDTO, opts?: RequestOpts): Promise<SettingsWithTranslations> {
    const res = await ApiService.patch<SettingsWithTranslations>(`${BASE}/translations/${translationId}`, payload, opts);
    return res.data;
  },
};
