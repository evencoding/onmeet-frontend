import { Loader, X } from "lucide-react";

interface WaitingRoomProps {
  onCancel: () => void;
}

export default function WaitingRoom({ onCancel }: WaitingRoomProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-900 z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="relative w-20 h-20 mx-auto">
          <Loader className="w-20 h-20 text-purple-400 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            호스트 승인 대기 중
          </h2>
          <p className="text-white/60 text-sm">
            호스트가 입장을 승인하면 자동으로 회의에 참여합니다.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/30 hover:bg-purple-500/50 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <X className="w-4 h-4" />
          취소
        </button>
      </div>
    </div>
  );
}
