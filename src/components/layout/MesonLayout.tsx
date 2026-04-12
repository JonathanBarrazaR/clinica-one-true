import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MesonSidebar } from "./MesonSidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MesonLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MesonSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 gap-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold text-foreground">Mesón</h2>
            <div className="flex-1 max-w-md ml-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar paciente..." className="pl-9" />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MesonLayout;
