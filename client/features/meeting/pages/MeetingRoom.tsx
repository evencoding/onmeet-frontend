import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import MeetingPreparationModal from "@/features/meeting/components/MeetingPreparationModal";
import WaitingRoom from "@/features/meeting/components/WaitingRoom";
import MeetingRoomContent from "@/features/meeting/components/MeetingRoomContent";
import { useJoinRoom } from "@/features/meeting/hooks";
import { useAuth } from "@/features/auth/context";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useMeetingRoomStore, type DeviceSelection } from "../store";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://livekit.onmeet.cloud";

export default function MeetingRoom() {
  useDocumentTitle("회의 - OnMeet");
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const { phase, token, isHost, isMuted, isVideoOn } = useMeetingRoomStore(
    useShallow((s) => ({
      phase: s.phase,
      token: s.token,
      isHost: s.isHost,
      isMuted: s.isMuted,
      isVideoOn: s.isVideoOn,
    })),
  );

  const joinRoom = useJoinRoom();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDeviceSelect = useCallback(
    (devices: DeviceSelection | null) => {
      useMeetingRoomStore.getState().setDeviceSelection(devices);
    },
    [],
  );

  const handleStartMeeting = useCallback(async () => {
    if (!roomId || !user) return;

    const store = useMeetingRoomStore.getState();
    store.setPhase("joining");

    try {
      const res = await joinRoom.mutateAsync({
        roomId,
        userId: String(user.id),
        body: {
          displayName: user.name,
          audioEnabled: !store.isMuted,
          videoEnabled: store.isVideoOn,
        },
      });

      const s = useMeetingRoomStore.getState();
      s.setIsHost(res.isHost);

      if (res.waitingRoom) {
        s.setPhase("waiting");
        pollingRef.current = setInterval(async () => {
          try {
            const pollRes = await joinRoom.mutateAsync({
              roomId,
              userId: String(user.id),
            });
            if (!pollRes.waitingRoom) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              const latest = useMeetingRoomStore.getState();
              latest.setToken(pollRes.token);
              latest.setIsHost(pollRes.isHost);
              latest.setPhase("connected");
            }
          } catch {
            // polling error — ignore
          }
        }, 4000);
      } else {
        s.setToken(res.token);
        s.setPhase("connected");
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      useMeetingRoomStore.getState().setPhase("preparing");
    }
  }, [roomId, user, joinRoom]);

  const handleCancelWaiting = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    useMeetingRoomStore.getState().setPhase("preparing");
  }, []);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      useMeetingRoomStore.getState().reset();
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
          onStateChange={{
            isMuted,
            setIsMuted: (v: boolean) => useMeetingRoomStore.getState().setIsMuted(v),
            isVideoOn,
            setIsVideoOn: (v: boolean) => useMeetingRoomStore.getState().setIsVideoOn(v),
          }}
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
      onDisconnected={() => useMeetingRoomStore.getState().setPhase("disconnected")}
    >
      <MeetingRoomContent roomId={roomId} isHost={isHost} />
    </LiveKitRoom>
  );
}
