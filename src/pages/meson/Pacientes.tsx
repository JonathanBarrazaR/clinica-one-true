import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const pacientes = [
  { id: 1, nombre: "María González", rut: "12.345.678-9", telefono: "+56 9 1234 5678", ultimaVisita: "2026-04-10" },
  { id: 2, nombre: "Juan Rodríguez", rut: "13.456.789-0", telefono: "+56 9 2345 6789", ultimaVisita: "2026-04-08" },
  { id: 3, nombre: "Ana Martínez", rut: "14.567.890-1", telefono: "+56 9 3456 7890", ultimaVisita: "2026-04-05" },
];

const MesonPacientes = () => {
  const [search, setSearch] = useState("");
  const filtered = pacientes.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.includes(search));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pacientes</h1>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar paciente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Pacientes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>RUT</TableHead><TableHead>Teléfono</TableHead><TableHead>Última Visita</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}><TableCell className="font-medium">{p.nombre}</TableCell><TableCell>{p.rut}</TableCell><TableCell>{p.telefono}</TableCell><TableCell>{p.ultimaVisita}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesonPacientes;
