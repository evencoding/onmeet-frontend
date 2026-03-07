import { notiApi } from "@/shared/api";
import {
  NotificationSettingSchema,
  NotificationResponseSchema,
} from "@/shared/schemas";
import { pageSchema } from "@/shared/schemas/pagination.schema";
import { pageableToParams } from "@/shared/types";
import type { Page } from "@/shared/types/pagination";

// ── Re-export shared types for backward compatibility ──
export type { NotificationType, ResourceType } from "@/shared/types/enums";
export type { SortObject, PageableObject, Pageable, Page } from "@/shared/types/pagination";
export type {
  NotificationSettingDto,
  NotificationResponseDto,
} from "@/shared/schemas/notification.schema";


// ── Request Types (feature-local) ──

export interface FcmTokenRequestDto {
  token: string;
  deviceId: string;
  deviceType: string;
}

// ── Backward-compat: PageNotificationResponseDto is now Page<NotificationResponseDto> ──
import type { NotificationResponseDto } from "@/shared/schemas/notification.schema";
export type PageNotificationResponseDto = Page<NotificationResponseDto>;

// ── Schemas for validation ──
const PageNotificationSchema = pageSchema(NotificationResponseSchema);

// ── API Functions ──

import type { NotificationSettingDto } from "@/shared/schemas/notification.schema";
import type { Pageable } from "@/shared/types/pagination";

export function getNotificationSettings(userId: number) {
  return notiApi<NotificationSettingDto>(`/v1/settings/${userId}`, {
    schema: NotificationSettingSchema,
  });
}

export function updateNotificationSettings(userId: number, data: NotificationSettingDto) {
  return notiApi<void>(`/v1/settings/${userId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerFcmToken(userId: string, data: FcmTokenRequestDto) {
  return notiApi<void>("/v1/fcm/token", {
    userId,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function unregisterFcmToken(userId: string, token: string) {
  const qs = new URLSearchParams({ token });
  return notiApi<void>(`/v1/fcm/token?${qs}`, {
    userId,
    method: "DELETE",
  });
}

export function getNotifications(userId: string, pageable?: Pageable) {
  const qs = pageableToParams(pageable);
  return notiApi<Page<NotificationResponseDto>>(
    `/v1/notifications${qs}`,
    {
      userId,
      schema: PageNotificationSchema,
    },
  );
}

export function getUnreadCount(userId: string) {
  return notiApi<{ unreadCount: number }>("/v1/notifications/unread/count", {
    userId,
  });
}

export function markAsRead(notificationId: number, userId: string) {
  return notiApi<void>(
    `/v1/notifications/${notificationId}/read`,
    { userId, method: "PATCH" },
  );
}

export function markAllAsRead(userId: string) {
  return notiApi<{ updatedCount: number }>("/v1/notifications/read/all", {
    userId,
    method: "PATCH",
  });
}

export function deleteNotification(notificationId: number, userId: string) {
  return notiApi<void>(
    `/v1/notifications/${notificationId}`,
    { userId, method: "DELETE" },
  );
}

export function deleteAllNotifications(userId: string) {
  return notiApi<void>("/v1/notifications/all", {
    userId,
    method: "DELETE",
  });
}
