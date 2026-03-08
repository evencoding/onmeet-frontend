import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import MeetingPreparationModal from "@/features/meeting/components/MeetingPreparationModal";
import WaitingRoom from "@/features/meeting/components/WaitingRoom";
import MeetingRoomContent from "@/features/meeting/components/MeetingRoomContent";
import { useJoinRoom } from "@/features/meeting/hooks";
import { useAuth } from "@/features/auth/context";
import { useMeetingRoomStore } from "../store";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://livekit.onmeet.cloud";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const phase = useMeetingRoomStore((s) => s.phase);
  const token = useMeetingRoomStore((s) => s.token);
  const isHost = useMeetingRoomStore((s) => s.isHost);
  const isMuted = useMeetingRoomStore((s) => s.isMuted);
  const isVideoOn = useMeetingRoomStore((s) => s.isVideoOn);

  const setPhase = useMeetingRoomStore((s) => s.setPhase);
  const setToken = useMeetingRoomStore((s) => s.setToken);
  const setIsHost = useMeetingRoomStore((s) => s.setIsHost);
  const setIsMuted = useMeetingRoomStore((s) => s.setIsMuted);
  const setIsVideoOn = useMeetingRoomStore((s) => s.setIsVideoOn);
  const setDeviceSelection = useMeetingRoomStore((s) => s.setDeviceSelection);
  const reset = useMeetingRoomStore((s) => s.reset);

  const joinRoom = useJoinRoom();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDeviceSelect = useCallback(
    (devices: Parameters<typeof setDeviceSelection>[0]) => {
      setDeviceSelection(devices);
    },
    [setDeviceSelection],
  );

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
            // polling error — ignore
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
  }, [roomId, user, isMuted, isVideoOn, joinRoom, setPhase, setToken, setIsHost]);

  const handleCancelWaiting = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPhase("preparing");
  }, [setPhase]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      reset();
    };
  }, [reset]);

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
      <MeetingRoomContent roomId={roomId} isHost={isHost} />
    </LiveKitRoom>
  );
}
