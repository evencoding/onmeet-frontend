import Sidebar from "./Sidebar";
import MeetingHeader from "./MeetingHeader";
import AIMeetingSearch from "@/features/dashboard/components/AIMeetingSearch";
import RecentMeetings from "@/features/dashboard/components/RecentMeetings";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/shared/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
  showAIPanel?: boolean;
  showRecentPanel?: boolean;
}

export default function Layout({
  children,
  showAIPanel = false,
  showRecentPanel = false,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const { theme } = useTheme();

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Subtle animated gradient background */}
      {theme === "dark" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-20 -right-60 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        </div>
      )}

      {/* Light mode background - clean and minimal */}
      {theme === "light" && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-80 w-96 h-96 bg-blue-100/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-40 -left-60 w-96 h-96 bg-blue-50/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      )}

      <div className="hidden md:block md:w-72">
        <Sidebar onTeamSelect={setSelectedTeamId} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-72 h-screen" onClick={(e) => e.stopPropagation()}>
            <Sidebar onTeamSelect={setSelectedTeamId} />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <MeetingHeader />

        {/* Content area with right panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left content */}
          <div className="flex-1 overflow-y-auto px-8 py-8">{children}</div>

          {/* Right panel - AI Meeting Search or Recent Meetings */}
          {showAIPanel && (
            <div className="hidden lg:block">
              <AIMeetingSearch />
            </div>
          )}

          {showRecentPanel && (
            <div className="hidden lg:flex lg:w-96 border-l flex-col overflow-hidden border-border/20 bg-background/40 backdrop-blur-md">
              <div className="px-6 py-4 border-b border-border/20 bg-background/20">
                <h2 className="text-base font-semibold text-foreground">
                  최근 회의 기록
                </h2>
                <p className="text-xs mt-1 text-muted-foreground">최근에 열린 회의들</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <RecentMeetings />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
