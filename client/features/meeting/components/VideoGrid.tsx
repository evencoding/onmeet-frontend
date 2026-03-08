import { memo } from "react";
import { useParticipants } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import ParticipantTile from "./ParticipantTile";

export default memo(function VideoGrid() {
  const participants = useParticipants();

  const { viewMode, currentSpeaker, isAIRecording } = useMeetingRoomStore(
    useShallow((s) => ({
      viewMode: s.viewMode,
      currentSpeaker: s.currentSpeaker,
      isAIRecording: s.isAIRecording,
    })),
  );

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
