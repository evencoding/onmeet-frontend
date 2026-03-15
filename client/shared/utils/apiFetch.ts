/**
 * Shared fetch utilities.
 *
 * Backend wraps successful responses in `{ success: true, data: T }`.
 * These helpers unify error handling and response parsing across
 * auth / video / ai services.
 */

// ── Error helpers ──

export function getErrorMessage(err: unknown, fallback = "요청에 실패했습니다"): string {
  if (err && typeof err === "object" && "message" in err) {
    return (err as { message: string }).message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

// ── Response parsing ──

export function parseResponseBody<T>(text: string): T {
  if (!text) return {} as T;

  const json = JSON.parse(text);
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success && json.error) throw json.error;
    return json.data as T;
  }
  return json as T;
}

// ── Core fetch ──

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "요청에 실패했습니다",
      status: res.status,
    }));
    throw error;
  }

  return parseResponseBody<T>(await res.text());
}

// ── Service fetch factory ──
// Creates a typed fetch function scoped to a service base URL.
// Automatically sets Content-Type (skipped for FormData) and X-User-Id.

export function createServiceFetch(baseUrl: string) {
  return async function serviceFetch<T>(
    endpoint: string,
    userId: string,
    options?: RequestInit,
  ): Promise<T> {
    const isFormData = options?.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(userId ? { "X-User-Id": userId } : {}),
      ...(options?.headers as Record<string, string>),
    };

    return apiFetch<T>(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  };
}
