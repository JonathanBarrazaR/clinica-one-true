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
  pacientes: [
    { id: 1, nombre: "María González", rut: "12.345.678-9", telefono: "+56 9 1234 5678", email: "maria@email.com", ultimaVisita: "2026-04-10", triageResult: null },
    { id: 2, nombre: "Juan Rodríguez", rut: "13.456.789-0", telefono: "+56 9 2345 6789", email: "juan@email.com", ultimaVisita: "2026-04-08", triageResult: null },
    { id: 3, nombre: "Ana Martínez", rut: "14.567.890-1", telefono: "+56 9 3456 7890", email: "ana@email.com", ultimaVisita: "2026-04-05", triageResult: null },
    { id: 4, nombre: "Carlos Díaz", rut: "15.678.901-2", telefono: "+56 9 4567 8901", email: "carlos@email.com", ultimaVisita: "2026-04-03", triageResult: null },
  ],
  ordenes: [
    { id: 145, pacienteId: 1, paciente: "María González", medico: "Dr. Pérez", fecha: "2026-04-12", estado: "pendiente", prioridad: "alta", descripcion: "Examen de sangre" },
    { id: 144, pacienteId: 2, paciente: "Juan Rodríguez", medico: "Dra. López", fecha: "2026-04-11", estado: "completada", prioridad: "media", descripcion: "Radiografía" },
    { id: 143, pacienteId: 3, paciente: "Ana Martínez", medico: "Dr. Silva", fecha: "2026-04-11", estado: "en_proceso", prioridad: "baja", descripcion: "Control general" },
  ],
  citas: [
    { id: 1, paciente: "María González", medico: "Dr. Pérez", fecha: "2026-04-13", hora: "09:00", estado: "confirmada" },
    { id: 2, paciente: "Juan Rodríguez", medico: "Dra. López", fecha: "2026-04-13", hora: "10:30", estado: "pendiente" },
    { id: 3, paciente: "Ana Martínez", medico: "Dr. Silva", fecha: "2026-04-14", hora: "11:00", estado: "confirmada" },
  ],
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
