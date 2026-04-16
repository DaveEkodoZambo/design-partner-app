import { Package, Archive } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { id: "versement", label: "Versement", icon: Package, path: "/sae/versement" },
];

const data = [
  { document: "Rapport Q1 2026.pdf", date: "2026-04-10", scelle: true },
  { document: "Note 042.docx", date: "2026-04-12", scelle: true },
];

const SAEVersement = () => (
  <ModuleLayout title="Versement" sidebarItems={sidebarItems} backPath="/sae">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Archives scellées" value={data.length} icon={Archive} color="bg-success" />
      </div>
      <DataTable
        columns={[
          { key: "document", label: "Document" },
          { key: "date", label: "Date d'archivage" },
          { key: "scelle", label: "Statut", render: (v: boolean) => (
            <Badge className="bg-success text-success-foreground">{v ? "Scellé" : "Non scellé"}</Badge>
          )},
        ]}
        data={data}
      />
    </div>
  </ModuleLayout>
);

export default SAEVersement;
