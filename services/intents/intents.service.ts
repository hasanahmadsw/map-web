import type { ApiResponse } from '@/types/common.types';
import type { BaseListParams } from '@/hooks/api/list/useListUrlState';
import { ApiService } from '../base.service';
import { toQS } from '@/utils/api-utils';
import type { IIntent } from '@/types/intents/intent.type';

const BASE = '/intent';
const ADMIN_BASE = '/admin/intent';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export interface IntentListParams extends BaseListParams {
  search?: string;
  type?: string;
  [key: string]: string | number | boolean | undefined;
}

export const intentsService = {
  getHub(opts?: RequestOpts): Promise<IIntent> {
    return ApiService.get<IIntent>(`${BASE}/hub`, opts).then(r => r.data);
  },

  getBySlug(slug: string, opts?: RequestOpts): Promise<IIntent> {
    return ApiService.get<IIntent>(`${BASE}/slug/${enc(slug)}`, opts).then(r => r.data);
  },

  async getAll(params: IntentListParams = {}, opts?: RequestOpts): Promise<ApiResponse<IIntent[]>> {
    return ApiService.get<IIntent[]>(`${ADMIN_BASE}${toQS(params)}`, opts);
  },

  getById(id: Id, opts?: RequestOpts): Promise<Omit<IIntent, 'breadcrumbs' | 'internalLinks' | 'smartBadges'>> {
    return ApiService.get<IIntent>(`${ADMIN_BASE}/${enc(id)}`, opts).then(r => r.data);
  },

  create(payload: Record<string, unknown>, opts?: RequestOpts): Promise<IIntent> {
    return ApiService.post<IIntent>(ADMIN_BASE, payload, opts).then(r => r.data);
  },

  update(id: Id, payload: Record<string, unknown>, opts?: RequestOpts): Promise<IIntent> {
    return ApiService.patch<IIntent>(`${ADMIN_BASE}/${enc(id)}`, payload, opts).then(r => r.data);
  },

  delete(id: Id, opts?: RequestOpts): Promise<void> {
    return ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts).then(r => r.data);
  },

  getTree(opts?: RequestOpts) {
    return ApiService.get<unknown[]>(`${ADMIN_BASE}/tree`, opts).then(r => r.data);
  },

  /** Public: fetch all slugs for sitemap (no auth required) */
  async getAllSlugsForSitemap(opts?: RequestOpts): Promise<{ slug: string; type: string; updatedAt: string }[]> {
    const res = await ApiService.get<{ slug: string; type: string; updatedAt: string }[]>(`${BASE}/slugs`, opts);
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res)) return res as unknown as { slug: string; type: string; updatedAt: string }[];
    return [];
  },
};
