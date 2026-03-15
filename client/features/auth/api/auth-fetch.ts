import { parseResponseBody } from "@/shared/utils/apiFetch";

const AUTH_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/auth`;

let refreshPromise: Promise<void> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/v1/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function authFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options?.headers,
  };

  const doFetch = () =>
    fetch(`${AUTH_BASE_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers,
    });

  let res = await doFetch();

  if (res.status === 401 && !endpoint.includes("/v1/refresh") && !endpoint.includes("/v1/login")) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().then((ok) => {
        refreshPromise = null;
        if (!ok) throw new Error("refresh_failed");
      });
    }
    try {
      await refreshPromise;
      res = await doFetch();
    } catch {
      // refresh failed — fall through to error below
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "요청에 실패했습니다",
      status: res.status,
    }));
    throw error;
  }

  return parseResponseBody<T>(await res.text());
}

export function buildFormData<T>(data: T, profileImage?: File): FormData {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  return formData;
}
