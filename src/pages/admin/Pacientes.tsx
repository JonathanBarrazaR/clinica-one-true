import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import NuevoPacienteDialog from "@/components/admin/NuevoPacienteDialog";
import { useAppStore } from "@/stores/appStore";

const AdminPacientes = () => {
  const { pacientes, deletePaciente } = useAppStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.includes(search)
  );

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
                <TableHead>Nombre</TableHead><TableHead>RUT</TableHead><TableHead>Teléfono</TableHead><TableHead>Email</TableHead><TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.rut}</TableCell><TableCell>{p.telefono}</TableCell><TableCell>{p.email}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deletePaciente(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoPacienteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default AdminPacientes;
