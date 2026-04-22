import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserRoles } from "@/lib/consultasSupabase";
import { useSessionStore } from "@/stores/sessionStore";
import type { User as SupaUser } from "@supabase/supabase-js";

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
  signIn: (email: string, password: string) => Promise<string[]>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "cliniaone_current_session";

function mapUser(su: SupaUser): User {
  return {
    id: su.id,
    email: su.email ?? "",
    name: (su.user_metadata?.full_name as string) ?? su.email ?? "",
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { startSession, endSession, load } = useSessionStore();

  // Bootstrap: listen to auth state changes
  useEffect(() => {
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const mapped = mapUser(session.user);
          setUser(mapped);
          const userRoles = await getUserRoles(session.user.id);
          setRoles(userRoles);
        } else {
          setUser(null);
          setRoles([]);
        }
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const mapped = mapUser(session.user);
        setUser(mapped);
        const userRoles = await getUserRoles(session.user.id);
        setRoles(userRoles);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // End session tracking on unload
  useEffect(() => {
    const handler = () => {
      const sid = localStorage.getItem(SESSION_KEY);
      if (sid) endSession(sid);
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [endSession]);

  const signIn = async (email: string, password: string): Promise<string[]> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const mapped = mapUser(data.user);
    setUser(mapped);

    const userRoles = await getUserRoles(data.user.id);
    setRoles(userRoles);

    // Session tracking
    const sid = startSession({ userId: data.user.id, email, role: userRoles[0] ?? "meson" });
    localStorage.setItem(SESSION_KEY, sid);

    return userRoles;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw new Error(error.message);
  };

  const signOut = async () => {
    const sid = localStorage.getItem(SESSION_KEY);
    if (sid) endSession(sid);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setRoles([]);
    await supabase.auth.signOut();
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
