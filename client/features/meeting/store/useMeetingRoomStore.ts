import { create } from "zustand";
import type { MeetingRoomStore } from "./types";
import { transition, logTransition, canTransition } from "./phaseMachine";

const initialState = {
  // Connection
  phase: "preparing" as const,
  token: "",
  isHost: false,
  rejected: false,

  // Media
  isMuted: false,
  isVideoOn: true,
  deviceSelection: null,

  // UI
  isFullscreen: false,
  isPIPMode: false,
  viewMode: "gallery" as const,
  currentSpeaker: 0,
  showChat: false,
  showParticipants: true,

  // Modals
  showExitModal: false,
  isAIRecordingRequestModalOpen: false,
  isInviteModalOpen: false,

  // AI Recording
  isAIRecording: false,
  pendingAIRequests: [],

  // Chat
  chatMessages: [],
  chatInput: "",
  noteText: "",
  showNoteInput: false,
};

export const useMeetingRoomStore = create<MeetingRoomStore>((set) => ({
  ...initialState,

  // Connection actions (with state machine guard)
  setPhase: (next) =>
    set((s) => {
      const result = transition(s.phase, next);
      logTransition(s.phase, next, result === next);
      return { phase: result };
    }),
  setToken: (token) => set({ token }),
  setIsHost: (isHost) => set({ isHost }),
  setRejected: (rejected) => set({ rejected }),

  // Media actions
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsVideoOn: (isVideoOn) => set({ isVideoOn }),
  setDeviceSelection: (deviceSelection) => set({ deviceSelection }),
  toggleMuted: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleVideoOn: () => set((s) => ({ isVideoOn: !s.isVideoOn })),

  // UI actions
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsPIPMode: (isPIPMode) => set({ isPIPMode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentSpeaker: (currentSpeaker) => set({ currentSpeaker }),
  toggleChat: () => set((s) => ({ showChat: !s.showChat })),
  toggleParticipants: () => set((s) => ({ showParticipants: !s.showParticipants })),

  // Modal actions
  setShowExitModal: (showExitModal) => set({ showExitModal }),
  setIsAIRecordingRequestModalOpen: (isAIRecordingRequestModalOpen) =>
    set({ isAIRecordingRequestModalOpen }),
  setIsInviteModalOpen: (isInviteModalOpen) => set({ isInviteModalOpen }),

  // AI Recording actions
  setIsAIRecording: (isAIRecording) => set({ isAIRecording }),
  addPendingAIRequest: (req) =>
    set((s) => ({ pendingAIRequests: [...s.pendingAIRequests, req] })),
  removePendingAIRequest: () =>
    set((s) => ({ pendingAIRequests: s.pendingAIRequests.slice(1) })),

  // Chat actions
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatInput: (chatInput) => set({ chatInput }),
  setNoteText: (noteText) => set({ noteText }),
  setShowNoteInput: (showNoteInput) => set({ showNoteInput }),

  // Reset
  reset: () => set(initialState),
}));
