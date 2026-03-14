// ── Phase / View enums ──

export type Phase = "preparing" | "joining" | "waiting" | "connected" | "disconnected";
export type ViewMode = "gallery" | "speaker";

// ── Shared value objects ──

export interface DeviceSelection {
  cameraId: string;
  microphoneId: string;
  speakerId: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export interface AIRequest {
  id: string;
  senderName: string;
  timestamp: string;
}

// ── Slice interfaces ──

export interface ConnectionSlice {
  phase: Phase;
  token: string;
  isHost: boolean;
  setPhase: (phase: Phase) => void;
  setToken: (token: string) => void;
  setIsHost: (isHost: boolean) => void;
}

export interface MediaSlice {
  isMuted: boolean;
  isVideoOn: boolean;
  deviceSelection: DeviceSelection | null;
  setIsMuted: (v: boolean) => void;
  setIsVideoOn: (v: boolean) => void;
  setDeviceSelection: (d: DeviceSelection | null) => void;
  toggleMuted: () => void;
  toggleVideoOn: () => void;
}

export interface UISlice {
  isFullscreen: boolean;
  isPIPMode: boolean;
  viewMode: ViewMode;
  currentSpeaker: number;
  showChat: boolean;
  showParticipants: boolean;
  setIsFullscreen: (v: boolean) => void;
  setIsPIPMode: (v: boolean) => void;
  setViewMode: (v: ViewMode) => void;
  setCurrentSpeaker: (idx: number) => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
}

export interface ModalsSlice {
  showExitModal: boolean;
  isAIRecordingRequestModalOpen: boolean;
  isInviteModalOpen: boolean;
  setShowExitModal: (v: boolean) => void;
  setIsAIRecordingRequestModalOpen: (v: boolean) => void;
  setIsInviteModalOpen: (v: boolean) => void;
}

export interface AIRecordingSlice {
  isAIRecording: boolean;
  pendingAIRequests: AIRequest[];
  setIsAIRecording: (v: boolean) => void;
  addPendingAIRequest: (req: AIRequest) => void;
  removePendingAIRequest: () => void;
}

export interface ChatSlice {
  chatMessages: ChatMessage[];
  chatInput: string;
  noteText: string;
  showNoteInput: boolean;
  addChatMessage: (msg: ChatMessage) => void;
  setChatInput: (v: string) => void;
  setNoteText: (v: string) => void;
  setShowNoteInput: (v: boolean) => void;
}

// ── Combined store ──

export type MeetingRoomStore = ConnectionSlice &
  MediaSlice &
  UISlice &
  ModalsSlice &
  AIRecordingSlice &
  ChatSlice & {
    reset: () => void;
  };
