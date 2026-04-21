import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/hooks/use-toast";

const PHONE_PREFIX = "+569 ";

const getRutRawValue = (value: string) => value.replace(/[^0-9kK]/g, "").slice(0, 9).toUpperCase();

const formatRut = (value: string) => {
  const raw = getRutRawValue(value);

  if (raw.length <= 1) return raw;

  const body = raw.slice(0, -1);
  const verifier = raw.slice(-1);
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedBody}-${verifier}`.slice(0, 12);
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const userDigits = digits.startsWith("569") ? digits.slice(3) : digits;

  return `${PHONE_PREFIX}${userDigits.slice(0, 8)}`;
};

const isRutValid = (value: string) => {
  const raw = getRutRawValue(value);

  return raw.length >= 8 && raw.length <= 9 && /^\d{1,2}\.\d{3}\.\d{3}-[0-9K]$/.test(value);
};

const isPhoneValid = (value: string) => /^\+569 \d{8}$/.test(value);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { nombre: string; rut: string; telefono: string; email: string }) => void;
  initialData?: { nombre: string; rut: string; telefono: string; email: string } | null;
}

const NuevoPacienteDialog = ({ open, onOpenChange, onSubmit, initialData }: Props) => {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [rut, setRut] = useState(initialData?.rut ?? "");
  const [telefono, setTelefono] = useState(initialData?.telefono ?? PHONE_PREFIX);
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [iniciarTriage, setIniciarTriage] = useState(false);
  const { addPaciente } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    setNombre(initialData?.nombre ?? "");
    setRut(initialData?.rut ?? "");
    setTelefono(initialData?.telefono ?? PHONE_PREFIX);
    setEmail(initialData?.email ?? "");
    setIniciarTriage(false);
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRutValid(rut)) {
      toast({ title: "RUT inválido", description: "Ingrese un RUT válido con formato 12.345.678-9." });
      return;
    }

    if (!isPhoneValid(telefono)) {
      toast({ title: "Teléfono inválido", description: "Ingrese un teléfono válido con formato +569 92315312." });
      return;
    }

    if (initialData && onSubmit) {
      onSubmit({ nombre, rut, telefono, email });
      toast({ title: "Paciente actualizado", description: `${nombre} ha sido actualizado.` });
      setNombre(""); setRut(""); setTelefono(PHONE_PREFIX); setEmail(""); setIniciarTriage(false);
      onOpenChange(false);
      return;
    }

    if (onSubmit) {
      onSubmit({ nombre, rut, telefono, email });
      toast({ title: "Paciente creado", description: `${nombre} ha sido registrado.` });
      setNombre(""); setRut(""); setTelefono(PHONE_PREFIX); setEmail(""); setIniciarTriage(false);
      onOpenChange(false);
      return;
    }

    const newPaciente = addPaciente({ nombre, rut, telefono, email, triageResult: null });
    toast({ title: "Paciente creado", description: `${nombre} ha sido registrado.` });
    setNombre(""); setRut(""); setTelefono(PHONE_PREFIX); setEmail(""); setIniciarTriage(false);
    onOpenChange(false);
    if (iniciarTriage) {
      navigate(`/meson/triage?pacienteId=${newPaciente.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initialData ? "Actualizar Paciente" : "Nuevo Paciente"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Nombre completo</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="space-y-2"><Label>RUT</Label><Input value={rut} onChange={(e) => setRut(formatRut(e.target.value))} maxLength={12} placeholder="12.345.678-9" required /></div>
          <div className="space-y-2"><Label>Teléfono</Label><Input value={telefono} onFocus={() => setTelefono((current) => current.startsWith(PHONE_PREFIX) ? current : PHONE_PREFIX)} onChange={(e) => setTelefono(formatPhone(e.target.value))} maxLength={13} placeholder="+569 92315312" required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          {!initialData && <div className="flex items-center space-x-2">
            <Checkbox id="triage" checked={iniciarTriage} onCheckedChange={(c) => setIniciarTriage(c === true)} />
            <Label htmlFor="triage" className="text-sm cursor-pointer">Iniciar triage después de registrar (opcional)</Label>
          </div>}
          <DialogFooter><Button type="submit">{initialData ? "Guardar Cambios" : "Crear Paciente"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoPacienteDialog;
