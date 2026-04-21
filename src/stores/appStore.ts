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
  medicoId?: number;
  paciente: string;
  medico: string;
  fecha: string;
  estado: string;
  prioridad: string;
  descripcion: string;
}

export interface Cita {
  id: number;
  pacienteId?: number;
  medicoId?: number;
  boxId?: number;
  paciente: string;
  medico: string;
  fecha: string;
  hora: string;
  horaTermino?: string;
  estado: string;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  estado: string;
}

export interface Box {
  id: number;
  numero: number;
  nombre: string;
  estado: 'disponible' | 'ocupado';
  medicoId?: number | null;
  pacienteId?: number | null;
  citaId?: number | null;
  horaInicioAsignada?: string | null;
  horaTerminoAsignada?: string | null;
  horaInicioReal?: string | null;
  horaTerminoReal?: string | null;
}

interface AppStore {
  pacientes: Paciente[];
  medicos: Medico[];
  ordenes: Orden[];
  citas: Cita[];
  boxes: Box[];
  addPaciente: (p: Omit<Paciente, 'id' | 'ultimaVisita'>) => Paciente;
  updatePaciente: (id: number, data: Partial<Omit<Paciente, 'id' | 'ultimaVisita'>>) => void;
  deletePaciente: (id: number) => void;
  updatePacienteTriage: (id: number, result: Paciente['triageResult']) => void;
  addMedico: (m: Omit<Medico, 'id' | 'estado'>) => Medico;
  updateMedico: (id: number, data: Partial<Omit<Medico, 'id'>>) => void;
  deleteMedico: (id: number) => void;
  addOrden: (o: Omit<Orden, 'id'>) => void;
  deleteOrden: (id: number) => void;
  addCita: (c: Omit<Cita, 'id'>) => Cita;
  deleteCita: (id: number) => void;
  addBox: (b: Omit<Box, 'id' | 'estado'>) => Box;
  updateBox: (id: number, data: Partial<Box>) => void;
  asignarBox: (boxId: number, data: Pick<Box, 'medicoId' | 'pacienteId' | 'citaId' | 'horaInicioAsignada' | 'horaTerminoAsignada'>) => void;
  liberarBox: (boxId: number) => void;
}

const initialBoxes: Box[] = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  numero: index + 1,
  nombre: `Box ${index + 1}`,
  estado: 'disponible',
  medicoId: null,
  pacienteId: null,
  citaId: null,
  horaInicioAsignada: null,
  horaTerminoAsignada: null,
  horaInicioReal: null,
  horaTerminoReal: null,
}));

export const useAppStore = create<AppStore>((set) => ({
  pacientes: [],
  medicos: [],
  ordenes: [],
  citas: [],
  boxes: initialBoxes,
  addPaciente: (p) => {
    const newPaciente: Paciente = { ...p, id: Date.now(), ultimaVisita: new Date().toISOString().split('T')[0] };
    set((s) => ({ pacientes: [...s.pacientes, newPaciente] }));
    return newPaciente;
  },
  updatePaciente: (id, data) => set((s) => ({ pacientes: s.pacientes.map((p) => p.id === id ? { ...p, ...data } : p) })),
  deletePaciente: (id) => set((s) => ({ pacientes: s.pacientes.filter((p) => p.id !== id) })),
  updatePacienteTriage: (id, result) => set((s) => ({
    pacientes: s.pacientes.map((p) => p.id === id ? { ...p, triageResult: result } : p),
  })),
  addMedico: (m) => {
    const newMedico: Medico = { ...m, id: Date.now(), estado: 'activo' };
    set((s) => ({ medicos: [...s.medicos, newMedico] }));
    return newMedico;
  },
  updateMedico: (id, data) => set((s) => ({ medicos: s.medicos.map((m) => m.id === id ? { ...m, ...data } : m) })),
  deleteMedico: (id) => set((s) => ({ medicos: s.medicos.filter((m) => m.id !== id) })),
  addOrden: (o) => set((s) => ({ ordenes: [{ ...o, id: Date.now() }, ...s.ordenes] })),
  deleteOrden: (id) => set((s) => ({ ordenes: s.ordenes.filter((o) => o.id !== id) })),
  addCita: (c) => {
    const newCita: Cita = { ...c, id: Date.now() };
    set((s) => ({ citas: [...s.citas, newCita] }));
    return newCita;
  },
  deleteCita: (id) => set((s) => ({
    citas: s.citas.filter((c) => c.id !== id),
    boxes: s.boxes.map((b) => b.citaId === id ? {
      ...b,
      estado: 'disponible',
      medicoId: null,
      pacienteId: null,
      citaId: null,
      horaInicioAsignada: null,
      horaTerminoAsignada: null,
      horaTerminoReal: new Date().toISOString(),
    } : b),
  })),
  addBox: (b) => {
    const newBox: Box = { ...b, id: Date.now(), estado: 'disponible' };
    set((s) => ({ boxes: [...s.boxes, newBox].slice(0, 5) }));
    return newBox;
  },
  updateBox: (id, data) => set((s) => ({ boxes: s.boxes.map((b) => b.id === id ? { ...b, ...data } : b) })),
  asignarBox: (boxId, data) => set((s) => ({
    boxes: s.boxes.map((b) => b.id === boxId ? {
      ...b,
      ...data,
      estado: 'ocupado',
      horaInicioReal: new Date().toISOString(),
      horaTerminoReal: null,
    } : b),
  })),
  liberarBox: (boxId) => set((s) => ({
    boxes: s.boxes.map((b) => b.id === boxId ? {
      ...b,
      estado: 'disponible',
      medicoId: null,
      pacienteId: null,
      citaId: null,
      horaInicioAsignada: null,
      horaTerminoAsignada: null,
      horaTerminoReal: new Date().toISOString(),
    } : b),
  })),
}));
