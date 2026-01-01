import type { TCreateBroadcastUnitForm } from '@/validations/broadcasts/create-broadcast-unit.schema';
import type { TUpdateBroadcastUnitForm } from '@/validations/broadcasts/update-broadcast-unit.schema';

import type { ApiResponse } from '@/types/common.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';
import { BroadcastUnit, BroadcastUnitParams } from '@/types/broadcasts/broadcasts.types';

const UNITS_BASE = '/broadcast-units';
const ADMIN_UNITS_BASE = '/admin/broadcast-units';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export const broadcastsService = {
  // Broadcast Units
  async getAllUnits(
    params: BroadcastUnitParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<BroadcastUnit[]>> {
    const res = await ApiService.get<BroadcastUnit[]>(`${ADMIN_UNITS_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getUnitById(id: Id, opts?: RequestOpts): Promise<BroadcastUnit> {
    const res = await ApiService.get<BroadcastUnit>(`${ADMIN_UNITS_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async createUnit(payload: TCreateBroadcastUnitForm, opts?: RequestOpts): Promise<BroadcastUnit> {
    const res = await ApiService.post<BroadcastUnit>(`${ADMIN_UNITS_BASE}`, payload, opts);
    return res.data;
  },
  async updateUnit(
    id: Id,
    payload: Partial<TUpdateBroadcastUnitForm>,
    opts?: RequestOpts,
  ): Promise<BroadcastUnit> {
    const res = await ApiService.patch<BroadcastUnit>(`${ADMIN_UNITS_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async deleteUnit(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_UNITS_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Units
  async getAllUnitsPublic(
    params: BroadcastUnitParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<BroadcastUnit[]>> {
    const res = await ApiService.get<BroadcastUnit[]>(
      `${UNITS_BASE}/published${toQS(params)}`,
      opts,
      true, // withoutAuthHeader - public endpoint
    );
    return res;
  },

  async getUnitBySlug(slug: string, opts?: RequestOpts): Promise<BroadcastUnit> {
    const res = await ApiService.get<BroadcastUnit>(`${UNITS_BASE}/slug/${enc(slug)}`, opts, true); // withoutAuthHeader - public endpoint
    return res.data;
  },
};
