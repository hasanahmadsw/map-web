import { PaginatedResponse, SortBy, SortOrder } from "@/types/common.types";
import { ApiService } from "./base.service";
import { ArticleStaffResponse, ArticleTranslation, Article } from "@/types/articles.types";
import type {
  TCreateArticleForm,
  TEditArticleForm,
  TCreateArticleTranslationForm,
  TEditArticleTranslationForm,
  TAutoTranslateArticleForm,
} from "@/schemas/articles.schemas";

const BASE = "/articles";

type Id = number;
type RequestOpts = { signal?: AbortSignal; headers?: Record<string, string> };

const toQS = (params: Record<string, unknown>) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? `?${new URLSearchParams(entries as any).toString()}` : "";
};

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
  ): Promise<PaginatedResponse<ArticleStaffResponse>> {
    const qs = toQS(params);
    const res = await ApiService.get<PaginatedResponse<ArticleStaffResponse>>(`${BASE}/staff${qs}`, opts);
    return res as unknown as PaginatedResponse<ArticleStaffResponse>;
  },

  async getArticlesByLanguage(lang: string, opts?: RequestOpts): Promise<PaginatedResponse<ArticleStaffResponse>> {
    const res = await ApiService.get<PaginatedResponse<ArticleStaffResponse>>(
      `${BASE}/staff/language/${enc(lang)}`,
      opts,
    );
    return res as unknown as PaginatedResponse<ArticleStaffResponse>;
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
  ): Promise<PaginatedResponse<Article>> {
    const res = await ApiService.get<PaginatedResponse<Article>>(`/articles/published${toQS(payload)}`, opts);
    return res as unknown as PaginatedResponse<Article>;
  },

  async getBySlug(slug: string, lang: string, opts?: RequestOpts): Promise<Article> {
    const res = await ApiService.get<Article>(`${BASE}/slug/${enc(slug)}?lang=${enc(lang)}`, opts);
    return res.data;
  },
};
