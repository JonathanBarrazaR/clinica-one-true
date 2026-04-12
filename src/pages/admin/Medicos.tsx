import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import NuevoMedicoDialog from "@/components/admin/NuevoMedicoDialog";

interface Medico {
  id: number; nombre: string; especialidad: string; email: string; estado: string;
}

const initialMedicos: Medico[] = [
  { id: 1, nombre: "Dr. Roberto Pérez", especialidad: "Cardiología", email: "rperez@cliniaone.com", estado: "activo" },
  { id: 2, nombre: "Dra. Laura López", especialidad: "Pediatría", email: "llopez@cliniaone.com", estado: "activo" },
  { id: 3, nombre: "Dr. Miguel Silva", especialidad: "Traumatología", email: "msilva@cliniaone.com", estado: "inactivo" },
  { id: 4, nombre: "Dra. Carmen Ruiz", especialidad: "Dermatología", email: "cruiz@cliniaone.com", estado: "activo" },
];

const AdminMedicos = () => {
  const [medicos, setMedicos] = useState<Medico[]>(initialMedicos);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = medicos.filter((m) =>
    m.nombre.toLowerCase().includes(search.toLowerCase()) || m.especialidad.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: { nombre: string; especialidad: string; email: string }) => {
    setMedicos([...medicos, { id: Date.now(), estado: "activo", ...data }]);
  };

  const handleDelete = (id: number) => setMedicos(medicos.filter((m) => m.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Médicos</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Médico</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o especialidad..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Médicos ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead><TableHead>Especialidad</TableHead><TableHead>Email</TableHead><TableHead>Estado</TableHead><TableHead className="w-24">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.nombre}</TableCell>
                  <TableCell>{m.especialidad}</TableCell><TableCell>{m.email}</TableCell>
                  <TableCell>
                    <Badge className={m.estado === "activo" ? "bg-success/20 text-success border-0" : "bg-destructive/20 text-destructive border-0"}>
                      {m.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoMedicoDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAdd} />
    </div>
  );
};

export default AdminMedicos;
