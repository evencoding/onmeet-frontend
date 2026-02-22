import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import MeetingRoom from "./pages/MeetingRoom";
import Schedule from "./pages/Schedule";
import Summary from "./pages/Summary";
import MeetingRecords from "./pages/MeetingRecords";
import TeamBoard from "./pages/TeamBoard";
import Team from "./pages/Team";
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

const AppContent = () => (
  <BrowserRouter>
    <Routes>
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
            <MeetingRecords />
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
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
