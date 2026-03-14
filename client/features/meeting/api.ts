const ROOM_BASE_URL = "https://api.onmeet.cloud/api";

export async function roomFetch<T>(
  endpoint: string,
  userId: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${ROOM_BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      ...options?.headers,
    },
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

  const json = JSON.parse(text);
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success && json.error) throw json.error;
    return json.data as T;
  }
  return json as T;
}

export * from "./api/types";
export * from "./api/room";
export * from "./api/room-schedule";
export * from "./api/room-discovery";
export * from "./api/room-settings";
export * from "./api/participant";
export * from "./api/waiting-room";
export * from "./api/recording";
export * from "./api/invitation";
export * from "./api/screen-share";
export * from "./api/chat";
