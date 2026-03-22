import "./global.css";

import "@/shared/lib/firebase";

import * as Sentry from "@sentry/react";
import React, { Suspense, lazy, Component, type ReactNode, type ErrorInfo } from "react";
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

import Index from "@/features/dashboard/pages/Index";
import Landing from "@/pages/Landing";
import Login from "@/features/auth/pages/Login";

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
const PasswordReset = lazy(() => import("@/features/auth/pages/PasswordReset"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center space-y-4 max-w-md px-6">
            <h1 className="text-2xl font-bold text-white">문제가 발생했습니다</h1>
            <p className="text-white/60 text-sm">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침 해주세요.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function ProtectedLayout() {
  const { isAuthenticated, isLoading, isPasswordReset } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isPasswordReset) return <Navigate to="/password-reset" replace />;

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isPasswordReset } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isPasswordReset) return <Navigate to="/password-reset" replace />;

  return <>{children}</>;
}

function AuthOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { isManager } = useAuth();
  if (!isManager) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const HomeRoute = () => {
  const { isAuthenticated, isLoading, isPasswordReset } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Landing />;
  if (isPasswordReset) return <Navigate to="/password-reset" replace />;

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
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route
        path="/signup"
        element={<GuestRoute><Suspense fallback={<PageLoader />}><SignupFlow /></Suspense></GuestRoute>}
      />
      <Route
        path="/signup/company"
        element={<GuestRoute><Suspense fallback={<PageLoader />}><CompanySignup /></Suspense></GuestRoute>}
      />
      <Route
        path="/signup/employee"
        element={<GuestRoute><Suspense fallback={<PageLoader />}><EmployeeSignup /></Suspense></GuestRoute>}
      />
      <Route
        path="/invite-members"
        element={
          <AuthOnlyRoute>
            <Suspense fallback={<PageLoader />}><InviteMembers /></Suspense>
          </AuthOnlyRoute>
        }
      />

      <Route
        path="/password-reset"
        element={
          <AuthOnlyRoute>
            <Suspense fallback={<PageLoader />}><PasswordReset /></Suspense>
          </AuthOnlyRoute>
        }
      />

      <Route path="/" element={<HomeRoute />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/records" element={<Summary />} />
        <Route path="/board" element={<TeamBoard />} />
        <Route path="/team/:teamId" element={<Team />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/company" element={<ManagerRoute><CompanyManagement /></ManagerRoute>} />
      </Route>

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
        <ErrorBoundary>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
