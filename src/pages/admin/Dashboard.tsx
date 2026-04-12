import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, CalendarDays, ClipboardList } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { mes: "Ene", pacientes: 45 }, { mes: "Feb", pacientes: 52 }, { mes: "Mar", pacientes: 61 },
  { mes: "Abr", pacientes: 58 }, { mes: "May", pacientes: 70 }, { mes: "Jun", pacientes: 85 },
];

const recentOrders = [
  { id: 1, paciente: "María González", medico: "Dr. Pérez", fecha: "2026-04-12", estado: "pendiente" },
  { id: 2, paciente: "Juan Rodríguez", medico: "Dra. López", fecha: "2026-04-11", estado: "completada" },
  { id: 3, paciente: "Ana Martínez", medico: "Dr. Silva", fecha: "2026-04-11", estado: "en_proceso" },
  { id: 4, paciente: "Carlos Díaz", medico: "Dr. Pérez", fecha: "2026-04-10", estado: "completada" },
];

const stats = [
  { label: "Pacientes", value: "1,234", icon: Users, color: "text-primary" },
  { label: "Médicos", value: "28", icon: UserCog, color: "text-info" },
  { label: "Citas Hoy", value: "45", icon: CalendarDays, color: "text-success" },
  { label: "Órdenes Pendientes", value: "12", icon: ClipboardList, color: "text-warning" },
];

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "completada": return <Badge className="bg-success/20 text-success border-0">Completada</Badge>;
    case "pendiente": return <Badge className="bg-warning/20 text-warning border-0">Pendiente</Badge>;
    case "en_proceso": return <Badge className="bg-info/20 text-info border-0">En Proceso</Badge>;
    default: return <Badge variant="secondary">{estado}</Badge>;
  }
};

const AdminDashboard = () => (
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
      <CardHeader><CardTitle>Pacientes por Mes</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 22%)" />
            <XAxis dataKey="mes" stroke="hsl(215 20% 65%)" />
            <YAxis stroke="hsl(215 20% 65%)" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", color: "hsl(210 40% 98%)" }} />
            <Line type="monotone" dataKey="pacientes" stroke="hsl(174 100% 42%)" strokeWidth={2} dot={{ fill: "hsl(174 100% 42%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
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
            {recentOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.paciente}</TableCell><TableCell>{o.medico}</TableCell><TableCell>{o.fecha}</TableCell><TableCell>{estadoBadge(o.estado)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboard;
