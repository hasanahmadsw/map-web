import type { CreateLanguageDTO, Language } from "@/types/language.types";
import { ApiService } from "./base.service";

const BASE = "/languages";

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
    const res = await ApiService.post<Language>(`${BASE}`, data);
    return res.data;
  },

  async update(code: string, data: Partial<Language>): Promise<Language> {
    const res = await ApiService.patch<Language>(`${BASE}/${code}`, data);
    return res.data;
  },

  async delete(code: string): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${code}`);
    return res.data;
  },
};
