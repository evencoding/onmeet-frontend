import { useEffect, useRef, useCallback, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Maximize,
  Minimize,
  MicOff,
  VideoOff,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent, type RemoteParticipant } from "livekit-client";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import { endRoom, leaveRoom } from "../api/room";
import AIRecordingRequestModal from "./AIRecordingRequestModal";
import InviteParticipantModal from "./InviteParticipantModal";
import ExitMeetingModal from "./ExitMeetingModal";
import PIPModeView from "./PIPModeView";
import VideoGrid from "./VideoGrid";
import ChatPanel from "./ChatPanel";
import MeetingToolbar from "./MeetingToolbar";

// ── Self-subscribing modal containers ──
// Each modal subscribes to only its own slice of state,
// preventing layout re-renders when modal state changes.

function ConnectedAIRecordingModal({ isHost }: { isHost: boolean }) {
  const { isOpen, isAIRecording, pendingAIRequests } = useMeetingRoomStore(
    useShallow((s) => ({
      isOpen: s.isAIRecordingRequestModalOpen,
      isAIRecording: s.isAIRecording,
      pendingAIRequests: s.pendingAIRequests,
    })),
  );

  const handleClose = useCallback(() => {
    useMeetingRoomStore.getState().setIsAIRecordingRequestModalOpen(false);
  }, []);

  const handleRequestSend = useCallback(() => {
    useMeetingRoomStore.getState().addPendingAIRequest({
      id: Date.now().toString(),
      senderName: "You",
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, []);

  const handleApprove = useCallback(() => {
    const store = useMeetingRoomStore.getState();
    store.setIsAIRecording(true);
    if (store.pendingAIRequests.length > 0) {
      store.removePendingAIRequest();
    }
  }, []);

  const handleReject = useCallback(() => {
    const store = useMeetingRoomStore.getState();
    if (store.pendingAIRequests.length > 0) {
      store.removePendingAIRequest();
    }
  }, []);

  return (
    <AIRecordingRequestModal
      isOpen={isOpen}
      isHost={isHost}
      isAIRecording={isAIRecording}
      onClose={handleClose}
      onRequestSend={handleRequestSend}
      onApprove={handleApprove}
      onReject={handleReject}
      pendingRequests={pendingAIRequests}
    />
  );
}

function ConnectedInviteModal({
  roomId,
  participantIdentities,
}: {
  roomId: string;
  participantIdentities: string[];
}) {
  const isOpen = useMeetingRoomStore((s) => s.isInviteModalOpen);

  return (
    <InviteParticipantModal
      isOpen={isOpen}
      onClose={() => useMeetingRoomStore.getState().setIsInviteModalOpen(false)}
      onInvite={() => {}}
      alreadyInvited={participantIdentities}
      meetingId={roomId}
    />
  );
}

function ConnectedExitModal({
  isHost,
  onConfirm,
}: {
  isHost: boolean;
  onConfirm: () => void;
}) {
  const { showExitModal, isAIRecording } = useMeetingRoomStore(
    useShallow((s) => ({
      showExitModal: s.showExitModal,
      isAIRecording: s.isAIRecording,
    })),
  );

  return (
    <ExitMeetingModal
      isOpen={showExitModal}
      isHost={isHost}
      isAIRecording={isAIRecording}
      onClose={() => useMeetingRoomStore.getState().setShowExitModal(false)}
      onConfirm={onConfirm}
    />
  );
}

// ── Main content component ──

interface MeetingRoomContentProps {
  roomId: string;
  isHost: boolean;
  userId: string;
}

export default memo(function MeetingRoomContent({
  roomId,
  isHost,
  userId,
}: MeetingRoomContentProps) {
  const navigate = useNavigate();
  const room = useRoomContext();
  const participants = useParticipants();

  const decoder = useRef(new TextDecoder());

  const { isPIPMode, showChat, showParticipants } = useMeetingRoomStore(
    useShallow((s) => ({
      isPIPMode: s.isPIPMode,
      showChat: s.showChat,
      showParticipants: s.showParticipants,
    })),
  );

  // Switch speaker device on initial connection
  useEffect(() => {
    const speakerId = useMeetingRoomStore.getState().deviceSelection?.speakerId;
    if (speakerId) {
      room.switchActiveDevice("audiooutput", speakerId).catch((err) => {
        console.warn("Failed to switch audio output device:", err);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const participantIdentities = useMemo(
    () => participants.map((p) => p.identity),
    [participants],
  );

  // DataChannel chat listener
  useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      try {
        const data = JSON.parse(decoder.current.decode(payload));
        if (data.type === "chat") {
          useMeetingRoomStore.getState().addChatMessage({
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
  }, [room]);

  // Host departure detection
  const [hostLeft, setHostLeft] = useState(false);
  const [hostLeftCountdown, setHostLeftCountdown] = useState(5);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHost) return; // Host doesn't need to watch for themselves leaving

    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      if (participant.metadata === "host") {
        setHostLeft(true);
        setHostLeftCountdown(5);
        countdownRef.current = setInterval(() => {
          setHostLeftCountdown((prev) => {
            if (prev <= 1) {
              if (countdownRef.current) clearInterval(countdownRef.current);
              leaveRoom(Number(roomId), userId).catch(() => {});
              room.disconnect();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [room, isHost]);

  const handleHostLeftExit = useCallback(async () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    try {
      await leaveRoom(Number(roomId), userId);
    } catch (err) {
      console.error("Failed to leave room:", err);
    }
    room.disconnect();
    navigate("/");
  }, [room, navigate, roomId, userId]);

  const toggleFullscreen = useCallback(async () => {
    try {
      const isFullscreen = useMeetingRoomStore.getState().isFullscreen;
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        useMeetingRoomStore.getState().setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        useMeetingRoomStore.getState().setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    const roomIdNum = Number(roomId);
    try {
      if (isHost) {
        await endRoom(roomIdNum, userId);
      } else {
        await leaveRoom(roomIdNum, userId);
      }
    } catch (err) {
      console.error("Failed to end/leave room:", err);
    }
    room.disconnect();
    navigate("/");
  }, [room, navigate, roomId, isHost, userId]);

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
              onClick={() => useMeetingRoomStore.getState().setShowExitModal(true)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="회의 나가기"
            >
              <Phone className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-2xl font-bold">회의</h1>
            <button
              onClick={() => useMeetingRoomStore.getState().setIsPIPMode(true)}
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
              onClick={() => useMeetingRoomStore.getState().toggleParticipants()}
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
              onClick={() => useMeetingRoomStore.getState().setIsInviteModalOpen(true)}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all"
            >
              참여자 초대
            </button>
          </div>
        </div>
      )}

      {/* Modals — self-subscribing containers */}
      <ConnectedAIRecordingModal isHost={isHost} />
      <ConnectedInviteModal roomId={roomId} participantIdentities={participantIdentities} />
      <ConnectedExitModal isHost={isHost} onConfirm={handleDisconnect} />

      {/* Host departure modal */}
      {hostLeft && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-950/95 to-black/95 rounded-2xl border border-red-500/30 w-full max-w-sm p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">
              호스트가 회의를 종료했습니다
            </h2>
            <p className="text-white/60 text-sm">
              {hostLeftCountdown}초 후 자동으로 나갑니다...
            </p>
            <button
              onClick={handleHostLeftExit}
              className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              지금 나가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
