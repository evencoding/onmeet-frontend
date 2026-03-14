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
    store.setIsMuted(next);
    await localParticipant.setMicrophoneEnabled(!next);
  }, [localParticipant]);

  const toggleCamera = useCallback(async () => {
    const store = useMeetingRoomStore.getState();
    const next = !store.isVideoOn;
    store.setIsVideoOn(next);
    await localParticipant.setCameraEnabled(next);
  }, [localParticipant]);

  const toggleScreenShare = useCallback(async () => {
    await localParticipant.setScreenShareEnabled(!isScreenSharing);
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
