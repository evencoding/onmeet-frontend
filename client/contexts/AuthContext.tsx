import { createContext, useContext, useCallback, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMe,
  useLogin,
  useLogout,
  AUTH_QUERY_KEY,
} from "@/hooks/useAuthQuery";
import type { UserResponseDto } from "@/lib/authApi";

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading: isMeLoading } = useMe();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
      await queryClient.refetchQueries({ queryKey: AUTH_QUERY_KEY });
    },
    [loginMutation, queryClient],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: isMeLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
