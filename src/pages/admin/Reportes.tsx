import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAppStore } from "@/stores/appStore";
import { useState } from "react";
import ReporteMedicoDialog from "@/components/admin/ReporteMedicoDialog";

const Reportes = () => {
  const { pacientes, ordenes, citas } = useAppStore();
  const [medicoDialogOpen, setMedicoDialogOpen] = useState(false);

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
    doc.text("Órdenes", 14, 86);
    autoTable(doc, {
      startY: 92,
      head: [["#", "Paciente", "Médico", "Fecha", "Estado"]],
      body: ordenes.map((o) => [o.id.toString(), o.paciente, o.medico, o.fecha, o.estado]),
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
          <Button variant="outline" onClick={() => setMedicoDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />Reporte Individual Médico
          </Button>
          <Button variant="outline" onClick={downloadDailyPDF}>
            <Download className="mr-2 h-4 w-4" />Reporte Diario (PDF)
          </Button>
          <Button variant="outline" onClick={downloadMonthlyPDF}>
            <Download className="mr-2 h-4 w-4" />Reporte Mensual (PDF)
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Pacientes</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{pacientes.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Órdenes</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{ordenes.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Citas</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{citas.length}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Órdenes ({ordenes.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>#</TableHead><TableHead>Paciente</TableHead><TableHead>Médico</TableHead><TableHead>Fecha</TableHead><TableHead>Estado</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin órdenes registradas.</TableCell></TableRow>
              ) : (
                ordenes.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.paciente}</TableCell>
                    <TableCell>{o.medico}</TableCell>
                    <TableCell>{o.fecha}</TableCell>
                    <TableCell>{o.estado}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ReporteMedicoDialog open={medicoDialogOpen} onOpenChange={setMedicoDialogOpen} />
    </div>
  );
};

export default Reportes;
