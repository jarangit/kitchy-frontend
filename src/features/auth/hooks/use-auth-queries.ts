import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userServiceApi } from "@/features/auth/services/user";
import type { IUser } from "@/features/auth/types/auth.model";

const TOKEN_KEY = "token";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY);

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
    enabled: hasToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Login mutation. On success, persists the token and triggers
 * a refetch of `["me"]` so AuthProvider resolves the new user.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const { data } = await userServiceApi.login(vars.email, vars.password);
      return data as { access_token?: string };
    },
    onSuccess: (data) => {
      if (data?.access_token) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

/**
 * Clears the auth token and every cached query so no stale
 * user data lingers after logout.
 */
export const clearAuthState = (queryClient: {
  clear: () => void;
}) => {
  localStorage.removeItem(TOKEN_KEY);
  queryClient.clear();
};
