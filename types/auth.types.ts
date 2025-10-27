import type { Staff } from "./staff.types";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  staff: Staff;
}
