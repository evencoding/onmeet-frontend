/**
 * Zod Schemas — API 응답의 런타임 타입 검증.
 *
 * TypeScript는 컴파일 타임에만 타입을 검사한다.
 * 백엔드 스키마가 변경되면 `as T` 캐스팅은 잘못된 데이터를 그대로 통과시킨다.
 * Zod 스키마로 런타임에 응답 구조를 검증하면 이 문제를 조기에 발견할 수 있다.
 *
 * @example
 * // 기존: 타입 캐스팅 (런타임 검증 없음)
 * const data = await apiFetch<UserResponseDto>(url);
 *
 * // 개선: Zod 검증 (런타임 안전)
 * const data = await safeFetch(url, options, UserResponseSchema);
 */

import { z } from "zod/v4";

// ── Auth Schemas ──

export const CompanyInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TeamInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string().optional(),
  status: z.string().optional(),
});

export const JobTitleSchema = z.object({
  id: z.number(),
  name: z.string(),
  isDefault: z.boolean(),
});

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  employeeId: z.string().optional(),
  roles: z.array(z.string()),
  status: z.string(),
  company: CompanyInfoSchema.optional(),
  jobTitle: JobTitleSchema.optional(),
  teams: z.array(TeamInfoSchema),
  profileImageId: z.number().optional(),
  isPasswordReset: z.boolean(),
});

export const LoginResponseSchema = z.object({
  message: z.string(),
  tokenType: z.string(),
});

export const InvitationResponseSchema = z.object({
  email: z.string(),
  companyName: z.string(),
  role: z.enum(["USER", "ADMIN", "MANAGER"]),
});

// ── Meeting Schemas ──

const RoomStatusSchema = z.enum(["WAITING", "ACTIVE", "ENDED", "CANCELLED"]);
const RoomTypeSchema = z.enum(["INSTANT", "SCHEDULED", "RECURRING"]);
const AccessScopeSchema = z.enum(["ALL", "TEAM", "INDIVIDUAL_INVITE"]);

export const MeetingRoomResponseSchema = z.object({
  id: z.number(),
  roomCode: z.string(),
  title: z.string(),
  description: z.string(),
  hostUserId: z.number(),
  status: RoomStatusSchema,
  type: RoomTypeSchema,
  accessScope: AccessScopeSchema,
  teamId: z.number(),
  maxParticipants: z.number(),
  locked: z.boolean(),
  scheduledAt: z.string(),
  startedAt: z.string(),
  endedAt: z.string(),
  durationSeconds: z.number(),
  createdAt: z.string(),
});

export const RoomJoinResponseSchema = z.object({
  token: z.string(),
  livekitUrl: z.string(),
  roomName: z.string(),
  waitingRoom: z.boolean(),
  warnings: z.array(z.string()).optional(),
});

// ── AI Schemas ──

const MinutesStatusSchema = z.enum(["GENERATED", "EDITED_BY_USER", "REGENERATING", "FAILED"]);

const SummaryResultSchema = z.object({
  description: z.string().nullable(),
  keywords: z.array(z.string()).nullable(),
  decisions: z.array(z.string()).nullable(),
  actionItems: z.array(z.string()).nullable(),
});

export const MinutesResponseSchema = z.object({
  id: z.number(),
  roomId: z.number(),
  transcriptId: z.string(),
  summaryS3Key: z.string(),
  summary: SummaryResultSchema.nullable(),
  summaryJson: z.string(),
  userEditedSummaryJson: z.string().nullable(),
  status: MinutesStatusSchema,
  lastError: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TranscriptResponseSchema = z.object({
  roomId: z.number(),
  transcript: z.string(),
  createdAt: z.string(),
});

// ── 검증 유틸리티 ──

/**
 * Zod 스키마로 데이터를 검증하고, 실패 시 콘솔에 경고를 남기되
 * 데이터는 그대로 반환한다 (graceful degradation).
 *
 * 프로덕션에서 스키마 불일치로 앱이 크래시되는 것을 방지하면서도,
 * 개발 중에는 스키마 차이를 즉시 발견할 수 있다.
 */
export function validateResponse<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context?: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[Schema Validation] ${context ?? "Unknown"}: 응답이 예상 스키마와 다릅니다`,
      result.error.issues,
    );
    // Graceful: 데이터를 그대로 반환 (프로덕션에서 크래시 방지)
    return data as T;
  }
  return result.data;
}

/**
 * createServiceFetch와 함께 사용하는 검증 래퍼.
 *
 * @example
 * const user = validateResponse(UserResponseSchema, rawData, "getMe");
 */
