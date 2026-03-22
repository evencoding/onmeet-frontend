import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// ── Mock useAuth ──

const mockAuth = {
  user: null as Record<string, unknown> | null,
  isAuthenticated: false,
  isLoading: false,
  isPasswordReset: false,
  isManager: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock("@/features/auth/context", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: () => mockAuth,
}));

// ── Route guard components (mirror App.tsx logic) ──

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = mockAuth;
  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = mockAuth;
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ManagerRoute({ children }: { children: ReactNode }) {
  const { isManager } = mockAuth;
  if (!isManager) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ── Helpers ──

function LocationDisplay() {
  // Use window.location since MemoryRouter doesn't expose location
  return null;
}

function renderWithRouter(initialEntries: string[], routes: ReactNode) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        {routes}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

// ── Tests ──

beforeEach(() => {
  mockAuth.user = null;
  mockAuth.isAuthenticated = false;
  mockAuth.isLoading = false;
  mockAuth.isPasswordReset = false;
  mockAuth.isManager = false;
});

describe("GuestRoute", () => {
  it("renders children when not authenticated", () => {
    renderWithRouter(
      ["/login"],
      <Route
        path="/login"
        element={
          <GuestRoute>
            <div>Guest Content</div>
          </GuestRoute>
        }
      />,
    );
    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  it("redirects to / when authenticated", () => {
    mockAuth.isAuthenticated = true;
    renderWithRouter(
      ["/login"],
      <Route
        path="/login"
        element={
          <GuestRoute>
            <div>Guest Content</div>
          </GuestRoute>
        }
      />,
    );
    expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    mockAuth.isAuthenticated = true;
    renderWithRouter(
      ["/dashboard"],
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        }
      />,
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderWithRouter(
      ["/dashboard"],
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        }
      />,
    );
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});

describe("ManagerRoute", () => {
  it("renders children when user is manager", () => {
    mockAuth.isAuthenticated = true;
    mockAuth.isManager = true;
    renderWithRouter(
      ["/company"],
      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <ManagerRoute>
              <div>Manager Content</div>
            </ManagerRoute>
          </ProtectedRoute>
        }
      />,
    );
    expect(screen.getByText("Manager Content")).toBeInTheDocument();
  });

  it("redirects to / when user is not manager", () => {
    mockAuth.isAuthenticated = true;
    mockAuth.isManager = false;
    renderWithRouter(
      ["/company"],
      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <ManagerRoute>
              <div>Manager Content</div>
            </ManagerRoute>
          </ProtectedRoute>
        }
      />,
    );
    expect(screen.queryByText("Manager Content")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
