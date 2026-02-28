import { AlertCircle, X } from "lucide-react";

interface ExitMeetingModalProps {
  isOpen: boolean;
  isHost: boolean;
  isAIRecording: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExitMeetingModal({
  isOpen,
  isHost,
  isAIRecording,
  onClose,
  onConfirm,
}: ExitMeetingModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-purple-900/40">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">회의를 나가시겠습니까?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-500/20 rounded transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* AI Recording Warning */}
          {isAIRecording && (
            <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-300">
                <span className="font-semibold">⚠️ AI 회의록 진행 중</span>
                <br />
                회의를 나가면 AI 회의록도 함께 종료됩니다.
              </p>
            </div>
          )}

          {/* Host/Guest Message */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-white/80">
              {isHost ? (
                <>
                  <span className="font-semibold text-purple-300">호스트</span>
                  <br />
                  회의를 종료합니다. 모든 참여자의 연결이 끊어집니다.
                </>
              ) : (
                <>
                  <span className="font-semibold text-purple-300">참여자</span>
                  <br />
                  회의에서 나갑니다. 다른 참여자의 회의는 계속됩니다.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/40 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {isHost ? "회의 종료" : "나가기"}
          </button>
        </div>
      </div>
    </div>
  );
}
