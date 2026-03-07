import "./global.css";

import "@/shared/lib/firebase";

import * as Sentry from "@sentry/react";
import { Suspense, lazy } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/features/auth/context";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,
    sendDefaultPii: true,
    integrations: [
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const Index = lazy(() => import("@/features/dashboard/pages/Index"));
const MeetingRoom = lazy(() => import("@/features/meeting/pages/MeetingRoom"));
const Schedule = lazy(() => import("@/features/schedule/pages/Schedule"));
const Summary = lazy(() => import("@/features/dashboard/pages/Summary"));
const TeamBoard = lazy(() => import("@/features/team/pages/TeamBoard"));
const Team = lazy(() => import("@/features/team/pages/Team"));
const MyPage = lazy(() => import("@/features/settings/pages/MyPage"));
const CompanyManagement = lazy(() => import("@/features/settings/pages/CompanyManagement"));
const Login = lazy(() => import("@/features/auth/pages/Login"));
const SignupFlow = lazy(() => import("@/features/auth/pages/SignupFlow"));
const CompanySignup = lazy(() => import("@/features/auth/pages/CompanySignup"));
const EmployeeSignup = lazy(() => import("@/features/auth/pages/EmployeeSignup"));
const InviteMembers = lazy(() => import("@/features/auth/pages/InviteMembers"));
const Landing = lazy(() => import("@/pages/Landing"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

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

  return <Index />;
};

const SentryRoutes = Sentry.withSentryRouting(Routes);

const AppContent = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <SentryRoutes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/signup/company" element={<CompanySignup />} />
        <Route path="/signup/employee" element={<EmployeeSignup />} />
        <Route path="/signup/invite-members" element={<InviteMembers />} />
        <Route path="/" element={<HomeRoute />} />
        <Route
          path="/meeting/:roomId"
          element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <TeamBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:teamId"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <CompanyManagement />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </SentryRoutes>
    </Suspense>
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
