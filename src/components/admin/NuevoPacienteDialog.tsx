import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { nombre: string; rut: string; telefono: string; email: string }) => void;
}

const NuevoPacienteDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, rut, telefono, email });
    setNombre(""); setRut(""); setTelefono(""); setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo Paciente</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre completo</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="space-y-2"><Label>RUT</Label><Input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-9" required /></div>
          <div className="space-y-2"><Label>Teléfono</Label><Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <DialogFooter><Button type="submit">Crear Paciente</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoPacienteDialog;
