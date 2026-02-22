import { MoreVertical } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function MeetingHeader() {
  return (
    <div className="px-6 py-4 border-b dark:border-purple-500/20 dark:bg-purple-500/10 dark:backdrop-blur-md light:border-purple-200 light:bg-white/50 light:backdrop-blur-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
          C
        </div>
        <div>
          <div className="text-sm font-medium dark:text-white/90 light:text-purple-900">Chloe Choi</div>
          <div className="text-xs dark:text-white/50 light:text-purple-600">staff-and</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/50 dark:hover:text-white/80 light:text-purple-600 light:hover:text-purple-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
