import { memo } from "react";
import { Maximize, X, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useParticipants } from "@livekit/components-react";
import { useShallow } from "zustand/react/shallow";
import { useMeetingRoomStore } from "../store";
import { useMeetingMedia } from "../hooks/useMeetingMedia";
import ExitMeetingModal from "./ExitMeetingModal";
import LocalVideoPreview from "./LocalVideoPreview";

interface PIPModeViewProps {
  isHost: boolean;
  onDisconnect: () => void;
}

export default memo(function PIPModeView({ isHost, onDisconnect }: PIPModeViewProps) {
  const participants = useParticipants();
  const { toggleMic, toggleCamera } = useMeetingMedia();

  const { isMuted, isVideoOn, isAIRecording, isPIPMode, showExitModal } =
    useMeetingRoomStore(
      useShallow((s) => ({
        isMuted: s.isMuted,
        isVideoOn: s.isVideoOn,
        isAIRecording: s.isAIRecording,
        isPIPMode: s.isPIPMode,
        showExitModal: s.showExitModal,
      })),
    );

  if (!isPIPMode) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 rounded-2xl shadow-2xl w-96 h-72 border border-purple-500/30 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-900/40 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">회의 진행 중</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => useMeetingRoomStore.getState().setIsPIPMode(false)}
              className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors text-white"
              title="전체보기로 돌아가기"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={() => useMeetingRoomStore.getState().setShowExitModal(true)}
              className="p-1 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
              title="회의 나가기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-black overflow-hidden">
          {isVideoOn ? (
            <LocalVideoPreview />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black">
              <VideoOff className="w-12 h-12 text-white/30" />
            </div>
          )}

          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-3">
            <button
              onClick={toggleMic}
              className={`p-2 rounded-full transition-all ${
                isMuted
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-2 rounded-full transition-all ${
                !isVideoOn
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {isAIRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              녹화 중
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-purple-500/20 bg-purple-900/40 text-xs text-white/70">
          {participants.length}명 참여 중
        </div>
      </div>

      <ExitMeetingModal
        isOpen={showExitModal}
        isHost={isHost}
        isAIRecording={isAIRecording}
        onClose={() => useMeetingRoomStore.getState().setShowExitModal(false)}
        onConfirm={onDisconnect}
      />
    </div>
  );
});
