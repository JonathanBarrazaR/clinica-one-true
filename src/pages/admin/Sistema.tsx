import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Database, Bell, Globe } from "lucide-react";

const users = [
  { id: 1, name: "Admin CliniaONE", email: "admin@cliniaone.com", role: "admin" },
  { id: 2, name: "Mesón CliniaONE", email: "meson@cliniaone.com", role: "meson" },
];

const Sistema = () => (
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
            <span className="text-sm">Estado</span><Badge className="bg-success/20 text-success border-0">Conectada</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Último respaldo</span><span className="text-sm text-muted-foreground">Hoy, 03:00 AM</span>
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
      <CardHeader><CardTitle>Usuarios del Sistema</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Rol</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell><TableCell>{u.email}</TableCell>
                <TableCell><Badge className={u.role === "admin" ? "bg-primary/20 text-primary border-0" : "bg-info/20 text-info border-0"}>{u.role}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default Sistema;
