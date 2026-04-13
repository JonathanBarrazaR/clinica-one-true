import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAppStore } from "@/stores/appStore";

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

const Reportes = () => {
  const { pacientes, ordenes, citas } = useAppStore();

  const downloadDailyPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("es-CL");
    doc.setFontSize(18);
    doc.text("CliniaONE - Reporte Diario", 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha: ${today}`, 14, 32);

    doc.setFontSize(14);
    doc.text("Resumen del Día", 14, 44);
    doc.setFontSize(11);
    doc.text(`Total pacientes registrados: ${pacientes.length}`, 14, 54);
    doc.text(`Total órdenes: ${ordenes.length}`, 14, 62);
    doc.text(`Total citas: ${citas.length}`, 14, 70);
    doc.text(`Órdenes pendientes: ${ordenes.filter((o) => o.estado === "pendiente").length}`, 14, 78);

    doc.setFontSize(14);
    doc.text("Órdenes del Día", 14, 94);
    autoTable(doc, {
      startY: 100,
      head: [["#", "Paciente", "Médico", "Estado", "Prioridad"]],
      body: ordenes.map((o) => [o.id.toString(), o.paciente, o.medico, o.estado, o.prioridad]),
      theme: "grid",
      headStyles: { fillColor: [0, 172, 158] },
    });

    doc.save(`reporte_diario_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const downloadMonthlyPDF = () => {
    const doc = new jsPDF();
    const month = new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" });
    doc.setFontSize(18);
    doc.text("CliniaONE - Reporte Mensual", 14, 22);
    doc.setFontSize(11);
    doc.text(`Período: ${month}`, 14, 32);

    doc.setFontSize(14);
    doc.text("Estadísticas Generales", 14, 44);
    doc.setFontSize(11);
    doc.text(`Pacientes: ${pacientes.length}`, 14, 54);
    doc.text(`Órdenes totales: ${ordenes.length}`, 14, 62);
    doc.text(`Citas totales: ${citas.length}`, 14, 70);

    doc.setFontSize(14);
    doc.text("Consultas y Emergencias por Mes", 14, 86);
    autoTable(doc, {
      startY: 92,
      head: [["Mes", "Consultas", "Emergencias"]],
      body: monthlyData.map((d) => [d.mes, d.consultas.toString(), d.emergencias.toString()]),
      theme: "grid",
      headStyles: { fillColor: [0, 172, 158] },
    });

    const afterTable = (doc as any).lastAutoTable?.finalY || 140;
    doc.setFontSize(14);
    doc.text("Top Médicos", 14, afterTable + 14);
    autoTable(doc, {
      startY: afterTable + 20,
      head: [["Médico", "Especialidad", "Consultas", "Satisfacción"]],
      body: topMedicos.map((m) => [m.nombre, m.especialidad, m.consultas.toString(), m.satisfaccion]),
      theme: "grid",
      headStyles: { fillColor: [0, 172, 158] },
    });

    doc.setFontSize(14);
    const afterTable2 = (doc as any).lastAutoTable?.finalY || 200;
    doc.text("Distribución por Especialidad", 14, afterTable2 + 14);
    autoTable(doc, {
      startY: afterTable2 + 20,
      head: [["Especialidad", "Porcentaje"]],
      body: specialtyData.map((s) => [s.name, `${s.value}%`]),
      theme: "grid",
      headStyles: { fillColor: [0, 172, 158] },
    });

    doc.save(`reporte_mensual_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadDailyPDF}>
            <Download className="mr-2 h-4 w-4" />Reporte Diario (PDF)
          </Button>
          <Button variant="outline" onClick={downloadMonthlyPDF}>
            <Download className="mr-2 h-4 w-4" />Reporte Mensual (PDF)
          </Button>
        </div>
      </div>
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
};

export default Reportes;
