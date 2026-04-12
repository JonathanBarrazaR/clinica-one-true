import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { mes: "Ene", consultas: 120, emergencias: 15 }, { mes: "Feb", consultas: 135, emergencias: 12 },
  { mes: "Mar", consultas: 148, emergencias: 18 }, { mes: "Abr", consultas: 160, emergencias: 10 },
  { mes: "May", consultas: 175, emergencias: 22 }, { mes: "Jun", consultas: 190, emergencias: 14 },
];

const specialtyData = [
  { name: "Cardiología", value: 30 }, { name: "Pediatría", value: 25 },
  { name: "Traumatología", value: 20 }, { name: "Dermatología", value: 15 }, { name: "Otros", value: 10 },
];

const COLORS = ["hsl(174 100% 42%)", "hsl(199 89% 48%)", "hsl(142 76% 36%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

const topMedicos = [
  { nombre: "Dr. Pérez", especialidad: "Cardiología", consultas: 245, satisfaccion: "98%" },
  { nombre: "Dra. López", especialidad: "Pediatría", consultas: 210, satisfaccion: "97%" },
  { nombre: "Dr. Silva", especialidad: "Traumatología", consultas: 180, satisfaccion: "95%" },
];

const Reportes = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Reportes</h1>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Consultas y Emergencias por Mes</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 22%)" />
              <XAxis dataKey="mes" stroke="hsl(215 20% 65%)" />
              <YAxis stroke="hsl(215 20% 65%)" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", color: "hsl(210 40% 98%)" }} />
              <Legend />
              <Line type="monotone" dataKey="consultas" stroke="hsl(174 100% 42%)" strokeWidth={2} />
              <Line type="monotone" dataKey="emergencias" stroke="hsl(0 84% 60%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Distribución por Especialidad</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={specialtyData} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
                {specialtyData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(217 33% 17%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", color: "hsl(210 40% 98%)" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader><CardTitle>Top Médicos</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Médico</TableHead><TableHead>Especialidad</TableHead><TableHead>Consultas</TableHead><TableHead>Satisfacción</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {topMedicos.map((m) => (
              <TableRow key={m.nombre}><TableCell className="font-medium">{m.nombre}</TableCell><TableCell>{m.especialidad}</TableCell><TableCell>{m.consultas}</TableCell><TableCell>{m.satisfaccion}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default Reportes;
