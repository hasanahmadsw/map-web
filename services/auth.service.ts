import { ApiService } from './base.service';
import type { AuthResponse, LoginDTO } from '@/types/auth.types';

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const res = await ApiService.post<AuthResponse>('/login', credentials, {}, true);
    return res.data;
  },
};
