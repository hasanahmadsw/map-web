import type { AuthResponse, LoginDTO } from "@/types/auth.types";
import type { Staff } from "@/types/staff.types";
import { ApiService } from "./base.service";

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const res = await ApiService.post<AuthResponse>("/login", credentials, {}, true);
    return res.data;
  },

  async getMe(): Promise<Staff> {
    const res = await ApiService.get<Staff>("/admin/staff/me");
    return res.data;
  },
};
