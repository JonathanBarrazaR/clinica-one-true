import { Home, Users, UserCog, ClipboardList, CalendarDays, HeartPulse, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Inicio", url: "/meson", icon: Home },
  { title: "Pacientes", url: "/meson/pacientes", icon: Users },
  { title: "Médicos", url: "/meson/medicos", icon: UserCog },
  { title: "Órdenes", url: "/meson/ordenes", icon: ClipboardList },
  { title: "Citas", url: "/meson/citas", icon: CalendarDays },
  { title: "Triage", url: "/meson/triage", icon: HeartPulse },
  { title: "Configuración", url: "/meson/configuracion", icon: Settings },
];

export function MesonSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-lg px-4 py-6">
            {!collapsed && "CliniaONE"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/meson"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <p className="text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
        )}
        <SidebarMenuButton onClick={signOut} className="hover:bg-destructive/20 hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
