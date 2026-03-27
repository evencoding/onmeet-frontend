import { useCallback } from "react";
import {
  useLocalParticipant,
  useRoomContext,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMeetingRoomStore } from "../store";

/**
 * Bridge between Zustand store and LiveKit SDK for media controls.
 * Must be used inside `<LiveKitRoom>`.
 */
export function useMeetingMedia() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const screenShareTracks = useTracks([Track.Source.ScreenShare]);
  const isScreenSharing = screenShareTracks.some(
    (t) => t.participant.identity === localParticipant.identity,
  );

  const toggleMic = useCallback(async () => {
    const store = useMeetingRoomStore.getState();
    const next = !store.isMuted;
    try {
      await localParticipant.setMicrophoneEnabled(!next);
      store.setIsMuted(next);
    } catch (err) {
      console.error("Failed to toggle mic:", err);
      // 스토어 상태 복원 안 함 — 원래 상태 유지
    }
  }, [localParticipant]);

  const toggleCamera = useCallback(async () => {
    const store = useMeetingRoomStore.getState();
    const next = !store.isVideoOn;
    try {
      await localParticipant.setCameraEnabled(next);
      store.setIsVideoOn(next);
    } catch (err) {
      console.error("Failed to toggle camera:", err);
      // SDK 실패 시 스토어 업데이트 안 함 → UI가 실제 상태와 일치
    }
  }, [localParticipant]);

  const toggleScreenShare = useCallback(async () => {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
    } catch (err) {
      console.error("Failed to toggle screen share:", err);
    }
  }, [isScreenSharing, localParticipant]);

  return {
    localParticipant,
    room,
    isScreenSharing,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
  };
}
