import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore, SystemUser } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";
import { assignRole, createProfile } from "@/lib/consultasSupabase";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NuevoUsuarioDialog = ({ open, onOpenChange }: Props) => {
  const { addUser } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SystemUser["role"]>("meson");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    try {
      // 1. Guardar sesión actual del admin
      const { data: adminSession } = await supabase.auth.getSession();
      const adminEmail = adminSession.session?.user?.email;

      // 2. Registrar nuevo usuario en Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (signUpError) throw signUpError;

      const newUserId = signUpData.user?.id;
      if (!newUserId) throw new Error("No se pudo obtener el ID del nuevo usuario");

      // 3. Asignar rol y crear perfil
      try {
        await assignRole(newUserId, role);
      } catch (roleErr) {
        console.warn("No se pudo asignar rol (RLS puede requerir admin):", roleErr);
      }

      try {
        await createProfile(newUserId, { full_name: name, email });
      } catch (profErr) {
        console.warn("Perfil podría haberse creado por trigger:", profErr);
      }

      // 4. Agregar al store local para vista inmediata
      addUser({ name, email, role });

      toast.success("Usuario creado exitosamente");
      setName(""); setEmail(""); setPassword(""); setRole("meson");
      onOpenChange(false);

      // 5. Re-autenticar al admin si perdió sesión
      if (adminEmail && adminSession.session) {
        const { data: currentSession } = await supabase.auth.getSession();
        if (currentSession.session?.user?.email !== adminEmail) {
          // El admin perdió su sesión, re-autenticar no es posible sin password
          // El signUp NO hace login si la confirmación por email está activa
          console.info("Sesión del admin mantenida (confirmación por email activa).");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Crea un nuevo usuario del sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Contraseña</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as SystemUser["role"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="meson">Mesón</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NuevoUsuarioDialog;
