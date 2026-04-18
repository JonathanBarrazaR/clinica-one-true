import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, CalendarDays, ClipboardList } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "completada": return <Badge className="bg-success/20 text-success border-0">Completada</Badge>;
    case "pendiente": return <Badge className="bg-warning/20 text-warning border-0">Pendiente</Badge>;
    case "en_proceso": return <Badge className="bg-info/20 text-info border-0">En Proceso</Badge>;
    default: return <Badge variant="secondary">{estado}</Badge>;
  }
};

const AdminDashboard = () => {
  const { pacientes, ordenes, citas } = useAppStore();
  const today = new Date().toISOString().split("T")[0];

  const stats = [
    { label: "Pacientes", value: pacientes.length.toString(), icon: Users, color: "text-primary" },
    { label: "Médicos", value: "0", icon: UserCog, color: "text-info" },
    { label: "Citas Hoy", value: citas.filter((c) => c.fecha === today).length.toString(), icon: CalendarDays, color: "text-success" },
    { label: "Órdenes Pendientes", value: ordenes.filter((o) => o.estado === "pendiente").length.toString(), icon: ClipboardList, color: "text-warning" },
  ];

  const recent = ordenes.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Órdenes Recientes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead><TableHead>Médico</TableHead><TableHead>Fecha</TableHead><TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sin órdenes registradas.</TableCell></TableRow>
              ) : (
                recent.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.paciente}</TableCell><TableCell>{o.medico}</TableCell><TableCell>{o.fecha}</TableCell><TableCell>{estadoBadge(o.estado)}</TableCell>
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

export default AdminDashboard;
