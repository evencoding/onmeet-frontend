import { memo, useRef, useEffect } from "react";
import {
  useLocalParticipant,
  useParticipantTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export default memo(function LocalVideoPreview() {
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
});
