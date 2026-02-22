import { useState } from "react";
import { X } from "lucide-react";

interface GuestJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (guestName: string, guestDescription: string) => void;
}

export default function GuestJoinModal({
  isOpen,
  onClose,
  onJoin,
}: GuestJoinModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestDescription, setGuestDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const handleValidation = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!guestName.trim()) {
      newErrors.name = "이름을 입력해주세요";
    } else if (guestName.trim().length < 2) {
      newErrors.name = "이름은 2글자 이상이어야 합니다";
    }

    if (!guestDescription.trim()) {
      newErrors.description = "설명을 입력해주세요";
    } else if (guestDescription.trim().length < 5) {
      newErrors.description = "설명은 5글자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJoin = () => {
    if (handleValidation()) {
      onJoin(guestName.trim(), guestDescription.trim());
      setGuestName("");
      setGuestDescription("");
      setErrors({});
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleJoin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900/40 via-black/80 to-pink-900/30 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-purple-500/30 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/40 to-black/60">
          <h2 className="text-xl font-bold text-white/90">회의 참여하기</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 bg-black/40">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              이름
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="게스트 이름을 입력하세요"
              className={`w-full px-4 py-3 border rounded-lg bg-purple-500/10 focus:outline-none transition-all text-sm text-white placeholder-white/40 ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Guest Description */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              설명 (소속/역할)
            </label>
            <textarea
              value={guestDescription}
              onChange={(e) => {
                setGuestDescription(e.target.value);
                if (errors.description) {
                  setErrors({ ...errors, description: undefined });
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder="예) 영업팀 / 프로젝트 담당자"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg bg-purple-500/10 focus:outline-none transition-all text-sm resize-none text-white placeholder-white/40 ${
                errors.description
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Info Text */}
          <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
            <p className="text-xs text-purple-300 font-medium">
              이 정보는 회의 참석자에게 표시되며, 언제든 변경할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/20 px-6 py-4 bg-purple-900/20 flex gap-3 backdrop-blur-md">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-purple-500/30 text-white/90 text-sm font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={handleJoin}
            disabled={!guestName.trim() || !guestDescription.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            회의 입장
          </button>
        </div>
      </div>
    </div>
  );
}
