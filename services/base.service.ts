import { helperNavigateTo } from '@/utils/navigation';
import { deleteCookie, getAuthHeader, myCookies } from '@/utils/cookies';

import type { ApiResponse, ApiError } from '@/types/common.types';

// Additional type definitions
interface FetchOptions extends RequestInit {
  signal?: AbortSignal;
}

interface ErrorResponse {
  error?: {
    message: string;
    error: string;
    statusCode: number;
  };
}

class ApiHttpError extends Error {
  public statusCode: number;
  public meta: Record<string, unknown>;
  public path: string;
  public method: string;
  public raw?: unknown;

  constructor(
    message: string,
    details: {
      statusCode: number;
      meta: Record<string, unknown>;
      path: string;
      method: string;
      raw?: unknown;
    },
  ) {
    super(message);
    this.name = 'ApiHttpError';
    this.statusCode = details.statusCode;
    this.meta = details.meta;
    this.path = details.path;
    this.method = details.method;
    this.raw = details.raw;
  }
}

// Utility functions
const resolveLang = (): 'en' | 'ar' => {
  const isBrowser = typeof window !== 'undefined';
  return isBrowser && window.location.pathname.startsWith('/ar') ? 'ar' : 'en';
};

const normalizeHeaders = (headers?: HeadersInit): Record<string, string> => {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return headers.reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
  return headers as Record<string, string>;
};

const hasEnvelope = (data: unknown): boolean => {
  return !!(data && typeof data === 'object' && data !== null && 'data' in data && 'message' in data);
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const authEndpoints = ['/auth/user/login'];

export class ApiService {
  public static async fetchApi<T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    const isBrowser = typeof window !== 'undefined';
    const lang = resolveLang();
    const isFormData = options.body instanceof FormData;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        signal: options.signal,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept-Language': lang,
          ...(withoutAuthHeader ? {} : await getAuthHeader()),
          ...options.headers,
        },
        ...(isBrowser ? {} : { cache: 'no-store' }),
        ...options,
      });

      const safeParse = async () => {
        if (response.status === 204) {
          return {
            data: null,
            message: 'No content',
            statusCode: 204,
            timestamp: new Date().toISOString(),
          };
        }
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          return { data: text };
        }
      };

      const data = await safeParse();

      if (!response.ok) {
        const error = data as ApiError;
        if (!authEndpoints.includes(endpoint) && response.status === 401) {
          if (typeof document !== 'undefined') {
            await deleteCookie(myCookies.auth);
            helperNavigateTo('/login');
          }
        }
        console.error(`API Error [${response.status}]`, {
          endpoint,
          method: options.method || 'GET',
          error,
          t: new Date().toISOString(),
        });
        throw {
          ...(error || {}),
          message: error?.message || response.statusText || 'Request failed',
        };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      // Important: Don't convert AbortError to UI error
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Let React Query handle it without toast
        throw error;
      }
      console.error(`Network/API Error:`, {
        endpoint,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : error,
        t: new Date().toISOString(),
      });
      if (typeof error === 'object' && error !== null) throw error;
      throw new Error('An unexpected error occurred');
    }
  }

  public static get<T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ) {
    return this.fetchApi<T>(endpoint, { ...options, method: 'GET' }, withoutAuthHeader);
  }
  public static post<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ) {
    return this.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      },
      withoutAuthHeader,
    );
  }
  public static patch<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ) {
    return this.fetchApi<T>(
      endpoint,
      { ...options, method: 'PATCH', body: JSON.stringify(body) },
      withoutAuthHeader,
    );
  }
  public static put<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ) {
    return this.fetchApi<T>(
      endpoint,
      { ...options, method: 'PUT', body: JSON.stringify(body) },
      withoutAuthHeader,
    );
  }
  public static delete<T>(
    endpoint: string,
    options: RequestInit & { signal?: AbortSignal } = {},
    withoutAuthHeader?: boolean,
  ) {
    return this.fetchApi<T>(endpoint, { ...options, method: 'DELETE' }, withoutAuthHeader);
  }

  public static async postWithProgress<T>(
    endpoint: string,
    body: unknown,
    onProgress?: (progress: number) => void,
    options: FetchOptions = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;

    const lang = resolveLang();

    const authHeaders = withoutAuthHeader ? {} : await getAuthHeader();
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept-Language': lang,
      ...authHeaders,
      ...normalizeHeaders(options.headers),
    };

    const url = `${API_URL}${endpoint}`;

    return new Promise<ApiResponse<T>>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let abortHandler: (() => void) | undefined;
      if (options.signal) {
        if (options.signal.aborted) {
          reject(
            new ApiHttpError('Request aborted', {
              statusCode: 0,
              meta: {
                message: 'Request aborted',
                statusCode: 0,
                timestamp: new Date().toISOString(),
                status: 'error',
                path: endpoint,
                method: 'POST',
              },
              path: endpoint,
              method: 'POST',
            }),
          );
          return;
        }
        abortHandler = () => {
          xhr.abort();
          reject(
            new ApiHttpError('Request aborted', {
              statusCode: 0,
              meta: {
                message: 'Request aborted',
                statusCode: 0,
                timestamp: new Date().toISOString(),
                status: 'error',
                path: endpoint,
                method: 'POST',
              },
              path: endpoint,
              method: 'POST',
            }),
          );
        };
        options.signal.addEventListener('abort', abortHandler, { once: true });
      }

      if (onProgress) {
        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', async () => {
        if (abortHandler && options.signal) {
          options.signal.removeEventListener('abort', abortHandler);
        }

        const status = xhr.status;
        const text = xhr.responseText || '';

        if (status === 204) {
          resolve({
            data: null as unknown as T,
            message: 'Success with no content',
            statusCode: 204,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        let parsed: unknown = null;
        if (text) {
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = { __raw: text };
          }
        }

        if (status >= 200 && status < 300) {
          if (hasEnvelope(parsed)) {
            resolve(parsed as ApiResponse<T>);
          } else {
            resolve({
              data: ((parsed as Record<string, unknown>)?.data ?? parsed) as T,
              message: 'OK',
              statusCode: status,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          const pathnameOnly = endpoint.split('?')[0];
          if (status === 401 && typeof document !== 'undefined' && !authEndpoints.includes(pathnameOnly)) {
            try {
              await deleteCookie(myCookies.auth);
              helperNavigateTo('/login');
            } catch {}
          }

          const apiErr = (parsed as ErrorResponse) || ({} as ErrorResponse);
          const parsedObj = parsed as Record<string, unknown>;
          const errorObj = parsedObj?.error as Record<string, unknown>;
          const message =
            (apiErr?.error?.message && String(apiErr.error.message)) ||
            (typeof errorObj?.message === 'string' ? String(errorObj.message) : 'Request failed');

          reject(
            new ApiHttpError(message, {
              statusCode: status,
              meta: {
                message,
                statusCode: status,
                timestamp: new Date().toISOString(),
                status: 'error',
                path: endpoint,
                method: 'POST',
              },
              path: endpoint,
              method: 'POST',
              raw: parsed,
            }),
          );
        }
      });

      xhr.addEventListener('error', () => {
        if (abortHandler && options.signal) {
          options.signal.removeEventListener('abort', abortHandler);
        }
        reject(
          new ApiHttpError('Network error', {
            statusCode: 0,
            meta: {
              message: 'Network error',
              statusCode: 0,
              timestamp: new Date().toISOString(),
              status: 'error',
              path: endpoint,
              method: 'POST',
            },
            path: endpoint,
            method: 'POST',
          }),
        );
      });

      xhr.open('POST', url);

      Object.entries(headers).forEach(([k, v]) => {
        if (v != null) xhr.setRequestHeader(k, String(v));
      });

      const payload = isFormData ? (body as FormData) : JSON.stringify(body ?? {});
      xhr.send(payload);
    });
  }
}
