import type { z } from "zod";

const IS_DEV = import.meta.env.DEV;

export interface FetcherConfig {
  baseUrl: string;
  /** Unwrap `{ success, data, error }` envelope (Video API) */
  unwrapEnvelope?: boolean;
}

export interface FetchOptions<S extends z.ZodType = z.ZodType> extends RequestInit {
  /** Zod schema for runtime response validation */
  schema?: S;
  /** X-User-Id header value */
  userId?: string;
}

export type Fetcher = <T>(endpoint: string, options?: FetchOptions) => Promise<T>;

export function createFetcher(config: FetcherConfig): Fetcher {
  const { baseUrl, unwrapEnvelope = false } = config;

  return async function fetcher<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const { schema, userId, ...init } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) ?? {}),
    };
    if (userId) {
      headers["X-User-Id"] = userId;
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
      credentials: "include",
      ...init,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        message: "요청에 실패했습니다",
        status: res.status,
      }));
      throw error;
    }

    const text = await res.text();
    if (!text) return {} as T;

    let data = JSON.parse(text);

    // Unwrap Video API envelope
    if (unwrapEnvelope && data && typeof data === "object" && "success" in data) {
      if (!data.success && data.error) throw data.error;
      data = data.data;
    }

    // Runtime validation
    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        if (IS_DEV) {
          console.error("[Zod validation error]", endpoint, result.error.issues);
          throw new Error(
            `Zod validation failed for ${endpoint}: ${result.error.message}`,
          );
        } else {
          console.warn("[Zod validation warning]", endpoint, result.error.issues);
        }
      }
    }

    return data as T;
  };
}
