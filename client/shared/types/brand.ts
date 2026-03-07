declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

// ── ID Types ──

export type UserId = Brand<number, "UserId">;
export type RoomId = Brand<number, "RoomId">;
export type TeamId = Brand<number, "TeamId">;
export type CompanyId = Brand<number, "CompanyId">;
export type NotificationId = Brand<number, "NotificationId">;
export type RecordingId = Brand<number, "RecordingId">;
export type InvitationId = Brand<number, "InvitationId">;
export type ParticipantId = Brand<number, "ParticipantId">;

// ── Constructors ──

export const UserId = (id: number) => id as UserId;
export const RoomId = (id: number) => id as RoomId;
export const TeamId = (id: number) => id as TeamId;
export const CompanyId = (id: number) => id as CompanyId;
export const NotificationId = (id: number) => id as NotificationId;
export const RecordingId = (id: number) => id as RecordingId;
export const InvitationId = (id: number) => id as InvitationId;
export const ParticipantId = (id: number) => id as ParticipantId;
