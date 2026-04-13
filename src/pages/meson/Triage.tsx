import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HeartPulse, ChevronRight, RotateCcw } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useToast } from "@/hooks/use-toast";

const questions = [
  { q: "¿El paciente presenta dificultad para respirar?", options: ["Sí, severa", "Sí, leve", "No"] },
  { q: "¿El paciente presenta dolor torácico?", options: ["Sí, intenso", "Sí, moderado", "No"] },
  { q: "¿Cuál es la temperatura corporal?", options: ["> 39°C", "37.5 - 39°C", "< 37.5°C"] },
  { q: "¿El paciente presenta sangrado activo?", options: ["Sí, abundante", "Sí, leve", "No"] },
  { q: "¿Nivel de conciencia del paciente?", options: ["Inconsciente", "Confuso", "Alerta"] },
  { q: "¿El paciente puede caminar?", options: ["No", "Con dificultad", "Sí"] },
];

const getPriority = (score: number) => {
  if (score >= 10) return { label: "Emergencia", color: "bg-destructive text-destructive-foreground", desc: "Atención inmediata requerida" };
  if (score >= 7) return { label: "Urgencia Alta", color: "bg-warning text-primary-foreground", desc: "Atención prioritaria en menos de 15 min" };
  if (score >= 4) return { label: "Urgencia Media", color: "bg-info text-primary-foreground", desc: "Atención en menos de 30 min" };
  return { label: "Consulta General", color: "bg-success text-primary-foreground", desc: "Atención programada" };
};

const MesonTriage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pacientes, updatePacienteTriage } = useAppStore();
  const { toast } = useToast();

  const preselectedId = searchParams.get("pacienteId");
  const [selectedPacienteId, setSelectedPacienteId] = useState(preselectedId || "");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (preselectedId) setSelectedPacienteId(preselectedId);
  }, [preselectedId]);

  const handleAnswer = (optionIndex: number) => {
    const score = 2 - optionIndex;
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const handleSaveResult = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const priority = getPriority(totalScore);
    updatePacienteTriage(Number(selectedPacienteId), { label: priority.label, score: totalScore, desc: priority.desc });
    toast({ title: "Triage guardado", description: `Resultado asociado al paciente exitosamente.` });
    navigate("/meson/pacientes");
  };

  const reset = () => { setCurrent(0); setAnswers([]); setFinished(false); setStarted(false); setSelectedPacienteId(""); };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const priority = getPriority(totalScore);
  const progress = finished ? 100 : started ? (current / questions.length) * 100 : 0;
  const selectedPaciente = pacientes.find((p) => p.id.toString() === selectedPacienteId);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Triage</h1>
      </div>
      <Progress value={progress} className="h-2" />

      {!started ? (
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Paciente</CardTitle>
            <CardDescription>Seleccione un paciente antes de iniciar el triage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select value={selectedPacienteId} onValueChange={setSelectedPacienteId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                <SelectContent>
                  {pacientes.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} - {p.rut}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPaciente && (
              <div className="bg-accent/50 p-3 rounded-lg text-sm space-y-1">
                <p><strong>Paciente:</strong> {selectedPaciente.nombre}</p>
                <p><strong>RUT:</strong> {selectedPaciente.rut}</p>
                <p><strong>Teléfono:</strong> {selectedPaciente.telefono}</p>
              </div>
            )}
            <Button className="w-full" disabled={!selectedPacienteId} onClick={() => setStarted(true)}>
              Iniciar Triage
            </Button>
          </CardContent>
        </Card>
      ) : !finished ? (
        <Card>
          <CardHeader>
            <CardDescription>Pregunta {current + 1} de {questions.length} — Paciente: {selectedPaciente?.nombre}</CardDescription>
            <CardTitle className="text-lg">{questions[current].q}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions[current].options.map((opt, i) => (
              <Button key={i} variant="outline" className="w-full justify-between text-left h-auto py-3" onClick={() => handleAnswer(i)}>
                {opt}<ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Resultado del Triage</CardTitle>
            <CardDescription>Paciente: {selectedPaciente?.nombre}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <Badge className={`${priority.color} text-lg px-4 py-2`}>{priority.label}</Badge>
              <p className="text-muted-foreground">{priority.desc}</p>
              <p className="text-sm text-muted-foreground">Puntuación: {totalScore} / {questions.length * 2}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveResult} className="flex-1">
                Guardar y asociar al paciente
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />Nuevo Triage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MesonTriage;
