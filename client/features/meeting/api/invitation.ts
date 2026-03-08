import { roomApi } from "@/shared/api";
import { MeetingInvitationResponseSchema } from "@/shared/schemas";
import { z } from "zod";
import type {
  InvitationResponse,
  InviteRequest,
  BulkInviteRequest,
} from "./types";

export function inviteToRoom(roomId: number, userId: string, data: InviteRequest) {
  return roomApi<InvitationResponse>(`/rooms/${roomId}/invite`, {
    userId,
    method: "POST",
    body: JSON.stringify(data),
    schema: MeetingInvitationResponseSchema,
  });
}

export function bulkInviteToRoom(roomId: number, userId: string, data: BulkInviteRequest) {
  return roomApi<InvitationResponse[]>(`/rooms/${roomId}/invite/bulk`, {
    userId,
    method: "POST",
    body: JSON.stringify(data),
    schema: z.array(MeetingInvitationResponseSchema),
  });
}

export function cancelInvitation(roomId: number, inviteeUserId: number, userId: string) {
  return roomApi<void>(
    `/rooms/${roomId}/invite/${inviteeUserId}`,
    { userId, method: "DELETE" },
  );
}

export function listInvitations(roomId: number, userId: string) {
  return roomApi<InvitationResponse[]>(
    `/rooms/${roomId}/invitations`,
    { userId, schema: z.array(MeetingInvitationResponseSchema) },
  );
}

export function acceptInvitation(invitationId: number, userId: string) {
  return roomApi<void>(`/invitations/${invitationId}/accept`, {
    userId,
    method: "POST",
  });
}

export function declineInvitation(invitationId: number, userId: string) {
  return roomApi<void>(`/invitations/${invitationId}/decline`, {
    userId,
    method: "POST",
  });
}
