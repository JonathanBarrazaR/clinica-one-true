import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/stores/appStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NuevaOrdenDialog = ({ open, onOpenChange }: Props) => {
  const { pacientes, medicos, addOrden } = useAppStore();
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pac = pacientes.find((p) => p.id.toString() === pacienteId);
    const med = medicos.find((m) => m.id.toString() === medicoId);
    if (!pac || !med) return;
    addOrden({
      pacienteId: pac.id,
      medicoId: med.id,
      paciente: pac.nombre,
      medico: med.nombre,
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
      prioridad,
      descripcion,
    });
    setPacienteId(""); setMedicoId(""); setPrioridad(""); setDescripcion("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nueva Orden</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Select value={pacienteId} onValueChange={setPacienteId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
              <SelectContent>
                {pacientes.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} - {p.rut}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Médico</Label>
            <Select value={medicoId} onValueChange={setMedicoId}>
              <SelectTrigger><SelectValue placeholder="Seleccionar médico" /></SelectTrigger>
              <SelectContent>
                {medicos.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.nombre} - {m.especialidad}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select value={prioridad} onValueChange={setPrioridad}>
              <SelectTrigger><SelectValue placeholder="Seleccionar prioridad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción de la orden" required />
          </div>
          <DialogFooter><Button type="submit">Crear Orden</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevaOrdenDialog;
