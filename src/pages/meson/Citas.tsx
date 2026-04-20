import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Trash2 } from "lucide-react";
import { useAppStore, Cita } from "@/stores/appStore";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

const MesonCitas = () => {
  const { citas, pacientes, medicos, boxes, addCita, deleteCita, asignarBox } = useAppStore();
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [boxId, setBoxId] = useState("none");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horaTermino, setHoraTermino] = useState("");
  const [toDelete, setToDelete] = useState<Cita | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pac = pacientes.find((p) => p.id.toString() === pacienteId);
    const med = medicos.find((m) => m.id.toString() === medicoId);
    if (!pac || !med) return;
    const cita = addCita({ pacienteId: pac.id, medicoId: med.id, boxId: boxId === "none" ? undefined : Number(boxId), paciente: pac.nombre, medico: med.nombre, fecha, hora, horaTermino, estado: "pendiente" });
    if (boxId !== "none") asignarBox(Number(boxId), { medicoId: med.id, pacienteId: pac.id, citaId: cita.id, horaInicioAsignada: hora, horaTerminoAsignada: horaTermino || null });
    setPacienteId(""); setMedicoId(""); setBoxId("none"); setFecha(""); setHora(""); setHoraTermino("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Citas</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /><CardTitle>Agendar Nueva Cita</CardTitle></div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select value={pacienteId} onValueChange={setPacienteId}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                  <SelectContent>
                    {pacientes.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">Registra primero un paciente</div>
                    ) : (
                      pacientes.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} - {p.rut}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Médico</Label>
                <Select value={medicoId} onValueChange={setMedicoId}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar médico" /></SelectTrigger>
                  <SelectContent>
                    {medicos.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">Registra primero un médico</div>
                    ) : medicos.map((m) => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.nombre} - {m.especialidad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Hora</Label><Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Hora término</Label><Input type="time" value={horaTermino} onChange={(e) => setHoraTermino(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Box</Label>
                  <Select value={boxId} onValueChange={setBoxId}>
                    <SelectTrigger><SelectValue placeholder="Sin box" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin box asignado</SelectItem>
                      {boxes.filter((b) => b.estado === "disponible").map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!pacienteId || !medicoId}>Agendar Cita</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Citas Programadas ({citas.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Paciente</TableHead><TableHead>Médico</TableHead><TableHead>Fecha</TableHead><TableHead>Hora</TableHead><TableHead>Estado</TableHead><TableHead className="w-16"></TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {citas.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sin citas programadas.</TableCell></TableRow>
                ) : (
                  citas.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.paciente}</TableCell><TableCell>{c.medico}</TableCell>
                      <TableCell>{c.fecha}</TableCell><TableCell>{c.hora}</TableCell>
                      <TableCell>
                        <Badge className={c.estado === "confirmada" ? "bg-success/20 text-success border-0" : "bg-warning/20 text-warning border-0"}>{c.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setToDelete(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        itemName={toDelete ? `la cita de ${toDelete.paciente}` : undefined}
        onConfirm={() => {
          if (toDelete) deleteCita(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
};

export default MesonCitas;
