import { describe, it, expect, beforeEach } from "vitest";
import { useMeetingRoomStore } from "./useMeetingRoomStore";
import type { AIRequest, ChatMessage } from "./types";

const { getState } = useMeetingRoomStore;

beforeEach(() => {
  getState().reset();
});

describe("useMeetingRoomStore", () => {
  // ── Initial state ──

  it("has correct initial state", () => {
    const state = getState();
    expect(state.phase).toBe("preparing");
    expect(state.token).toBe("");
    expect(state.isHost).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.isVideoOn).toBe(true);
    expect(state.showChat).toBe(false);
    expect(state.showParticipants).toBe(true);
    expect(state.chatMessages).toEqual([]);
    expect(state.pendingAIRequests).toEqual([]);
  });

  // ── Setters ──

  it("setPhase updates phase via valid transitions", () => {
    // preparing → joining → connected (유효한 전이 순서)
    getState().setPhase("joining");
    expect(getState().phase).toBe("joining");
    getState().setPhase("connected");
    expect(getState().phase).toBe("connected");
  });

  it("setToken updates token", () => {
    getState().setToken("abc-123");
    expect(getState().token).toBe("abc-123");
  });

  it("setIsHost updates isHost", () => {
    getState().setIsHost(true);
    expect(getState().isHost).toBe(true);
  });

  it("setViewMode updates viewMode", () => {
    getState().setViewMode("speaker");
    expect(getState().viewMode).toBe("speaker");
  });

  // ── Toggles ──

  it("toggleMuted flips isMuted", () => {
    expect(getState().isMuted).toBe(false);
    getState().toggleMuted();
    expect(getState().isMuted).toBe(true);
    getState().toggleMuted();
    expect(getState().isMuted).toBe(false);
  });

  it("toggleVideoOn flips isVideoOn", () => {
    expect(getState().isVideoOn).toBe(true);
    getState().toggleVideoOn();
    expect(getState().isVideoOn).toBe(false);
  });

  it("toggleChat flips showChat", () => {
    getState().toggleChat();
    expect(getState().showChat).toBe(true);
  });

  it("toggleParticipants flips showParticipants", () => {
    getState().toggleParticipants();
    expect(getState().showParticipants).toBe(false);
  });

  // ── Add / Remove ──

  it("addChatMessage appends to chatMessages", () => {
    const msg: ChatMessage = {
      id: "1",
      sender: "Alice",
      message: "Hello",
      timestamp: "2024-01-01",
    };
    getState().addChatMessage(msg);
    expect(getState().chatMessages).toEqual([msg]);

    const msg2: ChatMessage = {
      id: "2",
      sender: "Bob",
      message: "Hi",
      timestamp: "2024-01-01",
    };
    getState().addChatMessage(msg2);
    expect(getState().chatMessages).toHaveLength(2);
  });

  it("addPendingAIRequest appends and removePendingAIRequest dequeues", () => {
    const req: AIRequest = {
      id: "r1",
      senderName: "Alice",
      timestamp: "2024-01-01",
    };
    const req2: AIRequest = {
      id: "r2",
      senderName: "Bob",
      timestamp: "2024-01-02",
    };

    getState().addPendingAIRequest(req);
    getState().addPendingAIRequest(req2);
    expect(getState().pendingAIRequests).toHaveLength(2);

    getState().removePendingAIRequest();
    expect(getState().pendingAIRequests).toEqual([req2]);
  });

  // ── Reset ──

  it("reset restores initial state", () => {
    getState().setPhase("connected");
    getState().setToken("token");
    getState().setIsHost(true);
    getState().toggleMuted();
    getState().addChatMessage({
      id: "1",
      sender: "A",
      message: "B",
      timestamp: "T",
    });

    getState().reset();

    const state = getState();
    expect(state.phase).toBe("preparing");
    expect(state.token).toBe("");
    expect(state.isHost).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.chatMessages).toEqual([]);
  });
});
