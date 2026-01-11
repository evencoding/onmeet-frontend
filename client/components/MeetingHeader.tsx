import { MoreVertical } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="px-6 py-4 border-b border-border/30 bg-white/40 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold">
          C
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">Chloe Choi</div>
          <div className="text-xs text-muted-foreground">staff-and</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
