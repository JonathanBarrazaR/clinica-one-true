import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Mock users for demo
const MOCK_USERS = [
  { id: "1", email: "admin@cliniaone.com", password: "admin123", name: "Admin CliniaONE", roles: ["admin"] },
  { id: "2", email: "meson@cliniaone.com", password: "meson123", name: "Mesón CliniaONE", roles: ["meson"] },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cliniaone_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setRoles(parsed.roles);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Credenciales inválidas");
    const userData = { id: found.id, email: found.email, name: found.name };
    setUser(userData);
    setRoles(found.roles);
    localStorage.setItem("cliniaone_user", JSON.stringify({ user: userData, roles: found.roles }));
  };

  const signUp = async (email: string, _password: string, name: string) => {
    const userData = { id: Date.now().toString(), email, name };
    setUser(userData);
    setRoles(["meson"]);
    localStorage.setItem("cliniaone_user", JSON.stringify({ user: userData, roles: ["meson"] }));
  };

  const signOut = () => {
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
