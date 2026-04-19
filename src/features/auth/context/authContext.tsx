// src/contexts/AuthContext.tsx
import { useQueryClient } from "@tanstack/react-query";
import type { IAuthContext } from "@/features/auth/types/auth.model";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import {
  clearAuthState,
  useLoginMutation,
  useMeQuery,
} from "@/features/auth/hooks/use-auth-queries";
import { authChannel } from "@/features/auth/events/auth-channel";

export const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();

  // Cross-tab auth sync: when another tab logs out, drop our caches and
  // redirect here too; when another tab logs in, refetch ["me"] so we
  // hydrate without requiring a page reload.
  useEffect(() => {
    return authChannel.subscribe((event) => {
      if (event.type === "logout") {
        queryClient.clear();
        navigate("/login");
      } else if (event.type === "login") {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    });
  }, [queryClient, navigate]);

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
