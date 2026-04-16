import { useState } from "react";
import { Settings, Plus, FileText } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { id: "gestion", label: "Gestion documentaire", icon: Settings, path: "/ged/gestion" },
];

const initialDocs = [
  { id: 1, nom: "Rapport Q1 2026.pdf", type: "PDF", dossier: "Rapports", date: "2026-03-30" },
  { id: 2, nom: "Note 042.docx", type: "DOCX", dossier: "Notes de service", date: "2026-04-10" },
];

const GEDGestion = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = (row: any) => setDocs(docs.filter(d => d.id !== row.id));

  return (
    <ModuleLayout title="Gestion documentaire" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total documents" value={docs.length} icon={FileText} />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Documents</h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Ajouter un document</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom du document" />
                <Select defaultValue="PDF">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => { setOpen(false); toast({ title: "Document ajouté" }); }} className="w-full gradient-primary text-primary-foreground">Ajouter</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          columns={[
            { key: "nom", label: "Nom" },
            { key: "type", label: "Type" },
            { key: "dossier", label: "Dossier" },
            { key: "date", label: "Date" },
          ]}
          data={docs}
          onEdit={() => toast({ title: "Modification", description: "Fonctionnalité en développement" })}
          onDelete={handleDelete}
        />
      </div>
    </ModuleLayout>
  );
};

export default GEDGestion;
