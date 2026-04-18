import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Database, Bell, Globe, Plus, Trash2 } from "lucide-react";
import { useUserStore, SystemUser } from "@/stores/userStore";
import NuevoUsuarioDialog from "@/components/admin/NuevoUsuarioDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: "bg-primary/20 text-primary border-0",
    medico: "bg-info/20 text-info border-0",
    meson: "bg-warning/20 text-warning border-0",
  };
  return <Badge className={map[role] || ""}>{role}</Badge>;
};

const Sistema = () => {
  const { users, deleteUser } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<SystemUser | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sistema</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><CardTitle>Seguridad</CardTitle></div>
            <CardDescription>Configuraciones de seguridad del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Autenticación de dos factores</Label><Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Bloqueo por intentos fallidos</Label><Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Database className="h-5 w-5 text-info" /><CardTitle>Base de Datos</CardTitle></div>
            <CardDescription>Estado y respaldos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Estado</span><Badge className="bg-warning/20 text-warning border-0">Sin conectar</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">Crear Respaldo Manual</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-warning" /><CardTitle>Notificaciones</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Notificaciones por email</Label><Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alertas del sistema</Label><Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /><CardTitle>General</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Zona horaria</span><span className="text-sm text-muted-foreground">America/Santiago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Idioma</span><span className="text-sm text-muted-foreground">Español</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usuarios del Sistema ({users.length})</CardTitle>
            <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nuevo Usuario</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Rol</TableHead><TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No hay usuarios registrados.</TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{roleBadge(u.role)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <NuevoUsuarioDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        itemName={toDelete?.name}
        onConfirm={() => {
          if (toDelete) deleteUser(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
};

export default Sistema;
