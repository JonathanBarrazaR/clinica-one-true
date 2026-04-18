import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSessionStore } from "@/stores/sessionStore";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  roles: string[];
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { id: "1", email: "admin@cliniaone.com", password: "admin123", name: "Admin CliniaONE", roles: ["admin"] },
  { id: "2", email: "meson@cliniaone.com", password: "meson123", name: "Mesón CliniaONE", roles: ["meson"] },
];

const SESSION_KEY = "cliniaone_current_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { startSession, endSession, load } = useSessionStore();

  useEffect(() => {
    load();
    const stored = localStorage.getItem("cliniaone_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setRoles(parsed.roles);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => {
      const sid = localStorage.getItem(SESSION_KEY);
      if (sid) endSession(sid);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [endSession]);

  const signIn = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Credenciales inválidas");
    const userData = { id: found.id, email: found.email, name: found.name };
    setUser(userData);
    setRoles(found.roles);
    localStorage.setItem("cliniaone_user", JSON.stringify({ user: userData, roles: found.roles }));
    const sid = startSession({ userId: found.id, email: found.email, role: found.roles[0] });
    localStorage.setItem(SESSION_KEY, sid);
  };

  const signUp = async (email: string, _password: string, name: string) => {
    const userData = { id: Date.now().toString(), email, name };
    setUser(userData);
    setRoles(["meson"]);
    localStorage.setItem("cliniaone_user", JSON.stringify({ user: userData, roles: ["meson"] }));
    const sid = startSession({ userId: userData.id, email, role: "meson" });
    localStorage.setItem(SESSION_KEY, sid);
  };

  const signOut = () => {
    const sid = localStorage.getItem(SESSION_KEY);
    if (sid) endSession(sid);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setRoles([]);
    localStorage.removeItem("cliniaone_user");
  };

  const hasRole = (role: string) => roles.includes(role);

  return (
    <AuthContext.Provider value={{ user, roles, isLoading, hasRole, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
