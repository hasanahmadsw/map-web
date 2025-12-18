import type { ApiResponse, BaseListParams } from '@/types/common.types';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import { ApiService } from '../base.service';
import { toQS } from '@/utils/api-utils';
import type { TCreateEquipmentCategoryForm } from '@/validations/equipments/categories/create-equipment-category.schema';
import type { TUpdateEquipmentCategoryForm } from '@/validations/equipments/categories/update-equipment-category.schema';

const BASE = '/equipment/categories';
const ADMIN_BASE = '/admin/equipment/categories';
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const enc = (v: string | number) => encodeURIComponent(String(v));

export interface EquipmentCategoryListParams extends BaseListParams {
  search?: string;
  type?: string;
  isActive?: boolean;
}

export const equipmentCategoriesService = {
  // Admin Services
  async getAll(
    params: EquipmentCategoryListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<IEquipmentCategory[]>> {
    const res = await ApiService.get<IEquipmentCategory[]>(`${ADMIN_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<IEquipmentCategory> {
    const res = await ApiService.get<IEquipmentCategory>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateEquipmentCategoryForm, opts?: RequestOpts): Promise<IEquipmentCategory> {
    const res = await ApiService.post<IEquipmentCategory>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(
    id: Id,
    payload: Partial<TUpdateEquipmentCategoryForm>,
    opts?: RequestOpts,
  ): Promise<IEquipmentCategory> {
    const res = await ApiService.patch<IEquipmentCategory>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Public Services
  async getAllPublic(
    params: EquipmentCategoryListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<IEquipmentCategory[]>> {
    const res = await ApiService.get<IEquipmentCategory[]>(`${BASE}${toQS(params)}`, opts);
    return res;
  },
};
