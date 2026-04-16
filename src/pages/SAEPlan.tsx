import { FolderTree } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import DataTable from "@/components/DataTable";
import KpiCard from "@/components/KpiCard";

const sidebarItems = [
  { id: "plan", label: "Plan de classement", icon: FolderTree, path: "/sae/plan" },
];

const data = [
  { nom: "Courriers officiels", duree: "10 ans" },
  { nom: "Notes de service", duree: "5 ans" },
  { nom: "Rapports financiers", duree: "30 ans" },
  { nom: "Documents RH", duree: "75 ans" },
];

const SAEPlan = () => (
  <ModuleLayout title="Plan de classement" sidebarItems={sidebarItems} backPath="/sae">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Catégories d'archivage" value={data.length} icon={FolderTree} />
      </div>
      <DataTable
        columns={[
          { key: "nom", label: "Catégorie" },
          { key: "duree", label: "Durée de conservation" },
        ]}
        data={data}
      />
    </div>
  </ModuleLayout>
);

export default SAEPlan;
