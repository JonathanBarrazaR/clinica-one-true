import { create } from 'zustand';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'medico' | 'meson';
  createdAt: string;
}

interface UserStore {
  users: SystemUser[];
  addUser: (u: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  addUser: (u) =>
    set((s) => ({
      users: [
        ...s.users,
        { ...u, id: `${Date.now()}`, createdAt: new Date().toISOString() },
      ],
    })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
}));
