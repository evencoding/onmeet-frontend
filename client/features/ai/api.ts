const AI_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/ai`;

async function aiFetch<T>(
  endpoint: string,
  userId: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${AI_BASE_URL}${endpoint}`, {
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

// ── Types ──

export type MinutesStatus = "GENERATED" | "EDITED_BY_USER" | "REGENERATING" | "FAILED";

export interface MinutesResponse {
  id: number;
  roomId: number;
  transcriptId: string;
  transcriptS3Key: string;
  summaryS3Key: string;
  summaryJson: string;
  userEditedSummaryJson: string | null;
  status: MinutesStatus;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MinutesPatchRequest {
  userEditedSummaryJson: string;
}

export interface MinutesRegenerateRequest {
  language?: string;
  style?: string;
  model?: string;
}

export interface TranscriptResponse {
  roomId: number;
  transcript: string;
  createdAt: string;
}

// ── API Functions ──

export function getMinutes(
  roomId: number,
  userId: string,
): Promise<MinutesResponse> {
  return aiFetch(`/v1/rooms/${roomId}/minutes`, userId);
}

export function regenerateMinutes(
  roomId: number,
  userId: string,
  data?: MinutesRegenerateRequest,
): Promise<MinutesResponse> {
  return aiFetch(`/v1/rooms/${roomId}/minutes/regenerate`, userId, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function updateMinutes(
  roomId: number,
  userId: string,
  data: MinutesPatchRequest,
): Promise<MinutesResponse> {
  return aiFetch(`/v1/rooms/${roomId}/minutes`, userId, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function getTranscript(
  roomId: number,
  userId: string,
): Promise<TranscriptResponse> {
  return aiFetch(`/v1/rooms/${roomId}/transcript`, userId);
}
