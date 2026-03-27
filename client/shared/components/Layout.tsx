import Sidebar from "./Sidebar";
import MeetingHeader from "./MeetingHeader";
import AIMeetingSearch from "@/features/dashboard/components/AIMeetingSearch";
import RecentMeetings from "@/features/dashboard/components/RecentMeetings";
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
  const [_selectedTeamId, setSelectedTeamId] = useState<string>("");
  const { theme } = useTheme();

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Dark mode — purple blob background */}
      {theme === "dark" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-purple-900 overflow-hidden">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-20 -right-60 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Light mode — soft purple background */}
      {theme === "light" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50/60 via-white to-pink-50/40 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-40 w-[450px] h-[450px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto px-8 py-8">{children}</div>

          {showAIPanel && (
            <div className="hidden lg:block">
              <AIMeetingSearch />
            </div>
          )}

          {showRecentPanel && (
            <div className="hidden lg:flex lg:w-96 border-l flex-col overflow-hidden dark:border-purple-500/20 light:border-purple-200/40 dark:bg-purple-950/40 light:bg-white/60 backdrop-blur-md">
              <div className="px-6 py-4 border-b dark:border-purple-500/20 light:border-purple-200/40">
                <h2 className="text-base font-semibold om-text-primary">
                  최근 회의 기록
                </h2>
                <p className="text-xs mt-1 om-text-muted">최근에 열린 회의들</p>
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
