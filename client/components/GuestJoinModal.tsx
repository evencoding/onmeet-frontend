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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-gradient-to-r from-brand-50 to-brand-50/30">
          <h2 className="text-xl font-bold text-foreground">회의 참여하기</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Guest Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
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
              className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none transition-all text-sm ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-border/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Guest Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
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
              className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none transition-all text-sm resize-none ${
                errors.description
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-border/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Info Text */}
          <div className="p-3 bg-blue-50/50 border border-blue-200/50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              💡 이 정보는 회의 참석자에게 표시되며, 언제든 변경할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/20 px-6 py-4 bg-white/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border/60 text-foreground text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={handleJoin}
            disabled={!guestName.trim() || !guestDescription.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            회의 입장
          </button>
        </div>
      </div>
    </div>
  );
}
