// src/contexts/AuthContext.tsx
import { useQueryClient } from "@tanstack/react-query";
import type { IAuthContext } from "@/features/auth/types/auth.model";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import {
  clearAuthState,
  useLoginMutation,
  useMeQuery,
} from "@/features/auth/hooks/use-auth-queries";

export const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();

  const login = async (email: string, password: string) => {
    const data = await loginMutation.mutateAsync({ email, password });
    if (data?.access_token) {
      // `useMeQuery` is enabled as soon as the token lands in localStorage,
      // and `onSuccess` inside the mutation invalidates ["me"] so the
      // provider picks up the fresh user automatically.
      navigate("/dashboard");
    }
  };

  const logout = async () => {
    clearAuthState(queryClient);
    navigate("/login");
  };

  const value: IAuthContext = {
    user: meQuery.data ?? null,
    loading: meQuery.isLoading || loginMutation.isPending,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
