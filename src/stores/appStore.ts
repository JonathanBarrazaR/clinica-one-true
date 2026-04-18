import { create } from 'zustand';

export interface Paciente {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  ultimaVisita: string;
  triageResult?: { label: string; score: number; desc: string } | null;
}

export interface Orden {
  id: number;
  pacienteId: number;
  paciente: string;
  medico: string;
  fecha: string;
  estado: string;
  prioridad: string;
  descripcion: string;
}

export interface Cita {
  id: number;
  paciente: string;
  medico: string;
  fecha: string;
  hora: string;
  estado: string;
}

interface AppStore {
  pacientes: Paciente[];
  ordenes: Orden[];
  citas: Cita[];
  addPaciente: (p: Omit<Paciente, 'id' | 'ultimaVisita'>) => Paciente;
  deletePaciente: (id: number) => void;
  updatePacienteTriage: (id: number, result: Paciente['triageResult']) => void;
  addOrden: (o: Omit<Orden, 'id'>) => void;
  deleteOrden: (id: number) => void;
  addCita: (c: Omit<Cita, 'id'>) => void;
  deleteCita: (id: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  pacientes: [],
  ordenes: [],
  citas: [],
  addPaciente: (p) => {
    const newPaciente: Paciente = { ...p, id: Date.now(), ultimaVisita: new Date().toISOString().split('T')[0] };
    set((s) => ({ pacientes: [...s.pacientes, newPaciente] }));
    return newPaciente;
  },
  deletePaciente: (id) => set((s) => ({ pacientes: s.pacientes.filter((p) => p.id !== id) })),
  updatePacienteTriage: (id, result) => set((s) => ({
    pacientes: s.pacientes.map((p) => p.id === id ? { ...p, triageResult: result } : p),
  })),
  addOrden: (o) => set((s) => ({ ordenes: [{ ...o, id: Date.now() }, ...s.ordenes] })),
  deleteOrden: (id) => set((s) => ({ ordenes: s.ordenes.filter((o) => o.id !== id) })),
  addCita: (c) => set((s) => ({ citas: [...s.citas, { ...c, id: Date.now() }] })),
  deleteCita: (id) => set((s) => ({ citas: s.citas.filter((c) => c.id !== id) })),
}));
