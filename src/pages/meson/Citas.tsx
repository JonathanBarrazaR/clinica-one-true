import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

const citasExistentes = [
  { id: 1, paciente: "María González", medico: "Dr. Pérez", fecha: "2026-04-13", hora: "09:00", estado: "confirmada" },
  { id: 2, paciente: "Juan Rodríguez", medico: "Dra. López", fecha: "2026-04-13", hora: "10:30", estado: "pendiente" },
  { id: 3, paciente: "Ana Martínez", medico: "Dr. Silva", fecha: "2026-04-14", hora: "11:00", estado: "confirmada" },
];

const MesonCitas = () => {
  const [paciente, setPaciente] = useState("");
  const [medico, setMedico] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaciente(""); setMedico(""); setFecha(""); setHora("");
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
              <div className="space-y-2"><Label>Paciente</Label><Input value={paciente} onChange={(e) => setPaciente(e.target.value)} placeholder="Nombre del paciente" required /></div>
              <div className="space-y-2">
                <Label>Médico</Label>
                <Select value={medico} onValueChange={setMedico}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar médico" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-perez">Dr. Pérez - Cardiología</SelectItem>
                    <SelectItem value="dra-lopez">Dra. López - Pediatría</SelectItem>
                    <SelectItem value="dr-silva">Dr. Silva - Traumatología</SelectItem>
                    <SelectItem value="dra-ruiz">Dra. Ruiz - Dermatología</SelectItem>
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
          <CardHeader><CardTitle>Citas Próximas</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Paciente</TableHead><TableHead>Médico</TableHead><TableHead>Fecha</TableHead><TableHead>Hora</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
              <TableBody>
                {citasExistentes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.paciente}</TableCell><TableCell>{c.medico}</TableCell>
                    <TableCell>{c.fecha}</TableCell><TableCell>{c.hora}</TableCell>
                    <TableCell>
                      <Badge className={c.estado === "confirmada" ? "bg-success/20 text-success border-0" : "bg-warning/20 text-warning border-0"}>{c.estado}</Badge>
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
