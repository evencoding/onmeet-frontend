import Sidebar from "./Sidebar";
import MeetingHeader from "./MeetingHeader";
import AIMeetingSearch from "./AIMeetingSearch";
import RecentMeetings from "./RecentMeetings";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [selectedTeamId, setSelectedTeamId] = useState<string>("marketing");
  const { theme } = useTheme();

  return (
    <div className="flex h-screen bg-background relative overflow-hidden dark:bg-background light:bg-gradient-to-br light:from-purple-50 light:via-white light:to-purple-50">
      {/* Animated gradient background */}
      {theme === "dark" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-purple-900">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      )}

      {/* Sidebar - hidden on mobile, visible on md and above */}
      <div className="hidden md:block md:w-72">
        <Sidebar onTeamSelect={setSelectedTeamId} />
      </div>

      {/* Mobile sidebar */}
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

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <MeetingHeader />

        {/* Content area with right panel */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

          {/* Right panel - AI Meeting Search or Recent Meetings */}
          {showAIPanel && (
            <div className="hidden lg:block">
              <AIMeetingSearch />
            </div>
          )}

          {showRecentPanel && (
            <div className="hidden lg:flex lg:w-96 border-l flex-col overflow-hidden dark:border-border/30 dark:bg-white/40 dark:backdrop-blur-md light:border-purple-300/50 light:bg-white">
              <div className="px-6 py-4 border-b dark:border-border/30 dark:bg-white/50 light:border-purple-300/50 light:bg-purple-50/50">
                <h2 className="text-lg font-bold text-foreground">
                  최근 회의 기록
                </h2>
                <p className="text-xs mt-1 dark:text-text-sub light:text-purple-600">최근에 열린 회의들</p>
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
