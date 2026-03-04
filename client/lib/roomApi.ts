const ROOM_BASE_URL = "https://api.onmeet.cloud/api";

async function roomFetch<T>(
  endpoint: string,
  userId: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${ROOM_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "요청에 실패했습니다",
      status: res.status,
    }));
    throw error;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// =====================
// Types
// =====================

export interface JoinRoomRequest {
  displayName?: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export interface JoinRoomResponse {
  token: string;
  waitingRoom: boolean;
  roomName: string;
  participantName: string;
  isHost: boolean;
}

// =====================
// Room API
// =====================

export function joinRoom(
  roomId: string,
  userId: string,
  body?: JoinRoomRequest,
): Promise<JoinRoomResponse> {
  return roomFetch(`/rooms/${roomId}/join`, userId, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}
