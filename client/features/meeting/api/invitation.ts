import { roomFetch } from "../api";
import type {
  InvitationResponse,
  InviteRequest,
  BulkInviteRequest,
} from "./types";

export function inviteToRoom(roomId: number, userId: string, data: InviteRequest) {
  return roomFetch<InvitationResponse>(`/rooms/${roomId}/invite`, userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function bulkInviteToRoom(roomId: number, userId: string, data: BulkInviteRequest) {
  return roomFetch<InvitationResponse[]>(`/rooms/${roomId}/invite/bulk`, userId, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function cancelInvitation(roomId: number, inviteeUserId: number, userId: string) {
  return roomFetch<void>(
    `/rooms/${roomId}/invite/${inviteeUserId}`,
    userId,
    { method: "DELETE" },
  );
}

export function listInvitations(roomId: number, userId: string) {
  return roomFetch<InvitationResponse[]>(
    `/rooms/${roomId}/invitations`,
    userId,
  );
}

export function acceptInvitation(invitationId: number, userId: string) {
  return roomFetch<void>(`/invitations/${invitationId}/accept`, userId, {
    method: "POST",
  });
}

export function declineInvitation(invitationId: number, userId: string) {
  return roomFetch<void>(`/invitations/${invitationId}/decline`, userId, {
    method: "POST",
  });
}
