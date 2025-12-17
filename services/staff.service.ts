import type { ApiResponse } from '@/types/common.types';
import type { Role, Staff } from '@/types/staff.types';
import { ApiService } from './base.service';
import { toQS } from '@/utils/api-utils';
import { TCreateStaffForm } from '@/validations/staff/create-staff.schema';
import { TEditStaffForm } from '@/validations/staff/edit-staff.schema';
import type { TUpdateMeForm } from '@/validations/staff/update-me.schema';

const BASE = '/staff';
const ADMIN_BASE = '/admin/staff';
type Id = string | number;

type RequestOpts = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  sort?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
};

const encId = (id: Id) => encodeURIComponent(String(id));

export const staffService = {
  async create(payload: TCreateStaffForm, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.post<Staff>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async getAll(params: GetAllParams = {}, opts?: RequestOpts): Promise<ApiResponse<Staff[]>> {
    const res = await ApiService.get<Staff[]>(`${ADMIN_BASE}${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.get<Staff>(`${ADMIN_BASE}/${encId(id)}`, opts);
    return res.data;
  },

  async update(id: Id, payload: Partial<TEditStaffForm> | FormData, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.patch<Staff>(`${ADMIN_BASE}/${encId(id)}`, payload, opts);
    return res.data;
  },

  async updateMe(payload: UpdateMePayload, opts?: RequestOpts): Promise<Staff> {
    const res = await ApiService.patch<Staff>(`${ADMIN_BASE}/me`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${encId(id)}`, opts);
    return res.data;
  },

  // Upload picture
  async uploadPicture(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    // Backend expects the binary under the "picture" key
    formData.append('picture', file, file.name);

    const res = await ApiService.post<{ url: string }>(`${ADMIN_BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },
};

type UpdateMePayload = Partial<Omit<TUpdateMeForm, 'confirmPassword'>>;
