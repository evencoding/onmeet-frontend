import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageCircle,
  Zap,
  Maximize,
  Users,
  Send,
  X,
  Loader,
  Camera,
  Share2,
  FileText,
  Minimize,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LiveKitRoom,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  useTracks,
  useParticipantTracks,
} from "@livekit/components-react";
import {
  Track,
  RoomEvent,
  DataPacket_Kind,
  type RemoteParticipant,
} from "livekit-client";
import AIRecordingRequestModal from "@/features/meeting/components/AIRecordingRequestModal";
import InviteParticipantModal from "@/features/meeting/components/InviteParticipantModal";
import MeetingPreparationModal from "@/features/meeting/components/MeetingPreparationModal";
import type { DeviceSelection } from "@/features/meeting/components/MeetingPreparationModal";
import ExitMeetingModal from "@/features/meeting/components/ExitMeetingModal";
import WaitingRoom from "@/features/meeting/components/WaitingRoom";
import ParticipantTile from "@/features/meeting/components/ParticipantTile";
import { useJoinRoom } from "@/features/meeting/hooks";
import { useAuth } from "@/features/auth/context";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shared/ui/tooltip";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://livekit.onmeet.cloud";

type Phase = "preparing" | "joining" | "waiting" | "connected" | "disconnected";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export default function MeetingRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>("preparing");
  const [token, setToken] = useState<string>("");
  const [isHost, setIsHost] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [deviceSelection, setDeviceSelection] =
    useState<DeviceSelection | null>(null);

  const joinRoom = useJoinRoom();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDeviceSelect = useCallback((devices: DeviceSelection) => {
    setDeviceSelection(devices);
  }, []);

  const handleStartMeeting = useCallback(async () => {
    if (!roomId || !user) return;

    setPhase("joining");

    try {
      const res = await joinRoom.mutateAsync({
        roomId,
        userId: String(user.id),
        body: {
          displayName: user.name,
          audioEnabled: !isMuted,
          videoEnabled: isVideoOn,
        },
      });

      setIsHost(res.isHost);

      if (res.waitingRoom) {
        setPhase("waiting");
        pollingRef.current = setInterval(async () => {
          try {
            const pollRes = await joinRoom.mutateAsync({
              roomId,
              userId: String(user.id),
            });
            if (!pollRes.waitingRoom) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setToken(pollRes.token);
              setIsHost(pollRes.isHost);
              setPhase("connected");
            }
          } catch {
          }
        }, 4000);
      } else {
        setToken(res.token);
        setPhase("connected");
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      setPhase("preparing");
    }
  }, [roomId, user, isMuted, isVideoOn, joinRoom]);

  const handleCancelWaiting = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPhase("preparing");
  }, []);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (!roomId) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p>유효하지 않은 회의 링크입니다.</p>
      </div>
    );
  }

  if (phase === "preparing") {
    return (
      <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white items-center justify-center">
        <MeetingPreparationModal
          isOpen={true}
          onStart={handleStartMeeting}
          onInitialState={{ isMuted, isVideoOn }}
          onStateChange={{ isMuted, setIsMuted, isVideoOn, setIsVideoOn }}
          onDeviceSelect={handleDeviceSelect}
        />
      </div>
    );
  }

  if (phase === "joining") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-black to-purple-900">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
          <p className="text-white/80 text-sm">회의에 연결 중...</p>
        </div>
      </div>
    );
  }

  if (phase === "waiting") {
    return <WaitingRoom onCancel={handleCancelWaiting} />;
  }

  if (phase === "disconnected") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-black to-purple-900">
        <div className="text-center space-y-4">
          <p className="text-white text-xl font-bold">회의가 종료되었습니다</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={!isMuted}
      video={isVideoOn}
      onDisconnected={() => setPhase("disconnected")}
    >
      <MeetingRoomContent
        roomId={roomId}
        isHost={isHost}
        initialMuted={isMuted}
        initialVideoOn={isVideoOn}
      />
    </LiveKitRoom>
  );
}

interface MeetingRoomContentProps {
  roomId: string;
  isHost: boolean;
  initialMuted: boolean;
  initialVideoOn: boolean;
}

function MeetingRoomContent({
  roomId,
  isHost,
  initialMuted,
  initialVideoOn,
}: MeetingRoomContentProps) {
  const navigate = useNavigate();
  const room = useRoomContext();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const screenShareTracks = useTracks([Track.Source.ScreenShare]);
  const isScreenSharing = screenShareTracks.some(
    (t) => t.participant.identity === localParticipant.identity,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isVideoOn, setIsVideoOn] = useState(initialVideoOn);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPIPMode, setIsPIPMode] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "speaker">("gallery");
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [isAIRecording, setIsAIRecording] = useState(false);
  const [isAIRecordingRequestModalOpen, setIsAIRecordingRequestModalOpen] =
    useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingAIRequests, setPendingAIRequests] = useState<
    Array<{ id: string; senderName: string; timestamp: string }>
  >([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);

  const toggleMic = useCallback(async () => {
    const next = !isMuted;
    setIsMuted(next);
    await localParticipant.setMicrophoneEnabled(!next);
  }, [isMuted, localParticipant]);

  const toggleCamera = useCallback(async () => {
    const next = !isVideoOn;
    setIsVideoOn(next);
    await localParticipant.setCameraEnabled(next);
  }, [isVideoOn, localParticipant]);

  const toggleScreenShare = useCallback(async () => {
    await localParticipant.setScreenShareEnabled(!isScreenSharing);
  }, [isScreenSharing, localParticipant]);

  const encoder = useRef(new TextEncoder());
  const decoder = useRef(new TextDecoder());

  useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      try {
        const data = JSON.parse(decoder.current.decode(payload));
        if (data.type === "chat") {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: participant?.name || participant?.identity || "Unknown",
              message: data.message,
              timestamp: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      } catch {
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room]);

  const handleSendMessage = useCallback(() => {
    if (!chatMessage.trim()) return;

    const data = JSON.stringify({ type: "chat", message: chatMessage });
    room.localParticipant.publishData(
      encoder.current.encode(data),
      { reliable: true },
    );

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "You",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatMessage("");
  }, [chatMessage, room]);

  const toggleFullscreen = async () => {
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
  };

  const handleScreenshot = async () => {
    const videoEl = document.querySelector("video");
    if (videoEl && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = videoEl.videoWidth;
        canvasRef.current.height = videoEl.videoHeight;
        ctx.drawImage(videoEl, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `screenshot-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        message: `📝 ${noteText}`,
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, newMessage]);
      setNoteText("");
      setShowNoteInput(false);
    }
  };

  const handleDisconnect = useCallback(() => {
    room.disconnect();
    navigate("/");
  }, [room, navigate]);

  if (isPIPMode) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 rounded-2xl shadow-2xl w-96 h-72 border border-purple-500/30 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-900/40 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">회의 진행 중</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPIPMode(false)}
                className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors text-white"
                title="전체보기로 돌아가기"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowExitModal(true)}
                className="p-1 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                title="회의 나가기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-black overflow-hidden">
            {isVideoOn && localParticipant ? (
              <LocalVideoPreview />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black">
                <VideoOff className="w-12 h-12 text-white/30" />
              </div>
            )}

            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-3">
              <button
                onClick={toggleMic}
                className={`p-2 rounded-full transition-all ${
                  isMuted
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-full transition-all ${
                  !isVideoOn
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <VideoOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {isAIRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                녹화 중
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-purple-500/20 bg-purple-900/40 text-xs text-white/70">
            {participants.length}명 참여 중
          </div>
        </div>

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showChat && showParticipants
            ? "w-1/2"
            : showChat || showParticipants
              ? "w-2/3"
              : "w-full"
        }`}
      >
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

        <div className="flex-1 overflow-hidden p-4">
          {viewMode === "gallery" ? (
            <div className="grid grid-cols-2 gap-4 h-full overflow-auto max-w-4xl mx-auto">
              {participants.slice(0, 4).map((participant) => (
                <ParticipantTile
                  key={participant.identity}
                  participant={participant}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-purple-500 ring-2 ring-purple-500/30 relative">
                {participants[currentSpeaker] && (
                  <ParticipantTile
                    participant={participants[currentSpeaker]}
                    className="w-full h-full rounded-none border-0"
                  />
                )}

                {isAIRecording && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white font-semibold">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    AI 회의록
                  </div>
                )}
              </div>

              <div className="w-32 flex flex-col gap-2 overflow-y-auto">
                {participants.map((participant, idx) => (
                  <button
                    key={participant.identity}
                    onClick={() => setCurrentSpeaker(idx)}
                    className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentSpeaker === idx
                        ? "border-purple-400"
                        : "border-purple-500/30 hover:border-purple-400"
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {participant.name || participant.identity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <TooltipProvider>
          <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-center gap-4">

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleMic}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isMuted
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isMuted ? "음성 켜기" : "음성 끄기"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleCamera}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    !isVideoOn
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  {isVideoOn ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <VideoOff className="w-6 h-6" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isVideoOn ? "카메라 끄기" : "카메라 켜기"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsAIRecordingRequestModalOpen(true)}
                  className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isAIRecording
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isHost ? "AI 회의록 관리" : "AI 회의록 요청"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    setViewMode(
                      viewMode === "gallery" ? "speaker" : "gallery",
                    )
                  }
                  className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
                >
                  <Users className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">화면 전환</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleScreenshot}
                  className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">스크린샷 촬영</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isScreenSharing
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isScreenSharing ? "화면 공유 중지" : "화면 공유"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    showChat
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">채팅</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className={`p-4 rounded-full transition-all duration-200 ${
                    showParticipants
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                  }`}
                >
                  <Users className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">참여자</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowExitModal(true)}
                  className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 ml-auto"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">회의 나가기</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {showChat && (
        <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
          <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-semibold">채팅</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {msg.sender[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{msg.sender}</p>
                    <p className="text-xs text-white/50">{msg.timestamp}</p>
                  </div>
                  <p className="text-sm text-white/90 bg-purple-500/20 rounded-lg p-2 mt-1">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {showNoteInput && (
            <div className="px-4 py-3 border-t border-purple-500/20 bg-purple-500/10 space-y-2">
              <p className="text-xs text-white/60 font-semibold">노트 추가</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="노트를 입력하세요..."
                className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText("");
                  }}
                  className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-sm transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          <div className="px-4 py-4 border-t border-purple-500/20 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="메시지 전송"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg transition-colors"
              title="노트 추가"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showParticipants && (
        <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
          <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-semibold">
              참여자 ({participants.length}명)
            </h3>
            <button
              onClick={() => setShowParticipants(false)}
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

      <AIRecordingRequestModal
        isOpen={isAIRecordingRequestModalOpen}
        isHost={isHost}
        isAIRecording={isAIRecording}
        onClose={() => setIsAIRecordingRequestModalOpen(false)}
        onRequestSend={() => {
          const newRequest = {
            id: Date.now().toString(),
            senderName: "You",
            timestamp: new Date().toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setPendingAIRequests([...pendingAIRequests, newRequest]);
        }}
        onApprove={() => {
          setIsAIRecording(true);
          if (pendingAIRequests.length > 0) {
            setPendingAIRequests(pendingAIRequests.slice(1));
          }
        }}
        onReject={() => {
          if (pendingAIRequests.length > 0) {
            setPendingAIRequests(pendingAIRequests.slice(1));
          }
        }}
        pendingRequests={pendingAIRequests}
      />

      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={() => {
        }}
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

function LocalVideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localParticipant } = useLocalParticipant();

  const tracks = useParticipantTracks(
    [Track.Source.Camera],
    localParticipant.identity,
  );
  const cameraTrack = tracks.find((t) => t.source === Track.Source.Camera);

  useEffect(() => {
    if (videoRef.current && cameraTrack?.publication?.track) {
      cameraTrack.publication.track.attach(videoRef.current);
      return () => {
        cameraTrack.publication?.track?.detach(videoRef.current!);
      };
    }
  }, [cameraTrack?.publication?.track]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
