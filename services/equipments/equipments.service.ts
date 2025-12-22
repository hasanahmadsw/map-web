import type { ApiResponse, BaseListParams } from '@/types/common.types';
import type { EquipmentParams, IEquipment } from '@/types/equipments/equipment.type';
import { ApiService } from '../base.service';
import { toQS } from '@/utils/api-utils';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import type { TUpdateEquipmentForm } from '@/validations/equipments/update-equipment.schema';

const BASE = '/equipment';
const ADMIN_BASE = '/admin/equipment';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export interface EquipmentListParams extends BaseListParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  equipmentType?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export const equipmentsService = {
  // Admin Services
  async getAll(params: EquipmentListParams = {}, opts?: RequestOpts): Promise<ApiResponse<IEquipment[]>> {
    const res = await ApiService.get<IEquipment[]>(`${ADMIN_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<IEquipment> {
    const res = await ApiService.get<IEquipment>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateEquipmentForm, opts?: RequestOpts): Promise<IEquipment> {
    const res = await ApiService.post<IEquipment>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: Partial<TUpdateEquipmentForm>, opts?: RequestOpts): Promise<IEquipment> {
    const res = await ApiService.patch<IEquipment>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Services
  async getAllPublic(params: EquipmentParams = {}, opts?: RequestOpts): Promise<ApiResponse<IEquipment[]>> {
    const res = await ApiService.get<IEquipment[]>(`${BASE}/published${toQS(params)}`, opts);
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<IEquipment> {
    const res = await ApiService.get<IEquipment>(`${BASE}/slug/${enc(slug)}`, opts);
    return res.data;
  },
};
