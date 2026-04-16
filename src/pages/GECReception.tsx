import { Inbox, MailOpen, Mail } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { id: "reception", label: "Boîte de réception", icon: Inbox, path: "/gec/reception" },
];

const data = [
  { objet: "Demande d'autorisation", expediteur: "Ministère de l'Habitat", date: "2026-04-15", statut: "Non lu" },
  { objet: "Rapport d'activité Q1", expediteur: "Direction Technique", date: "2026-04-14", statut: "Traité" },
  { objet: "Convocation réunion", expediteur: "Cabinet du Maire", date: "2026-04-13", statut: "Non lu" },
];

const GECReception = () => (
  <ModuleLayout title="Boîte de réception" sidebarItems={sidebarItems} backPath="/gec">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard title="Courriers non lus" value={data.filter(d => d.statut === "Non lu").length} icon={Mail} color="bg-destructive" />
        <KpiCard title="Courriers traités" value={data.filter(d => d.statut === "Traité").length} icon={MailOpen} color="bg-success" />
      </div>
      <DataTable
        columns={[
          { key: "objet", label: "Objet" },
          { key: "expediteur", label: "Expéditeur" },
          { key: "date", label: "Date" },
          { key: "statut", label: "Statut", render: (v: string) => (
            <Badge className={v === "Non lu" ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}>{v}</Badge>
          )},
        ]}
        data={data}
      />
    </div>
  </ModuleLayout>
);

export default GECReception;
