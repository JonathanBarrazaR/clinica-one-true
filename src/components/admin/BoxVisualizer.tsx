import { useEffect, useState } from "react";
import { Clock, Stethoscope, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/appStore";
import { formatDuration } from "@/lib/reportUtils";
import { cn } from "@/lib/utils";

const formatTime = (value?: string | null) => {
  if (!value) return "—";
  if (value.includes("T")) return new Date(value).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  return value;
};

const elapsedSeconds = (from?: string | null) => {
  if (!from) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(from).getTime()) / 1000));
};

const isDelayed = (date: string, assignedTime?: string | null) => {
  if (!assignedTime) return false;
  const assigned = new Date(`${date}T${assignedTime}`);
  return Date.now() > assigned.getTime();
};

const BoxVisualizer = () => {
  const { boxes, medicos, pacientes, citas, liberarBox } = useAppStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 60000);
    return () => window.clearInterval(interval);
  }, []);

  void tick;

  return (
    <div className="space-y-3">
      {boxes.slice(0, 5).map((box) => {
        const medico = medicos.find((m) => m.id === box.medicoId);
        const paciente = pacientes.find((p) => p.id === box.pacienteId);
        const cita = citas.find((c) => c.id === box.citaId);
        const ocupado = box.estado === "ocupado";
        const atrasado = ocupado && isDelayed(cita?.fecha ?? new Date().toISOString().split("T")[0], box.horaInicioAsignada);

        return (
          <div
            key={box.id}
            className={cn(
              "rounded-md border p-4 transition-colors",
              ocupado ? "border-destructive/40 bg-destructive/10" : "border-success/40 bg-success/10",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{box.nombre}</p>
                <Badge className={ocupado ? "bg-destructive/20 text-destructive border-0" : "bg-success/20 text-success border-0"}>
                  {ocupado ? "Ocupado" : "Disponible"}
                </Badge>
              </div>
              {ocupado && <Button size="sm" variant="outline" onClick={() => liberarBox(box.id)}>Liberar</Button>}
            </div>

            {ocupado ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex gap-2"><Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="font-medium">{medico?.nombre ?? "Médico no encontrado"}</p><p className="text-muted-foreground">{medico?.especialidad ?? "—"} · {medico?.email ?? "—"}</p></div></div>
                <div className="flex gap-2"><User className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="font-medium">{paciente?.nombre ?? "Paciente no encontrado"}</p><p className="text-muted-foreground">{paciente?.rut ?? "—"} · {paciente?.telefono || paciente?.email || "—"}</p></div></div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>Inicio asignado: {formatTime(box.horaInicioAsignada)}</span>
                  <span>Término asignado: {formatTime(box.horaTerminoAsignada)}</span>
                  <span>Inicio real: {formatTime(box.horaInicioReal)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(elapsedSeconds(box.horaInicioReal))}</span>
                </div>
                {atrasado && <p className="text-destructive">Atención iniciada con atraso según hora asignada.</p>}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Sin médico ni paciente asignado.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BoxVisualizer;