import { useState, useEffect } from "react";
import { X, CheckCircle, Loader } from "lucide-react";

interface AIRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onEnd: () => void;
  isRecording: boolean;
}

export default function AIRecordingModal({
  isOpen,
  onClose,
  onStart,
  onEnd,
  isRecording,
}: AIRecordingModalProps) {
  const [recordingStep, setRecordingStep] = useState<"initial" | "recording" | "completed">("initial");
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setRecordingStep("initial");
      setShowCompletion(false);
    }
  }, [isOpen]);

  const handleStartRecording = () => {
    onStart();
    onClose();
  };

  const handleEndRecording = () => {
    setRecordingStep("completed");
    onEnd();
    setTimeout(() => {
      setShowCompletion(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:from-white light:to-purple-50 border dark:border-purple-500/30 light:border-purple-300/40 rounded-3xl shadow-2xl w-full max-w-md dark:backdrop-blur-md light:backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/60 light:text-purple-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            {recordingStep === "initial" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AI</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  AI 회의록 생성
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700 mb-8">
                  지금부터 AI 회의록 생성이 시작됩니다
                </p>

                <p className="text-center text-sm dark:text-white/50 light:text-purple-600 mb-8">
                  회의 내용이 자동으로 기록되고 AI가 회의록을 작성합니다
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all border dark:border-purple-500/30 light:border-purple-300/50 dark:text-white/70 light:text-purple-600 hover:dark:bg-purple-500/10 hover:light:bg-purple-100/50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleStartRecording}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50"
                  >
                    시작하기
                  </button>
                </div>
              </>
            )}

            {recordingStep === "recording" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  회의록 기록 중
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700 mb-8">
                  지금까지의 회의가 AI 회의록으로 기록됩니다
                </p>

                <div className="flex items-center justify-center gap-2 mb-8 py-6 bg-red-500/20 rounded-2xl border border-red-500/30">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm font-semibold dark:text-red-300 light:text-red-600">
                    REC
                  </span>
                </div>

                <button
                  onClick={handleEndRecording}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-500/30"
                >
                  기록 종료하기
                </button>
              </>
            )}

            {recordingStep === "completed" && !showCompletion && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  처리 중입니다
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700 mb-8">
                  AI가 회의록을 생성하고 있습니다
                </p>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce animation-delay-2000"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce animation-delay-4000"></div>
                </div>
              </>
            )}

            {showCompletion && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  기록 완료!
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700 mb-8">
                  AI 회의록이 성공적으로 생성되었습니다
                </p>

                <p className="text-center text-sm dark:text-white/50 light:text-purple-600 mb-8">
                  회의록은 기록 페이지에서 확인할 수 있습니다
                </p>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50"
                >
                  확인
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
