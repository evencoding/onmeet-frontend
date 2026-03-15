import { pageQs, type Pageable, type Page } from "@/shared/utils/api";
import { createServiceFetch } from "@/shared/utils/apiFetch";

const NOTI_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ""}/notification`;

const notiFetch = createServiceFetch(NOTI_BASE_URL);

// ── Types ──

export type NotificationType =
  | "MEETING_CREATED"
  | "MEETING_TODAY"
  | "MEETING_STARTED"
  | "TEAM_MEMBER_ADDED"
  | "SYSTEM"
  | "EVENT"
  | "MEETING_INVITATION"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "INVITATION_CANCELLED"
  | "PARTICIPANT_KICKED"
  | "WAITING_ROOM_ADMITTED"
  | "WAITING_ROOM_REJECTED"
  | "PARTICIPANT_JOINED_NOTIFY"
  | "SCHEDULE_CREATED"
  | "SCHEDULE_CHANGED"
  | "SCHEDULE_CANCELLED"
  | "MEETING_REMINDER";

export type ResourceType = "MEETING" | "MINUTES" | "TEAM" | "NOTICE" | "EVENT";

export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface NotificationSettingDto {
  doNotDisturbStartTime?: LocalTime;
  doNotDisturbEndTime?: LocalTime;
  pushEnabled?: boolean;
  meetingInviteNotification?: boolean;
  meetingStartNotification?: boolean;
  meetingRemindNotification?: boolean;
  minutesCompletedNotification?: boolean;
  systemNoticeNotification?: boolean;
  doNotDisturbEnabled?: boolean;
}

export interface FcmTokenRequestDto {
  token: string;
  deviceId: string;
  deviceType: string;
}

export interface NotificationResponseDto {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  deeplink: string;
  createdAt: string;
  scheduledAt: string;
  resourceType: ResourceType;
  dedupeKey: string;
  resourceId: string;
  actorUserId: number;
  read: boolean;
}

export type PageNotificationResponseDto = Page<NotificationResponseDto>;

export type UnreadCountResponse = Record<string, number>;

export function getUnreadTotal(data: UnreadCountResponse): number {
  return Object.values(data).reduce((sum, v) => sum + v, 0);
}

// ── API Functions ──

export function getNotificationSettings(userId: number) {
  return notiFetch<NotificationSettingDto>(
    `/v1/settings/${userId}`,
    String(userId),
  );
}

export function updateNotificationSettings(userId: number, data: NotificationSettingDto) {
  return notiFetch<void>(`/v1/settings/${userId}`, String(userId), {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerFcmToken(userId: string, data: FcmTokenRequestDto) {
  return notiFetch<void>("/v1/fcm/token", userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function unregisterFcmToken(userId: string, token: string) {
  const qs = new URLSearchParams({ token });
  return notiFetch<void>(`/v1/fcm/token?${qs}`, userId, {
    method: "DELETE",
  });
}

export function getNotifications(userId: string, pageable?: Pageable) {
  return notiFetch<PageNotificationResponseDto>(
    `/v1/notifications${pageQs(pageable)}`,
    userId,
  );
}

export function getUnreadCount(userId: string) {
  return notiFetch<UnreadCountResponse>("/v1/notifications/unread/count", userId);
}

export function markAsRead(notificationId: number, userId: string) {
  return notiFetch<void>(
    `/v1/notifications/${notificationId}/read`,
    userId,
    { method: "PATCH" },
  );
}

export function markAllAsRead(userId: string) {
  return notiFetch<UnreadCountResponse>("/v1/notifications/read/all", userId, {
    method: "PATCH",
  });
}

export function deleteNotification(notificationId: number, userId: string) {
  return notiFetch<void>(
    `/v1/notifications/${notificationId}`,
    userId,
    { method: "DELETE" },
  );
}

export function deleteAllNotifications(userId: string) {
  return notiFetch<void>("/v1/notifications/all", userId, {
    method: "DELETE",
  });
}
