import { ApiResponse, SortBy, SortOrder } from "@/types/common.types";
import { ApiService } from "./base.service";
import { ArticleStaffResponse, ArticleTranslation, Article } from "@/types/articles.types";
import type {
  TCreateArticleForm,
  TEditArticleForm,
  TCreateArticleTranslationForm,
  TEditArticleTranslationForm,
  TAutoTranslateArticleForm,
} from "@/schemas/articles.schemas";
import { toQS } from "@/utils/api-utils";

const BASE = "/articles";

type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };


const enc = (v: string | number) => encodeURIComponent(String(v));

type StaffListParams = {
  page?: number;
  limit?: number;
  search?: string;
  lang?: string;
  sort?: "createdAt" | "slug" | "name" | "publishedAt";
  order?: "asc" | "desc";
};

export const articlesService = {
  // Staff Services
  async getAllForStaff(
    params: StaffListParams = {},
    opts?: RequestOpts,
  ): Promise<ApiResponse<ArticleStaffResponse[]>> {
    const res = await ApiService.get<ArticleStaffResponse[]>(`${BASE}/staff${toQS(params)}`, opts);
    return res;
  },

  async getArticlesByLanguage(lang: string, opts?: RequestOpts): Promise<ApiResponse<ArticleStaffResponse[]>> {
    const res = await ApiService.get<ArticleStaffResponse[]>(
      `${BASE}/staff/language/${enc(lang)}`,
      opts,
    );
    return res;
  },

  async getById(id: Id, opts?: RequestOpts): Promise<ArticleStaffResponse> {
    const res = await ApiService.get<ArticleStaffResponse>(`${BASE}/staff/${enc(id)}`, opts);
    return res.data;
  },

  async create(payload: TCreateArticleForm, opts?: RequestOpts): Promise<ArticleStaffResponse> {
    const res = await ApiService.post<ArticleStaffResponse>(`${BASE}`, payload, opts);
    return res.data;
  },

  async update(id: Id, payload: TEditArticleForm, opts?: RequestOpts): Promise<ArticleStaffResponse> {
    const res = await ApiService.patch<ArticleStaffResponse>(`${BASE}/${enc(id)}`, payload, opts);
    return res.data;
  },

  async delete(id: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}`, opts);
    return res.data;
  },

  // Staff Translations
  async getArticleTranslations(id: Id, opts?: RequestOpts): Promise<ArticleTranslation[]> {
    const res = await ApiService.get<ArticleTranslation[]>(`${BASE}/${enc(id)}/translations`, opts);
    return res.data;
  },

  async createArticleTranslation(
    id: Id,
    payload: TCreateArticleTranslationForm,
    opts?: RequestOpts,
  ): Promise<ArticleTranslation> {
    const res = await ApiService.post<ArticleTranslation>(`${BASE}/${enc(id)}/translations`, payload, opts);
    return res.data;
  },

  async updateArticleTranslation(
    id: Id,
    translationId: Id,
    payload: TEditArticleTranslationForm,
    opts?: RequestOpts,
  ): Promise<ArticleTranslation> {
    const res = await ApiService.patch<ArticleTranslation>(
      `${BASE}/${enc(id)}/translations/${enc(translationId)}`,
      payload,
      opts,
    );
    return res.data;
  },

  async deleteArticleTranslation(id: Id, translationId: Id, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.delete<void>(`${BASE}/${enc(id)}/translations/${enc(translationId)}`, opts);
    return res.data;
  },

  async autoTranslateArticle(id: Id, payload: TAutoTranslateArticleForm, opts?: RequestOpts): Promise<void> {
    const res = await ApiService.post<void>(`${BASE}/${enc(id)}/translations/auto`, payload, opts);
    return res.data;
  },

  // Upload picture
  async uploadPicture(file: File, opts?: RequestOpts): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    const res = await ApiService.post<{ url: string }>(`${BASE}/upload-picture`, formData, {
      ...opts,
    });
    return res.data;
  },

  // Public Services
  async getAll(
    payload: {
      lang: string
      search?: string
      page?: number
      limit?: number
      sortBy?: SortBy
      sortOrder?: SortOrder
      topicId?: string
      tagId?: string
    },
    opts?: RequestOpts,
  ): Promise<ApiResponse<Article[]>> {
    const res = await ApiService.get<Article[]>(`/articles/published${toQS(payload)}`, opts);
    return res;
  },

  async getBySlug(slug: string, lang: string, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.get<Article>(`${BASE}/slug/${enc(slug)}?lang=${enc(lang)}`, opts);
    return res.data;
  },
};
