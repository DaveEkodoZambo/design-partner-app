import { Search, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface TableToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  placeholder?: string;
  exportData: any[];
  exportFileName: string;
  exportSheetName?: string;
  /** Optional row mapper to clean exported rows (omit fields, format, etc.) */
  exportMapper?: (row: any) => Record<string, any>;
  rightSlot?: React.ReactNode;
}

const TableToolbar = ({
  search,
  onSearchChange,
  placeholder = "Rechercher...",
  exportData,
  exportFileName,
  exportSheetName = "Données",
  exportMapper,
  rightSlot,
}: TableToolbarProps) => {
  const handleExport = () => {
    if (!exportData.length) {
      toast.error("Aucune donnée à exporter");
      return;
    }
    const rows = exportMapper ? exportData.map(exportMapper) : exportData;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, exportSheetName.slice(0, 31));
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${exportFileName}_${stamp}.xlsx`);
    toast.success("Export Excel généré", { description: `${rows.length} ligne(s) exportée(s)` });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card"
        />
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2 border-success/30 text-success hover:bg-success/10 hover:text-success"
        >
          <FileSpreadsheet className="w-4 h-4" /> Exporter Excel
        </Button>
      </div>
    </div>
  );
};

export default TableToolbar;
