import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeJwtPayload, loginApi, signup as signupApi } from "@/lib/api";

type Role = "admin" | "user" | "guest";

export interface AuthUser {
  username: string;
  role: Role;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (payload: { username: string; password: string }) => Promise<AuthUser>;
  signup: (payload: {
    username: string;
    password: string;
    role?: Role;
  }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "authToken";

function getUserFromToken(token: string | null): AuthUser | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    username: payload.username,
    role: (payload.role as Role) ?? "user",
    email: payload.email,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() =>
    getUserFromToken(localStorage.getItem(TOKEN_KEY))
  );

  useEffect(() => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }, [token]);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const res = await loginApi(username, password);
    const t = res?.token;
    if (!t) throw new Error("No token returned");
    const u = getUserFromToken(t);
    if (!u) throw new Error("Invalid token payload");
    setToken(t);
    setUser(u);
    return u;
  };

  const signup = async ({
    username,
    password,
    role = "user",
  }: {
    username: string;
    password: string;
    role?: Role;
  }) => {
    const res = await signupApi(username, password, role);
    const t = res?.token;
    if (!t) throw new Error("No token returned");
    const u = getUserFromToken(t);
    if (!u) throw new Error("Invalid token payload");
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
