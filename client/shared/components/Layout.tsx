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
      {/* Dark mode — 중립 블랙 + 미세 보라 글로우 포인트 */}
      {theme === "dark" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#101014]" />
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full filter blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full filter blur-[100px]" />
        </div>
      )}

      {/* Light mode — 배경은 회색 톤, 카드/사이드바는 흰색으로 구분 */}
      {theme === "light" && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#eae8ef]" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-100/30 via-transparent to-transparent" />
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
            <div className="hidden lg:flex lg:w-96 border-l flex-col overflow-hidden dark:border-white/[0.06] light:border-purple-200 dark:bg-[#111116]/40 light:bg-white light:shadow-[-4px_0_16px_rgba(0,0,0,0.04)] backdrop-blur-xl">
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
