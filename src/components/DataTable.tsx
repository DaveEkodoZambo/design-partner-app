import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const DataTable = ({ columns, data, onEdit, onDelete }: DataTableProps) => (
  <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          {columns.map((col) => (
            <TableHead key={col.key} className="font-semibold text-foreground">{col.label}</TableHead>
          ))}
          {(onEdit || onDelete) && <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
              Aucune donnée disponible
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, i) => (
            <TableRow key={i} className="hover:bg-muted/50">
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => onDelete(row)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default DataTable;
