import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MesonMedicos = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Médicos Disponibles</h1>
    <Card>
      <CardHeader><CardTitle>Médicos</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nombre</TableHead><TableHead>Especialidad</TableHead><TableHead>Disponibilidad</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                No hay médicos registrados.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default MesonMedicos;
