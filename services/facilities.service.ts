import type { TCreateFacilityForm } from '@/validations/facilities/create-facility.schema';
import type { TUpdateFacilityForm } from '@/validations/facilities/update-facility.schema';
import type { TCreateFacilityUnitForm } from '@/validations/facilities/create-facility-unit.schema';
import type { TUpdateFacilityUnitForm } from '@/validations/facilities/update-facility-unit.schema';

import type { ApiResponse } from '@/types/common.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';
import { FacilityParams, FacilityUnit, FacilityUnitParams } from '@/types/facilities/facilities.types';
import { Facility } from '@/types/facilities/facilities.types';

const BASE = '/facilities';
const ADMIN_BASE = '/admin/facilities';
const UNITS_BASE = '/facility-units';
const ADMIN_UNITS_BASE = '/admin/facility-units';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export const facilitiesService = {
  // Staff Solutions
  async getAllForStaff(params: FacilityParams = {}, opts?: RequestOpts): Promise<ApiResponse<Facility[]>> {
    const res = await ApiService.get<Facility[]>(`${ADMIN_BASE}/${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<Facility> {
    const res = await ApiService.get<Facility>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateFacilityForm, opts?: RequestOpts): Promise<Facility> {
    const res = await ApiService.post<Facility>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: Partial<TUpdateFacilityForm>, opts?: RequestOpts): Promise<Facility> {
    const res = await ApiService.patch<Facility>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Solutions
  async getAll(params: FacilityParams = {}, opts?: RequestOpts): Promise<ApiResponse<Facility[]>> {
    const res = await ApiService.get<Facility[]>(
      `/facilities/published${toQS(params)}`,
      opts,
      true, // withoutAuthHeader - public endpoint
    );
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<Facility> {
    const res = await ApiService.get<Facility>(`${BASE}/slug/${enc(slug)}`, opts, true); // withoutAuthHeader - public endpoint
    return res.data;
  },

  // Facility Units
  async getAllUnits(
    params: FacilityUnitParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<FacilityUnit[]>> {
    const res = await ApiService.get<FacilityUnit[]>(`${ADMIN_UNITS_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getUnitById(id: Id, opts?: RequestOpts): Promise<FacilityUnit> {
    const res = await ApiService.get<FacilityUnit>(`${ADMIN_UNITS_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async createUnit(payload: TCreateFacilityUnitForm, opts?: RequestOpts): Promise<FacilityUnit> {
    const res = await ApiService.post<FacilityUnit>(`${ADMIN_UNITS_BASE}`, payload, opts);
    return res.data;
  },
  async updateUnit(
    id: Id,
    payload: Partial<TUpdateFacilityUnitForm>,
    opts?: RequestOpts,
  ): Promise<FacilityUnit> {
    const res = await ApiService.patch<FacilityUnit>(`${ADMIN_UNITS_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async deleteUnit(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_UNITS_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Units
  async getAllUnitsPublic(
    params: FacilityUnitParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<FacilityUnit[]>> {
    const res = await ApiService.get<FacilityUnit[]>(
      `${UNITS_BASE}/published${toQS(params)}`,
      opts,
      true, // withoutAuthHeader - public endpoint
    );
    return res;
  },

  async getUnitBySlug(slug: string, opts?: RequestOpts): Promise<FacilityUnit> {
    const res = await ApiService.get<FacilityUnit>(`${UNITS_BASE}/slug/${enc(slug)}`, opts, true); // withoutAuthHeader - public endpoint
    return res.data;
  },
};
