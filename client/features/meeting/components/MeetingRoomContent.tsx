import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Maximize,
  Minimize,
  MicOff,
  VideoOff,
  X,
} from "lucide-react";
import {
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent, type RemoteParticipant } from "livekit-client";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import AIRecordingRequestModal from "./AIRecordingRequestModal";
import InviteParticipantModal from "./InviteParticipantModal";
import ExitMeetingModal from "./ExitMeetingModal";
import PIPModeView from "./PIPModeView";
import VideoGrid from "./VideoGrid";
import ChatPanel from "./ChatPanel";
import MeetingToolbar from "./MeetingToolbar";

interface MeetingRoomContentProps {
  roomId: string;
  isHost: boolean;
}

export default function MeetingRoomContent({
  roomId,
  isHost,
}: MeetingRoomContentProps) {
  const navigate = useNavigate();
  const room = useRoomContext();
  const participants = useParticipants();

  const decoder = useRef(new TextDecoder());

  const {
    isFullscreen,
    isPIPMode,
    showChat,
    showParticipants,
    showExitModal,
    isAIRecordingRequestModalOpen,
    isInviteModalOpen,
    isAIRecording,
    pendingAIRequests,
  } = useMeetingRoomStore(
    useShallow((s) => ({
      isFullscreen: s.isFullscreen,
      isPIPMode: s.isPIPMode,
      showChat: s.showChat,
      showParticipants: s.showParticipants,
      showExitModal: s.showExitModal,
      isAIRecordingRequestModalOpen: s.isAIRecordingRequestModalOpen,
      isInviteModalOpen: s.isInviteModalOpen,
      isAIRecording: s.isAIRecording,
      pendingAIRequests: s.pendingAIRequests,
    })),
  );

  const setIsFullscreen = useMeetingRoomStore((s) => s.setIsFullscreen);
  const setIsPIPMode = useMeetingRoomStore((s) => s.setIsPIPMode);
  const setShowExitModal = useMeetingRoomStore((s) => s.setShowExitModal);
  const setIsAIRecordingRequestModalOpen = useMeetingRoomStore(
    (s) => s.setIsAIRecordingRequestModalOpen,
  );
  const setIsInviteModalOpen = useMeetingRoomStore((s) => s.setIsInviteModalOpen);
  const setShowParticipants = useMeetingRoomStore((s) => s.toggleParticipants);
  const setIsAIRecording = useMeetingRoomStore((s) => s.setIsAIRecording);
  const addPendingAIRequest = useMeetingRoomStore((s) => s.addPendingAIRequest);
  const removePendingAIRequest = useMeetingRoomStore((s) => s.removePendingAIRequest);
  const addChatMessage = useMeetingRoomStore((s) => s.addChatMessage);

  // DataChannel chat listener
  useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      try {
        const data = JSON.parse(decoder.current.decode(payload));
        if (data.type === "chat") {
          addChatMessage({
            id: Date.now().toString(),
            sender: participant?.name || participant?.identity || "Unknown",
            message: data.message,
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, addChatMessage]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, [isFullscreen, setIsFullscreen]);

  const handleDisconnect = useCallback(() => {
    room.disconnect();
    navigate("/");
  }, [room, navigate]);

  // PIP mode
  if (isPIPMode) {
    return (
      <PIPModeView isHost={isHost} onDisconnect={handleDisconnect} />
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white overflow-hidden">
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showChat && showParticipants
            ? "w-1/2"
            : showChat || showParticipants
              ? "w-2/3"
              : "w-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="회의 나가기"
            >
              <Phone className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-2xl font-bold">회의</h1>
            <button
              onClick={() => setIsPIPMode(true)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="PIP 모드로 이동 (연결 유지)"
            >
              <Minimize className="w-5 h-5 text-purple-400" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">
              {participants.length} 명 참여 중
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="전체화면"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 overflow-hidden p-4">
          <VideoGrid />
        </div>

        {/* Toolbar */}
        <MeetingToolbar isHost={isHost} />
      </div>

      {/* Chat panel */}
      <ChatPanel />

      {/* Participants panel */}
      {showParticipants && (
        <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
          <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-semibold">
              참여자 ({participants.length}명)
            </h3>
            <button
              onClick={setShowParticipants}
              className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.identity}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  participant.isSpeaking
                    ? "bg-purple-500/30 border border-purple-400"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {(participant.name || participant.identity)[0]?.toUpperCase()}
                  </div>
                  {participant.isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {participant.name || participant.identity}
                    {participant.metadata === "host" && " (호스트)"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    {participant.isMicrophoneEnabled === false && (
                      <MicOff className="w-3 h-3" />
                    )}
                    {participant.isCameraEnabled === false && (
                      <VideoOff className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-4 border-t border-purple-500/20">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all"
            >
              참여자 초대
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AIRecordingRequestModal
        isOpen={isAIRecordingRequestModalOpen}
        isHost={isHost}
        isAIRecording={isAIRecording}
        onClose={() => setIsAIRecordingRequestModalOpen(false)}
        onRequestSend={() => {
          addPendingAIRequest({
            id: Date.now().toString(),
            senderName: "You",
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }}
        onApprove={() => {
          setIsAIRecording(true);
          if (pendingAIRequests.length > 0) {
            removePendingAIRequest();
          }
        }}
        onReject={() => {
          if (pendingAIRequests.length > 0) {
            removePendingAIRequest();
          }
        }}
        pendingRequests={pendingAIRequests}
      />

      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={() => {}}
        alreadyInvited={participants.map((p) => p.identity)}
        meetingId={roomId}
      />

      <ExitMeetingModal
        isOpen={showExitModal}
        isHost={isHost}
        isAIRecording={isAIRecording}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleDisconnect}
      />
    </div>
  );
}
