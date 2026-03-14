const NOTI_BASE_URL = "https://api.onmeet.cloud/notification";

async function notiFetch<T>(
  endpoint: string,
  userId?: string,
  options?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  if (userId) {
    headers["X-User-Id"] = userId;
  }

  const res = await fetch(`${NOTI_BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
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

  const json = JSON.parse(text);
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success && json.error) throw json.error;
    return json.data as T;
  }
  return json as T;
}

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

export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject[];
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface PageNotificationResponseDto {
  totalPages: number;
  totalElements: number;
  size: number;
  content: NotificationResponseDto[];
  number: number;
  sort: SortObject[];
  numberOfElements: number;
  pageable: PageableObject;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

// ── API Functions ──

export function getNotificationSettings(userId: number) {
  return notiFetch<NotificationSettingDto>(
    `/v1/settings/${userId}`,
  );
}

export function updateNotificationSettings(userId: number, data: NotificationSettingDto) {
  return notiFetch<void>(`/v1/settings/${userId}`, undefined, {
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
  const qs = new URLSearchParams();
  if (pageable?.page !== undefined) qs.set("page", String(pageable.page));
  if (pageable?.size !== undefined) qs.set("size", String(pageable.size));
  if (pageable?.sort) pageable.sort.forEach((s) => qs.append("sort", s));
  const str = qs.toString();
  return notiFetch<PageNotificationResponseDto>(
    `/v1/notifications${str ? `?${str}` : ""}`,
    userId,
  );
}

export function getUnreadCount(userId: string) {
  return notiFetch<Record<string, number>>("/v1/notifications/unread/count", userId);
}

export function markAsRead(notificationId: number, userId: string) {
  return notiFetch<void>(
    `/v1/notifications/${notificationId}/read`,
    userId,
    { method: "PATCH" },
  );
}

export function markAllAsRead(userId: string) {
  return notiFetch<Record<string, number>>("/v1/notifications/read/all", userId, {
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
