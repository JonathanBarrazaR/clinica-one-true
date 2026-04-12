import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const medicos = [
  { id: 1, nombre: "Dr. Roberto Pérez", especialidad: "Cardiología", disponible: true },
  { id: 2, nombre: "Dra. Laura López", especialidad: "Pediatría", disponible: true },
  { id: 3, nombre: "Dr. Miguel Silva", especialidad: "Traumatología", disponible: false },
  { id: 4, nombre: "Dra. Carmen Ruiz", especialidad: "Dermatología", disponible: true },
];

const MesonMedicos = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Médicos Disponibles</h1>
    <Card>
      <CardHeader><CardTitle>Médicos</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Especialidad</TableHead><TableHead>Disponibilidad</TableHead></TableRow></TableHeader>
          <TableBody>
            {medicos.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.nombre}</TableCell>
                <TableCell>{m.especialidad}</TableCell>
                <TableCell>
                  <Badge className={m.disponible ? "bg-success/20 text-success border-0" : "bg-destructive/20 text-destructive border-0"}>
                    {m.disponible ? "Disponible" : "No Disponible"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default MesonMedicos;
