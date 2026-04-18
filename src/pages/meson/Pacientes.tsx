import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, HeartPulse, Trash2 } from "lucide-react";
import { useAppStore, Paciente } from "@/stores/appStore";
import NuevoPacienteDialog from "@/components/admin/NuevoPacienteDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

const MesonPacientes = () => {
  const { pacientes, deletePaciente } = useAppStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Paciente | null>(null);
  const navigate = useNavigate();

  const filtered = pacientes.filter(
    (p) => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Paciente</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar paciente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Pacientes ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead><TableHead>RUT</TableHead><TableHead>Teléfono</TableHead>
                <TableHead>Última Visita</TableHead><TableHead>Triage</TableHead><TableHead className="w-28">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No hay pacientes registrados.</TableCell></TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell>{p.rut}</TableCell>
                    <TableCell>{p.telefono}</TableCell>
                    <TableCell>{p.ultimaVisita}</TableCell>
                    <TableCell>
                      {p.triageResult ? (
                        <Badge className="bg-info/20 text-info border-0">{p.triageResult.label}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sin triage</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" title="Iniciar Triage" onClick={() => navigate(`/meson/triage?pacienteId=${p.id}`)}>
                          <HeartPulse className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setToDelete(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoPacienteDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={() => {}} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        itemName={toDelete?.nombre}
        onConfirm={() => {
          if (toDelete) deletePaciente(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
};

export default MesonPacientes;
