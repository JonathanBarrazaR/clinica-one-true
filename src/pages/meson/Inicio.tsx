import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, ClipboardList, HeartPulse } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const MesonInicio = () => {
  const { pacientes, citas, ordenes } = useAppStore();
  const today = new Date().toISOString().split("T")[0];

  const stats = [
    { label: "Pacientes Registrados", value: pacientes.length.toString(), icon: Users, color: "text-primary" },
    { label: "Citas Hoy", value: citas.filter((c) => c.fecha === today).length.toString(), icon: CalendarDays, color: "text-info" },
    { label: "Órdenes Pendientes", value: ordenes.filter((o) => o.estado === "pendiente").length.toString(), icon: ClipboardList, color: "text-warning" },
    { label: "Sin Triage", value: pacientes.filter((p) => !p.triageResult).length.toString(), icon: HeartPulse, color: "text-destructive" },
  ];

  return (
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
          {ordenes.length === 0 && citas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin actividad reciente.</p>
          ) : (
            <div className="space-y-3">
              {ordenes.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">Orden #{o.id} - {o.paciente}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{o.fecha}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MesonInicio;
