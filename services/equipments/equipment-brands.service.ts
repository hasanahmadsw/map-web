import type { ApiResponse, BaseListParams } from '@/types/common.types';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import { ApiService } from '../base.service';
import { toQS } from '@/utils/api-utils';
import type { TCreateEquipmentBrandForm } from '@/validations/equipments/brands/create-equipment-brand.schema';
import type { TUpdateEquipmentBrandForm } from '@/validations/equipments/brands/update-equipment-brand.schema';

const BASE = '/equipment/brands';
const ADMIN_BASE = '/admin/equipment/brands';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export interface EquipmentBrandListParams extends BaseListParams {
  search?: string;
  isActive?: boolean;
}

export const equipmentBrandsService = {
  // Admin Services
  async getAll(
    params: EquipmentBrandListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<IEquipmentBrand[]>> {
    const res = await ApiService.get<IEquipmentBrand[]>(`${ADMIN_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<IEquipmentBrand> {
    const res = await ApiService.get<IEquipmentBrand>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateEquipmentBrandForm, opts?: RequestOpts): Promise<IEquipmentBrand> {
    const res = await ApiService.post<IEquipmentBrand>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(
    id: Id,
    payload: Partial<TUpdateEquipmentBrandForm>,
    opts?: RequestOpts,
  ): Promise<IEquipmentBrand> {
    const res = await ApiService.patch<IEquipmentBrand>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Services
  async getAllPublic(
    params: EquipmentBrandListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<IEquipmentBrand[]>> {
    const res = await ApiService.get<IEquipmentBrand[]>(`${BASE}${toQS(params)}`, opts);
    return res;
  },
};
