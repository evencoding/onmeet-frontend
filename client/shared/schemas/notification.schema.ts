import { z } from "zod";

export const NotificationSettingSchema = z.object({
  doNotDisturbStartTime: z.string().optional(),
  doNotDisturbEndTime: z.string().optional(),
  isPushEnabled: z.boolean().optional(),
  isMeetingInviteNotification: z.boolean().optional(),
  isMeetingStartNotification: z.boolean().optional(),
  isMeetingRemindNotification: z.boolean().optional(),
  isMinutesCompletedNotification: z.boolean().optional(),
  isSystemNoticeNotification: z.boolean().optional(),
  isDoNotDisturbEnabled: z.boolean().optional(),
});
export type NotificationSettingDto = z.infer<typeof NotificationSettingSchema>;

export const NotificationResponseSchema = z.object({
  id: z.number(),
  type: z.enum([
    "MEETING_CREATED",
    "MEETING_TODAY",
    "MEETING_STARTED",
    "TEAM_MEMBER_ADDED",
    "SYSTEM",
    "EVENT",
    "MEETING_INVITATION",
    "INVITATION_ACCEPTED",
    "INVITATION_DECLINED",
    "INVITATION_CANCELLED",
    "PARTICIPANT_KICKED",
    "WAITING_ROOM_ADMITTED",
    "WAITING_ROOM_REJECTED",
    "PARTICIPANT_JOINED_NOTIFY",
    "SCHEDULE_CREATED",
    "SCHEDULE_CHANGED",
    "SCHEDULE_CANCELLED",
    "MEETING_REMINDER",
  ]),
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  deeplink: z.string().nullable(),
  createdAt: z.string(),
  scheduledAt: z.string().nullable(),
  resourceType: z.enum(["MEETING", "MINUTES", "TEAM", "NOTICE", "EVENT"]),
  dedupeKey: z.string().nullable(),
  resourceId: z.string(),
  actorUserId: z.number().nullable(),
});
export type NotificationResponseDto = z.infer<typeof NotificationResponseSchema>;
