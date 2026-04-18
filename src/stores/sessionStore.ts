import { create } from 'zustand';

export interface Sesion {
  id: string;
  userId: string;
  email: string;
  role: string;
  tiempo_online: string;
  hora_desconexion: string | null;
  duracion_segundos: number | null;
}

interface SessionStore {
  sesiones: Sesion[];
  currentSessionId: string | null;
  startSession: (s: Omit<Sesion, 'id' | 'tiempo_online' | 'hora_desconexion' | 'duracion_segundos'>) => string;
  endSession: (id: string) => void;
  load: () => void;
}

const STORAGE_KEY = 'cliniaone_sesiones';

const persist = (sesiones: Sesion[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sesiones));
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  sesiones: [],
  currentSessionId: null,
  load: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) set({ sesiones: JSON.parse(stored) });
  },
  startSession: (s) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nueva: Sesion = {
      ...s,
      id,
      tiempo_online: new Date().toISOString(),
      hora_desconexion: null,
      duracion_segundos: null,
    };
    set((st) => {
      const sesiones = [nueva, ...st.sesiones];
      persist(sesiones);
      return { sesiones, currentSessionId: id };
    });
    return id;
  },
  endSession: (id) => {
    set((st) => {
      const sesiones = st.sesiones.map((se) => {
        if (se.id !== id || se.hora_desconexion) return se;
        const fin = new Date();
        const inicio = new Date(se.tiempo_online);
        return {
          ...se,
          hora_desconexion: fin.toISOString(),
          duracion_segundos: Math.round((fin.getTime() - inicio.getTime()) / 1000),
        };
      });
      persist(sesiones);
      return { sesiones, currentSessionId: null };
    });
  },
}));
