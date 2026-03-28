import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect, useCallback, useRef } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import MeetingPreparationModal from "@/features/meeting/components/MeetingPreparationModal";
import WaitingRoom from "@/features/meeting/components/WaitingRoom";
import MeetingRoomContent from "@/features/meeting/components/MeetingRoomContent";
import { useJoinRoom, useRoom } from "@/features/meeting/hooks";
import { useAuth } from "@/features/auth/context";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useToast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import { useMeetingRoomStore, type DeviceSelection } from "../store";
import { useWaitingRoomSSE } from "../hooks/useWaitingRoomSSE";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://rtc.onmeet.cloud";

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
  const { toast } = useToast();
  const { data: roomData } = useRoom(
    Number.isFinite(roomIdNum) ? roomIdNum : 0,
    userId,
  );
  const joinRoom = useJoinRoom();

  // LiveKitRoom에 전달할 초기 미디어 상태 (토글해도 변하지 않음)
  const initialMediaRef = useRef({ isMuted, isVideoOn, deviceSelection });

  // 새로고침 복원: sessionStorage에 토큰 저장/복원
  const SESSION_KEY = `onmeet_session_${roomId}`;
  useEffect(() => {
    if (token && phase === "connected") {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token, isHost }));
    }
  }, [token, phase, isHost, SESSION_KEY]);

  useEffect(() => {
    if (phase === "preparing" && !token) {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        try {
          const { token: savedToken, isHost: savedIsHost } = JSON.parse(saved);
          if (savedToken) {
            const s = useMeetingRoomStore.getState();
            s.setToken(savedToken);
            s.setIsHost(savedIsHost);
            s.setPhase("connected");
          }
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeviceSelect = useCallback(
    (devices: DeviceSelection | null) => {
      useMeetingRoomStore.getState().setDeviceSelection(devices);
    },
    [],
  );

  // SSE callbacks
  const handleSSEAdmitted = useCallback((sseToken: string) => {
    const s = useMeetingRoomStore.getState();
    s.setToken(sseToken);
    // isHost is already synced from roomData via the useEffect below
    s.setPhase("connected");
  }, []);

  const handleSSERejected = useCallback(() => {
    useMeetingRoomStore.getState().setRejected(true);
  }, []);

  // SSE connection — only active during waiting phase
  const { disconnect: disconnectSSE, connected: sseConnected } = useWaitingRoomSSE(
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

      // 자동 퇴장 / 일정 충돌 등 경고 표시
      if (res.warnings && res.warnings.length > 0) {
        for (const warning of res.warnings) {
          toast({ title: "알림", description: warning, variant: "default" });
        }
      }

      const s = useMeetingRoomStore.getState();

      if (res.waitingRoom) {
        s.setPhase("waiting");
        // SSE will activate via the phase === "waiting" condition above.
        // SSE auto-reconnects on failure (5s interval), no polling needed.
      } else {
        s.setToken(res.token);
        s.setPhase("connected");
      }
    } catch (err) {
      console.error("Failed to join room:", err);
      toast({ title: "회의 입장 실패", description: getErrorMessage(err, "회의 입장에 실패했습니다"), variant: "destructive" });
      useMeetingRoomStore.getState().setPhase("preparing");
    }
  }, [roomId, roomIdNum, user, userId, joinRoom, toast]);

  const handleCancelWaiting = useCallback(() => {
    disconnectSSE();
    const s = useMeetingRoomStore.getState();
    s.setRejected(false);
    s.setPhase("preparing");
  }, [disconnectSSE]);

  const handleBackToHome = useCallback(() => {
    disconnectSSE();
    navigate("/");
  }, [disconnectSSE, navigate]);

  useEffect(() => {
    return () => {
      useMeetingRoomStore.getState().reset();
      sessionStorage.removeItem(SESSION_KEY);
    };
  }, [SESSION_KEY]);

  if (!roomId || !Number.isFinite(roomIdNum)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
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
        sseConnected={sseConnected}
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

  // 초기 미디어 설정 — 토글해도 변하지 않는 ref 사용 (LiveKitRoom 재연결 방지)
  const initMedia = initialMediaRef.current;
  const audioOptions = !initMedia.isMuted
    ? initMedia.deviceSelection?.microphoneId
      ? { deviceId: initMedia.deviceSelection.microphoneId }
      : true
    : false;

  const videoOptions = initMedia.isVideoOn
    ? initMedia.deviceSelection?.cameraId
      ? { deviceId: initMedia.deviceSelection.cameraId }
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
        toast({ title: "연결 오류", description: "회의 연결에 실패했습니다", variant: "destructive" });
        useMeetingRoomStore.getState().setPhase("disconnected");
      }}
    >
      <MeetingRoomContent roomId={roomId} isHost={isHost} userId={userId} roomTitle={roomData?.title} roomCode={roomData?.roomCode} scheduledAt={roomData?.scheduledAt} maxParticipants={roomData?.maxParticipants} />
    </LiveKitRoom>
  );
}
