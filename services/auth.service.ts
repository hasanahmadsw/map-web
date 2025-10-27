import type { AuthResponse, LoginDTO } from "@/types/auth.types";
import type { Staff } from "@/types/staff.types";
import { ApiService } from "./base.service";

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>("/staff/login", credentials, {}, true);
    return response.data;
  },

  async getMe(): Promise<Staff> {
    try {
      const response = await ApiService.get<Staff>("/staff/me");
      return response.data;
    } catch (error) {
      console.error("Get user data error:", error);
      throw error;
    }
  },
};
