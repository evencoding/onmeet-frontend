import { z } from "zod";

export const LocalTimeSchema = z.object({
  hour: z.number(),
  minute: z.number(),
  second: z.number(),
  nano: z.number(),
});
export type LocalTimeDto = z.infer<typeof LocalTimeSchema>;

export const NotificationSettingSchema = z.object({
  doNotDisturbStartTime: LocalTimeSchema.optional(),
  doNotDisturbEndTime: LocalTimeSchema.optional(),
  pushEnabled: z.boolean().optional(),
  meetingInviteNotification: z.boolean().optional(),
  meetingStartNotification: z.boolean().optional(),
  meetingRemindNotification: z.boolean().optional(),
  minutesCompletedNotification: z.boolean().optional(),
  systemNoticeNotification: z.boolean().optional(),
  doNotDisturbEnabled: z.boolean().optional(),
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
  deeplink: z.string(),
  createdAt: z.string(),
  scheduledAt: z.string(),
  resourceType: z.enum(["MEETING", "MINUTES", "TEAM", "NOTICE", "EVENT"]),
  dedupeKey: z.string(),
  resourceId: z.string(),
  actorUserId: z.number(),
});
export type NotificationResponseDto = z.infer<typeof NotificationResponseSchema>;
