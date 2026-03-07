import "./global.css";

import "@/lib/firebase";

import * as Sentry from "@sentry/react";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

const Index = lazy(() => import("./pages/Index"));
const MeetingRoom = lazy(() => import("./pages/MeetingRoom"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Summary = lazy(() => import("./pages/Summary"));
const TeamBoard = lazy(() => import("./pages/TeamBoard"));
const Team = lazy(() => import("./pages/Team"));
const MyPage = lazy(() => import("./pages/MyPage"));
const CompanyManagement = lazy(() => import("./pages/CompanyManagement"));
const Login = lazy(() => import("./pages/Login"));
const SignupFlow = lazy(() => import("./pages/SignupFlow"));
const CompanySignup = lazy(() => import("./pages/CompanySignup"));
const EmployeeSignup = lazy(() => import("./pages/EmployeeSignup"));
const InviteMembers = lazy(() => import("./pages/InviteMembers"));
const Landing = lazy(() => import("./pages/Landing"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
