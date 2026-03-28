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
      {/* Dark mode — 깊은 보라+남색 그라데이션, 미세한 글로우 */}
      {theme === "dark" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0612]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-950/80 via-transparent to-indigo-950/40" />
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/8 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/6 rounded-full filter blur-[100px]" />
        </div>
      )}

      {/* Light mode — 깨끗한 회색+보라 틴트 */}
      {theme === "light" && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#f5f3f7]" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-100/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full filter blur-[100px]" />
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
            <div className="hidden lg:flex lg:w-96 border-l flex-col overflow-hidden dark:border-purple-500/20 light:border-purple-200/60 dark:bg-purple-950/40 light:bg-white backdrop-blur-xl">
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
