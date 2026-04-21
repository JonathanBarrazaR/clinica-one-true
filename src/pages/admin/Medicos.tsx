import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import NuevoMedicoDialog from "@/components/admin/NuevoMedicoDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useAppStore, Medico } from "@/stores/appStore";

const AdminMedicos = () => {
  const { medicos, addMedico, updateMedico, deleteMedico } = useAppStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null);
  const [toDelete, setToDelete] = useState<Medico | null>(null);

  const filtered = medicos.filter((m) =>
    m.nombre.toLowerCase().includes(search.toLowerCase()) || m.especialidad.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: { nombre: string; especialidad: string; email: string }) => {
    if (editingMedico) {
      updateMedico(editingMedico.id, data);
      setEditingMedico(null);
      return;
    }

    addMedico(data);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingMedico(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Médicos</h1>
        <Button onClick={() => { setEditingMedico(null); setDialogOpen(true); }}><Plus className="mr-2 h-4 w-4" />Nuevo Médico</Button>
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
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No hay médicos registrados.</TableCell></TableRow>
              ) : (
                filtered.map((m) => (
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
                        <Button variant="ghost" size="icon" onClick={() => { setEditingMedico(m); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setToDelete(m)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoMedicoDialog open={dialogOpen} onOpenChange={handleDialogChange} onSubmit={handleAdd} initialData={editingMedico} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        itemName={toDelete?.nombre}
        onConfirm={() => {
          if (toDelete) deleteMedico(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminMedicos;
