import { X, Send, Clock } from "lucide-react";
import { useState } from "react";

interface AIRecordingRequestModalProps {
  isOpen: boolean;
  isHost: boolean;
  isAIRecording: boolean;
  onClose: () => void;
  onRequestSend: () => void;
  onApprove: () => void;
  onReject: () => void;
  pendingRequests?: Array<{
    id: string;
    senderName: string;
    timestamp: string;
  }>;
}

export default function AIRecordingRequestModal({
  isOpen,
  isHost,
  isAIRecording,
  onClose,
  onRequestSend,
  onApprove,
  onReject,
  pendingRequests = [],
}: AIRecordingRequestModalProps) {
  const [requestSent, setRequestSent] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestSend = () => {
    setRequestSent(true);
    onRequestSend();
    setTimeout(() => {
      setRequestSent(false);
      onClose();
    }, 2000);
  };

  const handleApproveRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    onApprove();
    setTimeout(() => {
      setSelectedRequestId(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-purple-900/40">
          <h2 className="text-lg font-bold text-white">
            {isHost ? "AI 회의록 요청" : "AI 회의록 요청하기"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-500/20 rounded transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {isHost ? (
            // HOST VIEW - Show pending requests
            <>
              <div className="text-sm text-white/80 mb-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-center py-4 text-white/60">
                    AI 회의록 요청이 없습니다
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="font-semibold text-white mb-3">
                      대기 중인 요청 ({pendingRequests.length})
                    </p>
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-white">
                              {request.senderName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                              <Clock className="w-3 h-3" />
                              {request.timestamp}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-white/70 mb-3">
                          AI 회의록을 시작해달라고 요청했습니다
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              selectedRequestId === request.id
                                ? "bg-green-600 text-white"
                                : "bg-green-600/80 hover:bg-green-600 text-white"
                            }`}
                          >
                            {selectedRequestId === request.id ? "승인됨" : "승인"}
                          </button>
                          <button
                            onClick={() => onReject()}
                            className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm font-semibold transition-all"
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Status */}
              {isAIRecording && (
                <div className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                  <p className="text-sm text-green-300 font-semibold">
                    ✓ AI 회의록 진행 중
                  </p>
                </div>
              )}
            </>
          ) : (
            // GUEST VIEW - Send request
            <>
              {requestSent ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600/20 mb-3">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white mb-2">
                    요청 전송됨
                  </p>
                  <p className="text-xs text-white/60">
                    호스트가 승인 대기 중입니다
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-white/90">
                      호스트에게 AI 회의록 시작을 요청합니다
                    </p>
                    <p className="text-xs text-white/60 mt-2">
                      호스트가 승인하면 AI 회의록이 시작됩니다
                    </p>
                  </div>

                  {isAIRecording && (
                    <div className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                      <p className="text-sm text-green-300 font-semibold">
                        ✓ AI 회의록 진행 중
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/40 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {requestSent ? "완료" : "취소"}
          </button>
          {!isHost && !requestSent && (
            <button
              onClick={handleRequestSend}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all"
            >
              <Send className="w-4 h-4" />
              요청 전송
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
