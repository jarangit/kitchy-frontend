import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { userServiceApi } from "@/features/auth/services/user";
import { appBus } from "@/shared/events/app-events";
import { authChannel } from "@/features/auth/events/auth-channel";
import type { IUser } from "@/features/auth/types/auth.model";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";

const TOKEN_KEY = "token";

export const hasAuthToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY);

/**
 * Shared post-auth side-effects: persist token, refresh me, broadcast.
 * Keeps login / register / googleLogin consistent.
 */
function persistTokenAndNotify(
  accessToken: string | undefined,
  queryClient: QueryClient
) {
  if (!accessToken) return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  queryClient.invalidateQueries({ queryKey: ["me"] });
  appBus.emit("auth:login", {});
  authChannel.broadcastLogin();
}

/**
 * Query the current authenticated user.
 * Enabled only when an auth token is present to avoid a guaranteed 401.
 */
export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await userServiceApi.getMe();
      return data as IUser;
    },
    enabled: hasAuthToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Login mutation. On success, persists the token and triggers
 * a refetch of `["me"]` so AuthProvider resolves the new user.
 * Also broadcasts to sibling tabs via BroadcastChannel and fires
 * an in-app `auth:login` event for cache observers.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const { data } = await userServiceApi.login(vars.email, vars.password);
      return data as { access_token?: string };
    },
    onSuccess: (data) => {
      persistTokenAndNotify(data?.access_token, queryClient);
    },
  });
};

/**
 * Register mutation. Backend returns the same shape as /login
 * (`{ access_token }`), so the user lands fully authenticated and
 * the downstream flow can drop them straight into /onboarding.
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: IRegisterRequest) => {
      const { data } = await userServiceApi.register(vars);
      return data as { access_token?: string };
    },
    onSuccess: (data) => {
      persistTokenAndNotify(data?.access_token, queryClient);
    },
  });
};

/**
 * Google sign-in mutation. Takes a Google ID token from the
 * frontend SDK, sends to the backend to exchange for our own
 * access_token. Works for both sign-up and sign-in — backend
 * decides whether to create or attach to an existing user.
 */
export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { idToken: string }) => {
      const { data } = await userServiceApi.googleLogin(vars.idToken);
      return data as { access_token?: string };
    },
    onSuccess: (data) => {
      persistTokenAndNotify(data?.access_token, queryClient);
    },
  });
};

/**
 * Clears the auth token and every cached query so no stale
 * user data lingers after logout. Notifies sibling tabs too.
 */
export const clearAuthState = (queryClient: {
  clear: () => void;
}) => {
  localStorage.removeItem(TOKEN_KEY);
  queryClient.clear();
  appBus.emit("auth:logout", {});
  authChannel.broadcastLogout();
};
