import "./global.css";

// Initialize Firebase
import "@/lib/firebase";

import * as Sentry from "@sentry/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Initialize Sentry
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
import Index from "./pages/Index";
import MeetingRoom from "./pages/MeetingRoom";
import Schedule from "./pages/Schedule";
import Summary from "./pages/Summary";
import TeamBoard from "./pages/TeamBoard";
import Team from "./pages/Team";
import MyPage from "./pages/MyPage";
import CompanyManagement from "./pages/CompanyManagement";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupFlow from "./pages/SignupFlow";
import CompanySignup from "./pages/CompanySignup";
import EmployeeSignup from "./pages/EmployeeSignup";
import InviteMembers from "./pages/InviteMembers";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const HomeRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Landing />;
  }

  return <Index />;
};

const SentryRoutes = Sentry.withSentryRouting(Routes);

const AppContent = () => (
  <BrowserRouter>
    <SentryRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupFlow />} />
      <Route path="/signup/company" element={<CompanySignup />} />
      <Route path="/signup/employee" element={<EmployeeSignup />} />
      <Route path="/signup/invite-members" element={<InviteMembers />} />
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/meeting"
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
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
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
