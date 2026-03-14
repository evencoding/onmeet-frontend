import "./global.css";

import "@/shared/lib/firebase";

import * as Sentry from "@sentry/react";
import { Suspense, lazy } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/features/auth/context";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import Layout from "@/shared/components/Layout";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
    sendDefaultPii: true,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Direct imports for frequently visited pages (no lazy loading delay)
import Index from "@/features/dashboard/pages/Index";
import Landing from "@/pages/Landing";
import Login from "@/features/auth/pages/Login";

// Lazy imports for heavier/less frequent pages
const MeetingRoom = lazy(() => import("@/features/meeting/pages/MeetingRoom"));
const Schedule = lazy(() => import("@/features/schedule/pages/Schedule"));
const Summary = lazy(() => import("@/features/dashboard/pages/Summary"));
const TeamBoard = lazy(() => import("@/features/team/pages/TeamBoard"));
const Team = lazy(() => import("@/features/team/pages/Team"));
const MyPage = lazy(() => import("@/features/settings/pages/MyPage"));
const CompanyManagement = lazy(() => import("@/features/settings/pages/CompanyManagement"));
const SignupFlow = lazy(() => import("@/features/auth/pages/SignupFlow"));
const CompanySignup = lazy(() => import("@/features/auth/pages/CompanySignup"));
const EmployeeSignup = lazy(() => import("@/features/auth/pages/EmployeeSignup"));
const InviteMembers = lazy(() => import("@/features/auth/pages/InviteMembers"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ContentLoader = () => (
  <div className="flex-1 flex items-center justify-center py-32">
    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

/** Protected route that keeps Layout visible, only content area transitions */
function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Suspense fallback={<ContentLoader />}>
        <div className="animate-in fade-in duration-200">
          <Outlet />
        </div>
      </Suspense>
    </Layout>
  );
}

/** Protected route without Layout (e.g. MeetingRoom full-screen) */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

const HomeRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Landing />;

  return (
    <Layout>
      <div className="animate-in fade-in duration-200">
        <Index />
      </div>
    </Layout>
  );
};

const SentryRoutes = Sentry.withSentryRouting(Routes);

const AppContent = () => (
  <BrowserRouter>
    <SentryRoutes>
      {/* Public routes — direct import, no Suspense needed */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/signup"
        element={<Suspense fallback={<PageLoader />}><SignupFlow /></Suspense>}
      />
      <Route
        path="/signup/company"
        element={<Suspense fallback={<PageLoader />}><CompanySignup /></Suspense>}
      />
      <Route
        path="/signup/employee"
        element={<Suspense fallback={<PageLoader />}><EmployeeSignup /></Suspense>}
      />
      <Route
        path="/signup/invite-members"
        element={<Suspense fallback={<PageLoader />}><InviteMembers /></Suspense>}
      />

      {/* Home — auth-dependent, both pages direct-imported */}
      <Route path="/" element={<HomeRoute />} />

      {/* Protected routes with shared Layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/records" element={<Summary />} />
        <Route path="/board" element={<TeamBoard />} />
        <Route path="/team/:teamId" element={<Team />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/company" element={<CompanyManagement />} />
      </Route>

      {/* MeetingRoom — protected, full-screen (no Layout) */}
      <Route
        path="/meeting/:roomId"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <MeetingRoom />
            </Suspense>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>}
      />
    </SentryRoutes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
