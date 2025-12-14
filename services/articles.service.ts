import { ApiResponse } from "@/types/common.types";
import { ApiService } from "./base.service";
import { Article, ArticleListParams } from "@/types/articles.types";
import type {
  TCreateArticleForm,
  TEditArticleForm,
} from "@/schemas/articles.schemas";
import { toQS } from "@/utils/api-utils";

const BASE = "/articles";
const ADMIN_BASE = "/admin/articles";
type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };


const enc = (v: string | number) => encodeURIComponent(String(v));



export const articlesService = {
  // Staff Services
  async getAllForStaff(
    params: ArticleListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<Article[]>> {
    const res = await ApiService.get<Article[]>(`${ADMIN_BASE}/${toQS(params)}`, opts);
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.get<Article>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateArticleForm, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.post<Article>(`${ADMIN_BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: TEditArticleForm, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.patch<Article>(`${ADMIN_BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${ADMIN_BASE}/${enc(id)}`, opts);
    return res.data;
  },


  // Upload picture
  async uploadPicture(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    const res = await ApiService.post<{ url: string }>(`${ADMIN_BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },

  // Public Services
  async getAll(
    params: ArticleListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<Article[]>> {
    const res = await ApiService.get<Article[]>(`/articles/published${toQS(params)}`, opts);
    return res;
  },

  async getBySlug(slug: string, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.get<Article>(`${BASE}/slug/${enc(slug)}`, opts);
    return res.data;
  },
};
