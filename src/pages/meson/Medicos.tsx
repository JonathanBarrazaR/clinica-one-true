import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/appStore";

const MesonMedicos = () => {
  const { medicos } = useAppStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Médicos Disponibles</h1>
      <Card>
        <CardHeader><CardTitle>Médicos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Nombre</TableHead><TableHead>Especialidad</TableHead><TableHead>Email</TableHead><TableHead>Disponibilidad</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {medicos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No hay médicos registrados.</TableCell></TableRow>
              ) : medicos.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.nombre}</TableCell><TableCell>{m.especialidad}</TableCell><TableCell>{m.email}</TableCell>
                  <TableCell><Badge className="bg-success/20 text-success border-0">{m.estado}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesonMedicos;
