/**
 * Branded Types — 의미적으로 다른 ID를 컴파일 타임에 구분한다.
 *
 * UserId와 RoomId가 모두 number이지만, 브랜드 타입을 쓰면
 * joinRoom(roomId, userId) 호출 시 인자 순서가 뒤바뀌면 컴파일 에러가 난다.
 *
 * @example
 * const userId = 42 as UserId;
 * const roomId = 7 as RoomId;
 *
 * function joinRoom(roomId: RoomId, userId: UserId) { ... }
 * joinRoom(userId, roomId); // TS Error!
 */

declare const __brand: unique symbol;

/** 브랜드 타입 유틸리티. 기존 타입에 컴파일 타임 태그를 부여한다. */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

// ── ID 타입들 ──

/** 사용자 ID (number 기반) */
export type UserId = Brand<number, "UserId">;

/** 회의실 ID (number 기반) */
export type RoomId = Brand<number, "RoomId">;

/** 팀 ID (number 기반) */
export type TeamId = Brand<number, "TeamId">;

/** 회사 ID (number 기반) */
export type CompanyId = Brand<number, "CompanyId">;

/** 녹음 ID (number 기반) */
export type RecordingId = Brand<number, "RecordingId">;

/** 참여자 ID (number 기반) */
export type ParticipantId = Brand<number, "ParticipantId">;

// ── 헬퍼 함수 ──

/** 런타임에서 number → UserId로 변환. 런타임 비용 제로. */
export const toUserId = (id: number): UserId => id as UserId;

/** 런타임에서 number → RoomId로 변환. */
export const toRoomId = (id: number): RoomId => id as RoomId;

/** 런타임에서 number → TeamId로 변환. */
export const toTeamId = (id: number): TeamId => id as TeamId;

/** 런타임에서 number → CompanyId로 변환. */
export const toCompanyId = (id: number): CompanyId => id as CompanyId;

/** 런타임에서 number → RecordingId로 변환. */
export const toRecordingId = (id: number): RecordingId => id as RecordingId;

/** 런타임에서 number → ParticipantId로 변환. */
export const toParticipantId = (id: number): ParticipantId => id as ParticipantId;
