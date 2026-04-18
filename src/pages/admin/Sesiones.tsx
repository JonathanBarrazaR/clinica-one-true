import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/stores/sessionStore";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("es-CL") : "—";

const fmtDur = (s: number | null) => {
  if (s == null) return "—";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
};

const Sesiones = () => {
  const { sesiones, load } = useSessionStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sesiones de Usuarios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Conexiones ({sesiones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Conexión</TableHead>
                <TableHead>Desconexión</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sesiones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay sesiones registradas aún.
                  </TableCell>
                </TableRow>
              ) : (
                sesiones.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/20 text-primary border-0">{s.role}</Badge>
                    </TableCell>
                    <TableCell>{fmt(s.tiempo_online)}</TableCell>
                    <TableCell>{fmt(s.hora_desconexion)}</TableCell>
                    <TableCell>{fmtDur(s.duracion_segundos)}</TableCell>
                    <TableCell>
                      {s.hora_desconexion ? (
                        <Badge className="bg-muted text-muted-foreground border-0">Offline</Badge>
                      ) : (
                        <Badge className="bg-success/20 text-success border-0">Online</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sesiones;
