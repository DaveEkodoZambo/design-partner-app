import { Send, Mail } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { id: "envoi", label: "Boîte d'envoi", icon: Send, path: "/gec/envoi" },
];

const data = [
  { objet: "Réponse autorisation", destinataire: "Ministère de l'Habitat", date: "2026-04-15", statut: "Envoyé" },
  { objet: "Note de service", destinataire: "Tous les services", date: "2026-04-12", statut: "Envoyé" },
];

const GECEnvoi = () => (
  <ModuleLayout title="Boîte d'envoi" sidebarItems={sidebarItems} backPath="/gec">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Total envoyés" value={data.length} icon={Mail} />
      </div>
      <DataTable
        columns={[
          { key: "objet", label: "Objet" },
          { key: "destinataire", label: "Destinataire" },
          { key: "date", label: "Date" },
          { key: "statut", label: "Statut", render: (v: string) => <Badge className="bg-primary text-primary-foreground">{v}</Badge> },
        ]}
        data={data}
      />
    </div>
  </ModuleLayout>
);

export default GECEnvoi;
