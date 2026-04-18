import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useAppStore, Orden } from "@/stores/appStore";
import NuevaOrdenDialog from "@/components/admin/NuevaOrdenDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

const estadoBadge = (estado: string) => {
  const styles: Record<string, string> = {
    completada: "bg-success/20 text-success border-0",
    pendiente: "bg-warning/20 text-warning border-0",
    en_proceso: "bg-info/20 text-info border-0",
  };
  return <Badge className={styles[estado] || ""}>{estado.replace("_", " ")}</Badge>;
};

const prioridadBadge = (p: string) => {
  const styles: Record<string, string> = {
    alta: "bg-destructive/20 text-destructive border-0",
    media: "bg-warning/20 text-warning border-0",
    baja: "bg-success/20 text-success border-0",
  };
  return <Badge className={styles[p] || ""}>{p}</Badge>;
};

const MesonOrdenes = () => {
  const { ordenes, deleteOrden } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Orden | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Órdenes</h1>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nueva Orden</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Lista de Órdenes ({ordenes.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead><TableHead>Paciente</TableHead><TableHead>Médico</TableHead>
                <TableHead>Fecha</TableHead><TableHead>Prioridad</TableHead><TableHead>Estado</TableHead><TableHead className="w-16">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No hay órdenes registradas.</TableCell></TableRow>
              ) : (
                ordenes.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.paciente}</TableCell><TableCell>{o.medico}</TableCell><TableCell>{o.fecha}</TableCell>
                    <TableCell>{prioridadBadge(o.prioridad)}</TableCell><TableCell>{estadoBadge(o.estado)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(o)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevaOrdenDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        itemName={toDelete ? `la orden #${toDelete.id}` : undefined}
        onConfirm={() => {
          if (toDelete) deleteOrden(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
};

export default MesonOrdenes;
