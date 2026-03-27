import { memo, useEffect, useRef } from "react";
import { Track } from "livekit-client";
import { useParticipantTracks } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { MicOff, VideoOff } from "lucide-react";

interface ParticipantTileProps {
  participant: Participant;
  isSpeaking?: boolean;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default memo(function ParticipantTile({
  participant,
  isSpeaking,
  className = "",
}: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const tracks = useParticipantTracks(
    [Track.Source.Camera, Track.Source.Microphone],
    participant.identity,
  );

  const cameraTrack = tracks.find(
    (t) => t.source === Track.Source.Camera,
  );
  const micTrack = tracks.find(
    (t) => t.source === Track.Source.Microphone,
  );

  const isCameraEnabled = cameraTrack?.publication?.isSubscribed && !cameraTrack.publication.isMuted;
  const isMicMuted = !micTrack?.publication?.isSubscribed || micTrack.publication.isMuted;

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl && cameraTrack?.publication?.track) {
      cameraTrack.publication.track.attach(videoEl);
      return () => {
        cameraTrack.publication?.track?.detach(videoEl);
      };
    }
  }, [cameraTrack?.publication?.track]);

  const speaking = isSpeaking ?? participant.isSpeaking;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-black border-2 transition-all aspect-video ${
        speaking
          ? "border-purple-500 ring-2 ring-purple-500/50"
          : "border-purple-500/20"
      } ${className}`}
    >
      <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center relative">
        {isCameraEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {getInitials(participant.name || participant.identity)}
          </div>
        )}

        {speaking && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Speaking
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-sm font-semibold text-white">
            {participant.name || participant.identity}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
            {isMicMuted && <MicOff className="w-3 h-3" />}
            {!isCameraEnabled && <VideoOff className="w-3 h-3" />}
          </div>
        </div>

        {participant.metadata === "host" && (
          <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
            Host
          </div>
        )}
      </div>
    </div>
  );
});
