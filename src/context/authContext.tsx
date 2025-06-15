// src/contexts/AuthContext.tsx
import { userServiceApi } from "@/service/user";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";

interface AuthContextType {
  user: any; // Replace 'any' with your user type if available
  loading: boolean;
  login: (credentials: { email: string; passowrd: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await userServiceApi.getBydId(1);
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials: { email: string; passowrd: string }) => {
    const res = await userServiceApi.login(
      credentials.email,
      credentials.passowrd
    );
    localStorage.setItem("accessToken", res.data.accessToken);
    await fetchUser();
    navigate("/");
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
