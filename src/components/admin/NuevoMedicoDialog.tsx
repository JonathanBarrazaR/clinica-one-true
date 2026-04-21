import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Medico } from "@/stores/appStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { nombre: string; especialidad: string; email: string }) => void;
  initialData?: Medico | null;
}

const NuevoMedicoDialog = ({ open, onOpenChange, onSubmit, initialData }: Props) => {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    setNombre(initialData?.nombre ?? "");
    setEspecialidad(initialData?.especialidad ?? "");
    setEmail(initialData?.email ?? "");
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, especialidad, email });
    setNombre(""); setEspecialidad(""); setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initialData ? "Editar Médico" : "Nuevo Médico"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre completo</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Especialidad</Label><Input value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} placeholder="Ej: Cardiología" required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <DialogFooter><Button type="submit">{initialData ? "Guardar Cambios" : "Crear Médico"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoMedicoDialog;
