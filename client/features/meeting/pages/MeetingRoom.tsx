import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import MeetingPreparationModal from "@/features/meeting/components/MeetingPreparationModal";
import WaitingRoom from "@/features/meeting/components/WaitingRoom";
import MeetingRoomContent from "@/features/meeting/components/MeetingRoomContent";
import { useJoinRoom, useRoom } from "@/features/meeting/hooks";
import { useAuth } from "@/features/auth/context";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useMeetingRoomStore, type DeviceSelection } from "../store";
import { useWaitingRoomSSE } from "../hooks/useWaitingRoomSSE";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://livekit.onmeet.cloud";

export default function MeetingRoom() {
  useDocumentTitle("회의 - OnMeet");
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const { phase, token, isHost, isMuted, isVideoOn, deviceSelection, rejected } = useMeetingRoomStore(
    useShallow((s) => ({
      phase: s.phase,
      token: s.token,
      isHost: s.isHost,
      isMuted: s.isMuted,
      isVideoOn: s.isVideoOn,
      deviceSelection: s.deviceSelection,
      rejected: s.rejected,
    })),
  );

  const roomIdNum = Number(roomId);
  const userId = String(user?.id ?? "");
  const { data: roomData } = useRoom(
    Number.isFinite(roomIdNum) ? roomIdNum : 0,
    userId,
  );
  const joinRoom = useJoinRoom();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDeviceSelect = useCallback(
    (devices: DeviceSelection | null) => {
      useMeetingRoomStore.getState().setDeviceSelection(devices);
    },
    [],
  );

  // SSE callbacks
  const handleSSEAdmitted = useCallback((sseToken: string, sseIsHost: boolean) => {
    const s = useMeetingRoomStore.getState();
    s.setToken(sseToken);
    s.setIsHost(sseIsHost);
    s.setPhase("connected");
  }, []);

  const handleSSERejected = useCallback(() => {
    useMeetingRoomStore.getState().setRejected(true);
  }, []);

  // SSE connection — only active during waiting phase
  const { disconnect: disconnectSSE } = useWaitingRoomSSE(
    phase === "waiting" ? (roomId ?? null) : null,
    phase === "waiting" ? userId : undefined,
    handleSSEAdmitted,
    handleSSERejected,
  );

  // Keep isHost in sync with roomData once loaded
  useEffect(() => {
    if (roomData && user) {
      useMeetingRoomStore.getState().setIsHost(roomData.hostUserId === user.id);
    }
  }, [roomData, user]);

  const handleStartMeeting = useCallback(async (password?: string) => {
    if (!roomId || !user) return;

    const store = useMeetingRoomStore.getState();
    store.setPhase("joining");
    store.setRejected(false);

    try {
      const res = await joinRoom.mutateAsync({
        roomId: roomIdNum,
        userId,
        data: password ? { password } : undefined,
      });

      const s = useMeetingRoomStore.getState();

      if (res.waitingRoom) {
        s.setPhase("waiting");
        // SSE will activate via the phase === "waiting" condition above.
        // Fallback polling in case SSE fails.
        pollingRef.current = setInterval(async () => {
          try {
            const pollRes = await joinRoom.mutateAsync({
              roomId: roomIdNum,
              userId,
            });
            if (!pollRes.waitingRoom) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              const latest = useMeetingRoomStore.getState();
              latest.setToken(pollRes.token);
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
  }, [roomId, roomIdNum, user, userId, joinRoom]);

  const handleCancelWaiting = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    disconnectSSE();
    const s = useMeetingRoomStore.getState();
    s.setRejected(false);
    s.setPhase("preparing");
  }, [disconnectSSE]);

  const handleBackToHome = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    disconnectSSE();
    navigate("/");
  }, [disconnectSSE, navigate]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      useMeetingRoomStore.getState().reset();
    };
  }, []);

  if (!roomId || !Number.isFinite(roomIdNum)) {
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
          isLocked={roomData?.locked}
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
    return (
      <WaitingRoom
        onCancel={handleCancelWaiting}
        rejected={rejected}
        onBack={handleBackToHome}
        roomTitle={roomData?.title}
      />
    );
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

  const audioOptions = !isMuted
    ? deviceSelection?.microphoneId
      ? { deviceId: deviceSelection.microphoneId }
      : true
    : false;

  const videoOptions = isVideoOn
    ? deviceSelection?.cameraId
      ? { deviceId: deviceSelection.cameraId }
      : true
    : false;

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audioOptions}
      video={videoOptions}
      onDisconnected={() => useMeetingRoomStore.getState().setPhase("disconnected")}
      onError={(err) => {
        console.error("LiveKit connection error:", err);
        useMeetingRoomStore.getState().setPhase("disconnected");
      }}
    >
      <MeetingRoomContent roomId={roomId} isHost={isHost} />
    </LiveKitRoom>
  );
}
