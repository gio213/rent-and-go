// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get_current_user } from "@/actions/user.actions";
import { usePathname } from "@/i18n/navigation";

type User = Awaited<ReturnType<typeof get_current_user>>;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  isLoggedIn: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        console.log("Response from /api/me:", res);
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "DELETE" });
      setUser(null);
      setIsLoggedIn(false);
      router.push("/"); // ან router.refresh() თუ გინდა მხოლოდ განახლება
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
