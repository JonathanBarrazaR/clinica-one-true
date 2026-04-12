import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import MesonLayout from "@/components/layout/MesonLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPacientes from "./pages/admin/Pacientes";
import AdminMedicos from "./pages/admin/Medicos";
import Reportes from "./pages/admin/Reportes";
import Sistema from "./pages/admin/Sistema";
import MesonInicio from "./pages/meson/Inicio";
import MesonPacientes from "./pages/meson/Pacientes";
import MesonMedicos from "./pages/meson/Medicos";
import MesonOrdenes from "./pages/meson/Ordenes";
import MesonCitas from "./pages/meson/Citas";
import MesonTriage from "./pages/meson/Triage";
import MesonConfiguracion from "./pages/meson/Configuracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="pacientes" element={<AdminPacientes />} />
              <Route path="medicos" element={<AdminMedicos />} />
              <Route path="reportes" element={<Reportes />} />
              <Route path="sistema" element={<Sistema />} />
            </Route>
            <Route path="/meson" element={<ProtectedRoute requiredRole="meson"><MesonLayout /></ProtectedRoute>}>
              <Route index element={<MesonInicio />} />
              <Route path="pacientes" element={<MesonPacientes />} />
              <Route path="medicos" element={<MesonMedicos />} />
              <Route path="ordenes" element={<MesonOrdenes />} />
              <Route path="citas" element={<MesonCitas />} />
              <Route path="triage" element={<MesonTriage />} />
              <Route path="configuracion" element={<MesonConfiguracion />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
