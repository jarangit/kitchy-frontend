// src/hooks/useAuth.ts
import { AuthContext } from "@/features/auth/context/authContext";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);
