import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Power, MoreHorizontal, type LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onClick: (row: any) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onToggleActive?: (row: any) => void;
  onRowClick?: (row: any) => void;
  extraActions?: RowAction[];
  actionsAsMenu?: boolean;
}

const DataTable = ({ columns, data, onEdit, onDelete, onView, onToggleActive, onRowClick, extraActions, actionsAsMenu }: DataTableProps) => {
  const hasActions = !!(onEdit || onDelete || onView || onToggleActive || extraActions?.length);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((col) => (
              <TableHead key={col.key} className="font-semibold text-foreground">{col.label}</TableHead>
            ))}
            {hasActions && <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                Aucune donnée disponible
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={i}
                className={`hover:bg-muted/50 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {actionsAsMenu ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(row)}>
                              <Eye className="w-4 h-4 mr-2" /> Voir détails
                            </DropdownMenuItem>
                          )}
                          {extraActions?.map((a, idx) => (
                            <DropdownMenuItem key={idx} onClick={() => a.onClick(row)} className={a.variant === "destructive" ? "text-destructive" : ""}>
                              <a.icon className="w-4 h-4 mr-2" /> {a.label}
                            </DropdownMenuItem>
                          ))}
                          {(onEdit || onDelete || onToggleActive) && <DropdownMenuSeparator />}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(row)}>
                              <Pencil className="w-4 h-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                          )}
                          {onToggleActive && (
                            <DropdownMenuItem onClick={() => onToggleActive(row)}>
                              <Power className="w-4 h-4 mr-2" /> {row.actif ? "Désactiver" : "Activer"}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem onClick={() => onDelete(row)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex justify-end gap-1">
                        {onView && (
                          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onView(row)} title="Voir détails">
                            <Eye className="w-4 h-4 text-primary" />
                          </Button>
                        )}
                        {onToggleActive && (
                          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onToggleActive(row)} title={row.actif ? "Désactiver" : "Activer"}>
                            <Power className={`w-4 h-4 ${row.actif ? "text-success" : "text-muted-foreground"}`} />
                          </Button>
                        )}
                        {onEdit && (
                          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onEdit(row)} title="Modifier">
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onDelete(row)} title="Supprimer">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
