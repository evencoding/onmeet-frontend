import { memo, useEffect, useRef } from "react";
import { useParticipants, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import ParticipantTile from "./ParticipantTile";
import { Monitor } from "lucide-react";

/** 화면 공유 전용 뷰 — 별도 video 엘리먼트로 렌더링 */
function ScreenShareView({ track }: { track: ReturnType<typeof useTracks>[number] }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    const mediaTrack = track.publication?.track;
    if (videoEl && mediaTrack) {
      mediaTrack.attach(videoEl);
      return () => { mediaTrack.detach(videoEl); };
    }
  }, [track.publication?.track]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-green-500 ring-2 ring-green-500/30 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain bg-black"
      />
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-green-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white">
        <Monitor className="w-3.5 h-3.5" />
        {track.participant.name || track.participant.identity}의 화면 공유
      </div>
    </div>
  );
}

export default memo(function VideoGrid() {
  const participants = useParticipants();
  const screenShareTracks = useTracks([Track.Source.ScreenShare]);
  const activeScreenShare = screenShareTracks.length > 0 ? screenShareTracks[0] : null;

  const { viewMode, currentSpeaker, isAIRecording } = useMeetingRoomStore(
    useShallow((s) => ({
      viewMode: s.viewMode,
      currentSpeaker: s.currentSpeaker,
      isAIRecording: s.isAIRecording,
    })),
  );

  // 화면 공유 중이면 → 화면 공유 메인 + 참가자 사이드바
  if (activeScreenShare) {
    return (
      <div className="flex h-full gap-4">
        <div className="flex-1 relative">
          <ScreenShareView track={activeScreenShare} />
          {isAIRecording && (
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white font-semibold">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              AI 회의록
            </div>
          )}
        </div>
        <div className="w-48 flex flex-col gap-2 overflow-y-auto">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.identity}
              participant={participant}
              className="w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  // 갤러리 모드
  if (viewMode === "gallery") {
    return (
      <div className="grid grid-cols-2 gap-4 h-full overflow-auto max-w-4xl mx-auto">
        {participants.slice(0, 4).map((participant) => (
          <ParticipantTile
            key={participant.identity}
            participant={participant}
          />
        ))}
      </div>
    );
  }

  // 스피커 모드
  return (
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
            onClick={() => useMeetingRoomStore.getState().setCurrentSpeaker(idx)}
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
  );
});
