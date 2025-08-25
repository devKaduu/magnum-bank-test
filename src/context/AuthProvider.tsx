import { useEffect, useMemo, useState } from "react";
import { api, clearSession, getStoredUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

type User = { id: string; email: string; name: string; balance: number };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getStoredUser<User>();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "__user" || e.key === "__token") {
        const next = getStoredUser<User>();
        setUser(next ?? null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  async function login(email: string, password: string) {
    const u = await api.login({ email, password });
    setUser(u);
  }

  async function register(name: string, email: string, password: string) {
    const u = await api.register({ name, email, password });
    setUser(u);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
