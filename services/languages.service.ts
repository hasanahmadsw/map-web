import type { CreateLanguageDTO, Language } from "@/types/language.types";
import { ApiService } from "./base.service";

const BASE = "/languages";
const ADMIN_BASE = "/admin/languages";

export const languagesService = {
  async getLanguages(): Promise<Language[]> {
    const res = await ApiService.get<Language[]>(`${BASE}`);
    return res.data;
  },

  async getLanguageByCode(code: string): Promise<Language> {
    const res = await ApiService.get<Language>(`${BASE}/${code}`);
    return res.data;
  },

  async create(data: CreateLanguageDTO): Promise<Language> {
    const res = await ApiService.post<Language>(`${ADMIN_BASE}`, data);
    return res.data;
  },

  async update(code: string, data: Partial<Language>): Promise<Language> {
    const res = await ApiService.patch<Language>(`${ADMIN_BASE}/${code}`, data);
    return res.data;
  },

  async delete(code: string): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${code}`);
    return res.data;
  },
};
