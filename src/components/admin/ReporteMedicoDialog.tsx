import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/stores/appStore";
import { calculateDoctorWorkedSeconds, formatDuration, getCurrentMonthRange, getCurrentWeekRange, isDateInRange } from "@/lib/reportUtils";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

const ReporteMedicoDialog = ({ open, onOpenChange }: Props) => {
  const { medicos, citas, ordenes, boxes } = useAppStore();
  const [medicoId, setMedicoId] = useState("");
  const [periodo, setPeriodo] = useState<"semanal" | "mensual">("semanal");

  const download = () => {
    const medico = medicos.find((m) => m.id.toString() === medicoId);
    if (!medico) return;

    const range = periodo === "semanal" ? getCurrentWeekRange() : getCurrentMonthRange();
    const doctorCitas = citas.filter((c) => c.medicoId === medico.id && isDateInRange(c.fecha, range.start, range.end));
    const doctorOrdenes = ordenes.filter((o) => (o.medicoId === medico.id || o.medico === medico.nombre) && isDateInRange(o.fecha, range.start, range.end));
    const worked = calculateDoctorWorkedSeconds(boxes, medico.id, range.start, range.end);
    const doc = new jsPDF();

    doc.setFontSize(18); doc.text("CliniaONE - Reporte Individual Médico", 14, 22);
    doc.setFontSize(11);
    doc.text(`Médico: ${medico.nombre}`, 14, 34);
    doc.text(`Especialidad: ${medico.especialidad || "—"}`, 14, 42);
    doc.text(`Email: ${medico.email || "—"}`, 14, 50);
    doc.text(`Período: ${periodo} (${range.start.toLocaleDateString("es-CL")} - ${range.end.toLocaleDateString("es-CL")})`, 14, 58);
    doc.text(`Citas atendidas: ${doctorCitas.length}`, 14, 70);
    doc.text(`Órdenes asociadas: ${doctorOrdenes.length}`, 14, 78);
    doc.text(`Horas trabajadas en boxes: ${formatDuration(worked)}`, 14, 86);

    autoTable(doc, { startY: 98, head: [["Paciente", "Fecha", "Inicio", "Término", "Estado"]], body: doctorCitas.map((c) => [c.paciente, c.fecha, c.hora, c.horaTermino || "—", c.estado]), theme: "grid", headStyles: { fillColor: [0, 172, 158] } });
    autoTable(doc, { startY: (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ? (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12 : 150, head: [["Paciente", "Fecha", "Estado", "Prioridad", "Descripción"]], body: doctorOrdenes.map((o) => [o.paciente, o.fecha, o.estado, o.prioridad, o.descripcion]), theme: "grid", headStyles: { fillColor: [0, 172, 158] } });

    doc.save(`reporte_medico_${periodo}_${medico.nombre.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reporte Individual Médico</DialogTitle><DialogDescription>Selecciona un médico y el período del reporte.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Médico</Label><Select value={medicoId} onValueChange={setMedicoId}><SelectTrigger><SelectValue placeholder="Seleccionar médico" /></SelectTrigger><SelectContent>{medicos.map((m) => <SelectItem key={m.id} value={m.id.toString()}>{m.nombre} - {m.especialidad}</SelectItem>)}</SelectContent></Select></div>
          <RadioGroup value={periodo} onValueChange={(value) => setPeriodo(value as "semanal" | "mensual")} className="grid grid-cols-2 gap-3">
            <Label className="flex items-center gap-2 rounded-md border p-3"><RadioGroupItem value="semanal" /> Semanal</Label>
            <Label className="flex items-center gap-2 rounded-md border p-3"><RadioGroupItem value="mensual" /> Mensual</Label>
          </RadioGroup>
        </div>
        <DialogFooter><Button onClick={download} disabled={!medicoId}><Download className="mr-2 h-4 w-4" />Descargar PDF</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReporteMedicoDialog;