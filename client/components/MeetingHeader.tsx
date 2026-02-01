import { MoreVertical } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="px-6 py-4 border-b border-purple-500/20 bg-purple-500/10 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
          C
        </div>
        <div>
          <div className="text-sm font-medium text-white/90">Chloe Choi</div>
          <div className="text-xs text-white/50">staff-and</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-white/50 hover:text-white/80">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
