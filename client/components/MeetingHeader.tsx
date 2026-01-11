import { Search, Share2, RotateCcw, MoreVertical } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
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
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop"
            alt="User avatar"
            className="w-5 h-5 rounded-full"
          />
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
