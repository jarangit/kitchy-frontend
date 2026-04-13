// src/contexts/AuthContext.tsx
import { userServiceApi } from "@/features/auth/services/user";
import type { IAuthContext } from "@/features/auth/types/auth.model";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

export const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await userServiceApi.getMe();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await userServiceApi.login(email, password);
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      await fetchUser();
      navigate("/dashboard");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
