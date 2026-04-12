import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Palette, Globe, Shield } from "lucide-react";

const MesonConfiguracion = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Configuración</h1>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /><CardTitle>Notificaciones</CardTitle></div>
          <CardDescription>Gestiona tus preferencias de notificación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Sonido de alerta</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Notificaciones de citas</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Alertas de triage</Label><Switch defaultChecked /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Palette className="h-5 w-5 text-info" /><CardTitle>Apariencia</CardTitle></div>
          <CardDescription>Personaliza la interfaz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Modo oscuro</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Animaciones</Label><Switch defaultChecked /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-success" /><CardTitle>Regional</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between"><span className="text-sm">Idioma</span><span className="text-sm text-muted-foreground">Español</span></div>
          <div className="flex items-center justify-between"><span className="text-sm">Zona horaria</span><span className="text-sm text-muted-foreground">America/Santiago</span></div>
          <div className="flex items-center justify-between"><span className="text-sm">Formato de fecha</span><span className="text-sm text-muted-foreground">DD/MM/YYYY</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-warning" /><CardTitle>Privacidad</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Compartir estadísticas</Label><Switch /></div>
          <div className="flex items-center justify-between"><Label>Recordar sesión</Label><Switch defaultChecked /></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default MesonConfiguracion;
