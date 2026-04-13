import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Trash2 } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const MesonCitas = () => {
  const { citas, pacientes, addCita, deleteCita } = useAppStore();
  const [pacienteId, setPacienteId] = useState("");
  const [medico, setMedico] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pac = pacientes.find((p) => p.id.toString() === pacienteId);
    if (!pac) return;
    addCita({ paciente: pac.nombre, medico, fecha, hora, estado: "pendiente" });
    setPacienteId(""); setMedico(""); setFecha(""); setHora("");
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
                    {pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} - {p.rut}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Médico</Label>
                <Select value={medico} onValueChange={setMedico}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar médico" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Pérez">Dr. Pérez - Cardiología</SelectItem>
                    <SelectItem value="Dra. López">Dra. López - Pediatría</SelectItem>
                    <SelectItem value="Dr. Silva">Dr. Silva - Traumatología</SelectItem>
                    <SelectItem value="Dra. Ruiz">Dra. Ruiz - Dermatología</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Hora</Label><Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required /></div>
              </div>
              <Button type="submit" className="w-full">Agendar Cita</Button>
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
                {citas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.paciente}</TableCell><TableCell>{c.medico}</TableCell>
                    <TableCell>{c.fecha}</TableCell><TableCell>{c.hora}</TableCell>
                    <TableCell>
                      <Badge className={c.estado === "confirmada" ? "bg-success/20 text-success border-0" : "bg-warning/20 text-warning border-0"}>{c.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteCita(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MesonCitas;
