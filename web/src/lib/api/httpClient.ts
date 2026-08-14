import { API_BASE_URL } from "./config";
import type { ApiEnvelope } from "./types";

const ACCESS_TOKEN_STORAGE_KEY = "kpt.accessToken";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public resultCode?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

interface RequestOptions {
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * K-PT Apartment API(docs/api-docs.json)의 공통 응답 포맷
 * ({ resultCode, message, data })을 처리하는 저수준 요청 함수.
 * HTTP 상태가 실패(4xx/5xx)면 응답 바디의 message를 담아 ApiError를 던집니다.
 */
async function request<T>(
  path: string,
  init: RequestInit & RequestOptions = {}
): Promise<T> {
  const { params, signal, ...rest } = init;
  const url = buildUrl(path, params);
  const token = getAccessToken();

  const res = await fetch(url, {
    ...rest,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers ?? {}),
    },
  });

  let body: ApiEnvelope<T> | undefined;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? `요청 실패: ${res.status}`,
      res.status,
      body?.resultCode
    );
  }

  return body!.data;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
