import { createContext } from "react";
import type { IAuthContext } from "@/features/auth/types/auth.model";

export const AuthContext = createContext<IAuthContext | null>(null);
