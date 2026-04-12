import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, ClipboardList, HeartPulse } from "lucide-react";

const stats = [
  { label: "Pacientes en Espera", value: "8", icon: Users, color: "text-primary" },
  { label: "Citas Hoy", value: "23", icon: CalendarDays, color: "text-info" },
  { label: "Órdenes Pendientes", value: "5", icon: ClipboardList, color: "text-warning" },
  { label: "Triage Pendiente", value: "3", icon: HeartPulse, color: "text-destructive" },
];

const MesonInicio = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Inicio - Mesón</h1>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            <s.icon className={`h-5 w-5 ${s.color}`} />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader><CardTitle>Actividad Reciente</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { text: "María González registrada como nueva paciente", time: "Hace 5 min" },
            { text: "Cita agendada para Juan Rodríguez con Dr. Pérez", time: "Hace 15 min" },
            { text: "Triage completado para Ana Martínez - Prioridad Alta", time: "Hace 30 min" },
            { text: "Orden #145 completada por Dra. López", time: "Hace 1 hora" },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{a.text}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default MesonInicio;
