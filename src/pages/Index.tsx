import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, ShieldCheck, Monitor } from "lucide-react";

const Index = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 gap-8">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-primary">CliniaONE</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-md text-center">
          Sistema integral de gestión médica. Administra pacientes, médicos, citas y más.
        </p>
        <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8">
          Iniciar Sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 gap-8">
      <div className="flex items-center gap-3">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">CliniaONE</h1>
      </div>
      <p className="text-muted-foreground">Bienvenido, {user.name}. Selecciona un panel:</p>
      <div className="grid gap-4 md:grid-cols-2 max-w-2xl w-full">
        {hasRole("admin") && (
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/admin")}>
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Panel Admin</CardTitle>
              <CardDescription>Gestión completa del sistema, pacientes, médicos y reportes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ir al Panel Admin</Button>
            </CardContent>
          </Card>
        )}
        {hasRole("meson") && (
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/meson")}>
            <CardHeader>
              <Monitor className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Panel Mesón</CardTitle>
              <CardDescription>Atención al paciente, citas, triage y órdenes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Ir al Mesón</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
