export const routePrefetchMap: Record<string, () => void> = {
  "/": () => {},
  "/schedule": () => { import("@/features/schedule/pages/Schedule"); },
  "/summary": () => { import("@/features/dashboard/pages/Summary"); },
  "/records": () => { import("@/features/dashboard/pages/Summary"); },
  "/board": () => { import("@/features/team/pages/TeamBoard"); },
  "/mypage": () => { import("@/features/settings/pages/MyPage"); },
  "/company": () => { import("@/features/settings/pages/CompanyManagement"); },
};
