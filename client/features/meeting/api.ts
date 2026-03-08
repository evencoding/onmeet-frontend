import { roomApi } from "@/shared/api";
import type { FetchOptions } from "@/shared/api";

/**
 * Backward-compatible roomFetch wrapper around the shared roomApi.
 * Sub-API modules import this; the `userId` param becomes the X-User-Id header.
 */
export async function roomFetch<T>(
  endpoint: string,
  userId: string,
  options?: RequestInit,
): Promise<T> {
  return roomApi<T>(endpoint, {
    ...options,
    userId,
  } as FetchOptions);
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
