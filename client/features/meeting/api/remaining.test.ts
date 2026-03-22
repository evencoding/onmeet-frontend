import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRoomFetch = vi.fn().mockResolvedValue({});

vi.mock("../api", () => ({
  roomFetch: (...args: unknown[]) => mockRoomFetch(...args),
}));

import { listWaitingRoom, admitWaiting, rejectWaiting, admitAllWaiting } from "./waiting-room";
import { inviteToRoom, bulkInviteToRoom, cancelInvitation, listInvitations, acceptInvitation, declineInvitation } from "./invitation";
import { startRecording, stopRecording, getRecordingStatus, listRecordings, getRecordingDownloadUrl, deleteRecording } from "./recording";
import { startScreenShare, stopScreenShare, forceStopScreenShare, listActiveScreenShares } from "./screen-share";
import { sendChatMessage, getChatToken } from "./chat";
import { scheduleRoom, updateSchedule, cancelSchedule, sendReminder } from "./room-schedule";
import { getRoomSettings, updateRoomSettings } from "./room-settings";

beforeEach(() => {
  mockRoomFetch.mockClear();
});

const uid = "user-1";

describe("waiting-room API", () => {
  it("listWaitingRoom", async () => {
    await listWaitingRoom(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/waiting", uid);
  });

  it("admitWaiting", async () => {
    await admitWaiting(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/waiting/5/admit", uid, { method: "POST" });
  });

  it("rejectWaiting", async () => {
    await rejectWaiting(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/waiting/5/reject", uid, { method: "POST" });
  });

  it("admitAllWaiting", async () => {
    await admitAllWaiting(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/waiting/admit-all", uid, { method: "POST" });
  });
});

describe("invitation API", () => {
  it("inviteToRoom", async () => {
    const data = { inviteeUserId: 5 };
    await inviteToRoom(10, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/invite", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("bulkInviteToRoom", async () => {
    const data = { inviteeUserIds: [1, 2, 3] };
    await bulkInviteToRoom(10, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/invite/bulk", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("cancelInvitation", async () => {
    await cancelInvitation(10, 5, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/invite/5", uid, { method: "DELETE" });
  });

  it("listInvitations", async () => {
    await listInvitations(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/invitations", uid);
  });

  it("acceptInvitation", async () => {
    await acceptInvitation(99, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/invitations/99/accept", uid, { method: "POST" });
  });

  it("declineInvitation", async () => {
    await declineInvitation(99, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/invitations/99/decline", uid, { method: "POST" });
  });
});

describe("recording API", () => {
  it("startRecording", async () => {
    await startRecording(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/recording/start", uid, { method: "POST" });
  });

  it("stopRecording", async () => {
    await stopRecording(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/recording/stop", uid, { method: "POST" });
  });

  it("getRecordingStatus", async () => {
    await getRecordingStatus(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/recording/status", uid);
  });

  it("listRecordings", async () => {
    await listRecordings(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/recordings", uid);
  });

  it("getRecordingDownloadUrl", async () => {
    await getRecordingDownloadUrl(77, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/recordings/77/download", uid);
  });

  it("deleteRecording", async () => {
    await deleteRecording(77, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/recordings/77", uid, { method: "DELETE" });
  });
});

describe("screen-share API", () => {
  it("startScreenShare", async () => {
    await startScreenShare(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/screen-share/start", uid, { method: "POST" });
  });

  it("stopScreenShare", async () => {
    await stopScreenShare(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/screen-share/stop", uid, { method: "POST" });
  });

  it("forceStopScreenShare includes targetUserId", async () => {
    await forceStopScreenShare(10, uid, 99);
    const url = mockRoomFetch.mock.calls[0][0] as string;
    expect(url).toContain("/rooms/10/screen-share/force-stop");
    expect(url).toContain("targetUserId=99");
    expect(mockRoomFetch.mock.calls[0][2]).toEqual({ method: "POST" });
  });

  it("listActiveScreenShares", async () => {
    await listActiveScreenShares(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/screen-share/active", uid);
  });
});

describe("chat API", () => {
  it("sendChatMessage", async () => {
    const data = { message: "hello" };
    await sendChatMessage(10, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/chat/send", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("getChatToken", async () => {
    const data = { roomId: 10, userId: uid };
    await getChatToken(data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/internal/chat-token", "", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
});

describe("room-schedule API", () => {
  it("scheduleRoom", async () => {
    const data = { title: "Meeting" };
    await scheduleRoom(uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/schedule", uid, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("updateSchedule includes scheduledAt", async () => {
    await updateSchedule(10, uid, "2024-01-01T10:00:00");
    const url = mockRoomFetch.mock.calls[0][0] as string;
    expect(url).toContain("/rooms/10/schedule");
    expect(url).toContain("scheduledAt=");
    expect(mockRoomFetch.mock.calls[0][2]).toEqual({ method: "PATCH" });
  });

  it("cancelSchedule", async () => {
    await cancelSchedule(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/schedule", uid, { method: "DELETE" });
  });

  it("sendReminder", async () => {
    await sendReminder(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/schedule/remind", uid, { method: "POST" });
  });
});

describe("room-settings API", () => {
  it("getRoomSettings", async () => {
    await getRoomSettings(10, uid);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/settings", uid);
  });

  it("updateRoomSettings", async () => {
    const data = { maxParticipants: 50 };
    await updateRoomSettings(10, uid, data as any);
    expect(mockRoomFetch).toHaveBeenCalledWith("/rooms/10/settings", uid, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  });
});
