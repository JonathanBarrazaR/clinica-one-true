import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import NuevoPacienteDialog from "@/components/admin/NuevoPacienteDialog";

interface Paciente {
  id: number; nombre: string; rut: string; telefono: string; email: string;
}

const initialPacientes: Paciente[] = [
  { id: 1, nombre: "María González", rut: "12.345.678-9", telefono: "+56 9 1234 5678", email: "maria@email.com" },
  { id: 2, nombre: "Juan Rodríguez", rut: "13.456.789-0", telefono: "+56 9 2345 6789", email: "juan@email.com" },
  { id: 3, nombre: "Ana Martínez", rut: "14.567.890-1", telefono: "+56 9 3456 7890", email: "ana@email.com" },
  { id: 4, nombre: "Carlos Díaz", rut: "15.678.901-2", telefono: "+56 9 4567 8901", email: "carlos@email.com" },
];

const AdminPacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>(initialPacientes);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.includes(search)
  );

  const handleAdd = (data: { nombre: string; rut: string; telefono: string; email: string }) => {
    setPacientes([...pacientes, { id: Date.now(), ...data }]);
  };

  const handleDelete = (id: number) => {
    setPacientes(pacientes.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Paciente</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o RUT..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Pacientes ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead><TableHead>RUT</TableHead><TableHead>Teléfono</TableHead><TableHead>Email</TableHead><TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.rut}</TableCell><TableCell>{p.telefono}</TableCell><TableCell>{p.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoPacienteDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAdd} />
    </div>
  );
};

export default AdminPacientes;
