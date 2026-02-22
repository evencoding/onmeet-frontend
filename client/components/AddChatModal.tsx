import { X, MessageCircle, Check } from "lucide-react";
import { useState } from "react";

interface AddChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AddChatModal({
  isOpen,
  onClose,
  onConfirm,
}: AddChatModalProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleConfirm = () => {
    setIsAdded(true);
    onConfirm();
    setTimeout(() => {
      onClose();
      setIsAdded(false);
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
            {!isAdded ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  채팅 추가
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700 mb-8">
                  이 회의에 실시간 채팅을 추가하시겠습니까?
                </p>

                <p className="text-center text-sm dark:text-white/50 light:text-purple-600 mb-8">
                  채팅을 통해 회의 중에 참여자들과 메시지를 주고받을 수 있습니다
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all border dark:border-purple-500/30 light:border-purple-300/50 dark:text-white/70 light:text-purple-600 hover:dark:bg-purple-500/10 hover:light:bg-purple-100/50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/50"
                  >
                    추가하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center dark:text-white light:text-purple-900 mb-4">
                  완료!
                </h2>

                <p className="text-center dark:text-white/70 light:text-purple-700">
                  채팅이 추가되었습니다
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
