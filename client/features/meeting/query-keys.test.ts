import { describe, it, expect } from "vitest";
import { roomKeys } from "./query-keys";

describe("roomKeys (query key factory)", () => {
  // ── Base keys ──

  it("all returns base key", () => {
    expect(roomKeys.all).toEqual(["rooms"]);
  });

  // ── Lists ──

  it("lists builds on all", () => {
    expect(roomKeys.lists()).toEqual(["rooms", "list"]);
  });

  it("list includes params", () => {
    const params = { status: "ACTIVE" };
    expect(roomKeys.list(params)).toEqual(["rooms", "list", params]);
  });

  it("list without params includes undefined", () => {
    expect(roomKeys.list()).toEqual(["rooms", "list", undefined]);
  });

  it("scheduled returns correct key", () => {
    expect(roomKeys.scheduled()).toEqual(["rooms", "scheduled"]);
  });

  it("history returns correct key", () => {
    expect(roomKeys.history()).toEqual(["rooms", "history"]);
  });

  it("favorites returns correct key", () => {
    expect(roomKeys.favorites()).toEqual(["rooms", "favorites"]);
  });

  it("searchByTag includes tag", () => {
    expect(roomKeys.searchByTag("dev")).toEqual(["rooms", "tag", "dev"]);
  });

  // ── Detail ──

  it("details returns base detail key", () => {
    expect(roomKeys.details()).toEqual(["rooms", "detail"]);
  });

  it("detail includes roomId", () => {
    expect(roomKeys.detail(42)).toEqual(["rooms", "detail", 42]);
  });

  it("byCode includes code", () => {
    expect(roomKeys.byCode("ABC123")).toEqual(["rooms", "code", "ABC123"]);
  });

  // ── Sub-resources ──

  it("settings nests under detail", () => {
    expect(roomKeys.settings(1)).toEqual(["rooms", "detail", 1, "settings"]);
  });

  it("stats nests under detail", () => {
    expect(roomKeys.stats(1)).toEqual(["rooms", "detail", 1, "stats"]);
  });

  it("timeline nests under detail", () => {
    expect(roomKeys.timeline(1)).toEqual(["rooms", "detail", 1, "timeline"]);
  });

  // ── Participants ──

  it("participants nests under detail", () => {
    expect(roomKeys.participants(5)).toEqual(["rooms", "detail", 5, "participants"]);
  });

  it("participantHistory nests under detail", () => {
    expect(roomKeys.participantHistory(5)).toEqual([
      "rooms", "detail", 5, "participant-history",
    ]);
  });

  // ── Waiting room ──

  it("waiting nests under detail", () => {
    expect(roomKeys.waiting(10)).toEqual(["rooms", "detail", 10, "waiting"]);
  });

  // ── Recordings ──

  it("recordings nests under detail", () => {
    expect(roomKeys.recordings(3)).toEqual(["rooms", "detail", 3, "recordings"]);
  });

  it("recordingStatus nests under detail", () => {
    expect(roomKeys.recordingStatus(3)).toEqual([
      "rooms", "detail", 3, "recording-status",
    ]);
  });

  // ── Invitations ──

  it("invitations nests under detail", () => {
    expect(roomKeys.invitations(7)).toEqual(["rooms", "detail", 7, "invitations"]);
  });

  // ── Screen share ──

  it("activeScreenShares nests under detail", () => {
    expect(roomKeys.activeScreenShares(7)).toEqual([
      "rooms", "detail", 7, "screen-shares",
    ]);
  });

  // ── STT ──

  it("stt nests under detail", () => {
    expect(roomKeys.stt(2)).toEqual(["rooms", "detail", 2, "stt"]);
  });

  it("sttTranscript nests under detail", () => {
    expect(roomKeys.sttTranscript(2)).toEqual([
      "rooms", "detail", 2, "stt-transcript",
    ]);
  });

  // ── Monthly stats ──

  it("monthlyStats returns correct key", () => {
    expect(roomKeys.monthlyStats()).toEqual(["rooms", "monthly-stats"]);
  });

  // ── Key hierarchy (prefix matching) ──

  it("detail keys are prefixed by all key", () => {
    const detailKey = roomKeys.detail(1);
    expect(detailKey.slice(0, roomKeys.all.length)).toEqual(roomKeys.all);
  });

  it("sub-resource keys are prefixed by detail key", () => {
    const settingsKey = roomKeys.settings(1);
    const detailKey = roomKeys.detail(1);
    expect(settingsKey.slice(0, detailKey.length)).toEqual(detailKey);
  });
});
