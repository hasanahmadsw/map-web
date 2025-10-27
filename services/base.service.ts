import type { ApiResponse, ErrorResponse } from "@/types/common.types";
import { deleteCookie, getAuthHeader, myCookies } from "@/utils/cookies";
import { helperNavigateTo } from "@/utils/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const authEndpoints = ["/staff/login"];

class ApiHttpError extends Error {
  statusCode: number;
  meta?: ApiResponse<unknown>["meta"];
  path?: string;
  method?: string;
  raw?: unknown;

  constructor(
    message: string,
    opts: { statusCode: number; meta?: ApiResponse<unknown>["meta"]; path?: string; method?: string; raw?: unknown },
  ) {
    super(message);
    this.name = "ApiHttpError";
    this.statusCode = opts.statusCode;
    this.meta = opts.meta;
    this.path = opts.path;
    this.method = opts.method;
    this.raw = opts.raw;
  }
}

type FetchOptions = RequestInit & {
  signal?: AbortSignal;
};

export class ApiService {
  private static buildHeaders = async (options: RequestInit, withoutAuthHeader?: boolean, isFormData?: boolean) => {
    const authHeader = withoutAuthHeader ? {} : await getAuthHeader();
    return {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "en",
      ...authHeader,
      ...options.headers,
    } as HeadersInit;
  };

  private static async parseJsonSafe(res: Response) {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { __raw: text };
    }
  }

  public static async fetchApi<T>(
    endpoint: string,
    options: FetchOptions = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const headers = await ApiService.buildHeaders(options, withoutAuthHeader, isFormData);

    // don't send body if it's undefined
    const body =
      options.body instanceof FormData
        ? options.body
        : options.body === undefined
          ? undefined
          : typeof options.body === "string"
            ? options.body
            : JSON.stringify(options.body);

    const reqInit: RequestInit = {
      ...options,
      headers,
      body,
      ...(typeof window === "undefined" ? { cache: "no-store" } : {}),
    };

    let response: Response | null = null;

    try {
      response = await fetch(url, reqInit);

      // 204: fill the unified envelope
      if (response.status === 204) {
        const meta = {
          message: "Success with no content",
          statusCode: 204,
          timestamp: new Date().toISOString(),
          path: endpoint,
          method: (options.method || "GET").toString(),
          status: "success" as const,
        };
        return { data: null as unknown as T, meta };
      }

      const data = await ApiService.parseJsonSafe(response);

      if (!response.ok) {
        const pathnameOnly = endpoint.split("?")[0];
        if (!authEndpoints.includes(pathnameOnly) && response.status === 401) {
          if (typeof document !== "undefined") {
            await deleteCookie(myCookies.auth);
            helperNavigateTo("/login");
          }
        }
        const apiErr = (data as ErrorResponse) || ({} as ErrorResponse);
        const message =
          apiErr?.error?.message ||
          apiErr?.error?.message ||
          (typeof (data as any)?.error?.message === "string" ? (data as any).error.message : "Request failed");

        throw new ApiHttpError(message, {
          statusCode: response.status,
          meta: {
            message,
            statusCode: response.status,
            timestamp: new Date().toISOString(),
            status: "error",
            path: endpoint,
            method: (options.method || "GET").toString(),
          },
          path: endpoint,
          method: (options.method || "GET").toString(),
          raw: data,
        });
      }

      // success: we expect envelope { data, meta }. if the server didn't send meta, we generate it.
      const hasMeta = data && typeof data === "object" && "meta" in (data as any) && "data" in (data as any);
      if (hasMeta) {
        return data as ApiResponse<T>;
      } else {
        const fallback: ApiResponse<T> = {
          data: (data?.data ?? data) as T,
          meta: {
            message: "OK",
            statusCode: response.status,
            timestamp: new Date().toISOString(),
            status: "success",
            path: endpoint,
            method: (options.method || "GET").toString(),
          },
        };
        return fallback;
      }
    } catch (err: any) {
      // network/abort/json errors
      if (err instanceof ApiHttpError) throw err;

      const isAbort = err?.name === "AbortError";
      const message = isAbort ? "Request aborted" : err?.message || "An unexpected error occurred";

      throw new ApiHttpError(message, {
        statusCode: response?.status ?? 0,
        meta: {
          message,
          statusCode: response?.status ?? 0,
          timestamp: new Date().toISOString(),
          status: "error",
          path: endpoint,
          method: (options.method || "GET").toString(),
        },
        path: endpoint,
        method: (options.method || "GET").toString(),
        raw: err,
      });
    }
  }

  public static get<T>(endpoint: string, options: FetchOptions = {}, withoutAuthHeader?: boolean) {
    return ApiService.fetchApi<T>(endpoint, { ...options, method: "GET" }, withoutAuthHeader);
  }

  public static post<T>(endpoint: string, body?: unknown, options: FetchOptions = {}, withoutAuthHeader?: boolean) {
    return ApiService.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: body as BodyInit | null | undefined, // will be printed in fetchApi (FormData/JSON/undefined)
      },
      withoutAuthHeader,
    );
  }

  public static patch<T>(endpoint: string, body?: unknown, options: FetchOptions = {}, withoutAuthHeader?: boolean) {
    return ApiService.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: body as BodyInit | null | undefined, // don't force JSON.stringify here—leave it to the unified layer
      },
      withoutAuthHeader,
    );
  }

  public static put<T>(endpoint: string, body?: unknown, options: FetchOptions = {}, withoutAuthHeader?: boolean) {
    return ApiService.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: body as BodyInit | null | undefined,
      },
      withoutAuthHeader,
    );
  }

  public static delete<T>(endpoint: string, options: FetchOptions = {}, withoutAuthHeader?: boolean) {
    return ApiService.fetchApi<T>(endpoint, { ...options, method: "DELETE" }, withoutAuthHeader);
  }
}
