// src/contexts/AuthContext.tsx
import { useQueryClient } from "@tanstack/react-query";
import type { IAuthContext } from "@/features/auth/types/auth.model";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import {
  clearAuthState,
  hasAuthToken,
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useMeQuery,
} from "@/features/auth/hooks/use-auth-queries";
import { authChannel } from "@/features/auth/events/auth-channel";
import { AuthContext } from "@/features/auth/context/auth-context";
import { appBus } from "@/shared/events/app-events";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  // Cross-tab auth sync: when another tab logs out, drop our caches and
  // redirect here too; when another tab logs in, refetch ["me"] so we
  // hydrate without requiring a page reload.
  useEffect(() => {
    const unsubscribeChannel = authChannel.subscribe((event) => {
      if (event.type === "logout") {
        clearAuthState(queryClient);
        navigate("/login");
      } else if (event.type === "login") {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    });

    const unsubscribeUnauthorized = appBus.on("auth:unauthorized", () => {
      clearAuthState(queryClient);
      navigate("/login");
    });

    return () => {
      unsubscribeChannel();
      unsubscribeUnauthorized();
    };
  }, [queryClient, navigate]);

  const login = async (email: string, password: string) => {
    const data = await loginMutation.mutateAsync({ email, password });
    if (data?.access_token) {
      // `useMeQuery` is enabled as soon as the token lands in localStorage,
      // and `onSuccess` inside the mutation invalidates ["me"] so the
      // provider picks up the fresh user automatically.
      // Dashboard decides whether to send the user to /onboarding.
      navigate("/dashboard");
    }
  };

  const register = async (payload: IRegisterRequest) => {
    const data = await registerMutation.mutateAsync(payload);
    if (data?.access_token) {
      // New users have zero stores by definition → wizard takes over.
      navigate("/onboarding");
    }
  };

  const googleLogin = async (idToken: string) => {
    const data = await googleLoginMutation.mutateAsync({ idToken });
    if (data?.access_token) {
      // Could be a new or returning user; /dashboard decides the next hop
      // (empty stores → redirect to /onboarding via UserDashboard logic).
      navigate("/dashboard");
    }
  };

  const logout = async () => {
    clearAuthState(queryClient);
    navigate("/login");
  };

  const hasToken = hasAuthToken();
  const value: IAuthContext = {
    user: meQuery.data ?? null,
    loading:
      meQuery.isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      googleLoginMutation.isPending,
    isAuthenticated: hasToken && !!meQuery.data,
    isReady: !hasToken || meQuery.isSuccess || meQuery.isError,
    login,
    register,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
