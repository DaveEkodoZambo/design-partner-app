import { Users, Building2, UserCheck, Activity } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const Administration = () => (
  <ModuleCards
    title="Administration"
    description="Gestion des utilisateurs et de l'organisation institutionnelle"
    cards={[
      {
        id: "users", title: "Gestion des utilisateurs",
        description: "Créez et administrez les comptes, attribuez les rôles, activez ou désactivez les accès des agents.",
        icon: Users, path: "/administration/utilisateurs", color: "bg-primary",
        stats: [{ label: "Comptes", value: "124", icon: Users }, { label: "Actifs", value: "118", icon: UserCheck }],
      },
      {
        id: "services", title: "Services & Directions",
        description: "Organisez la structure de la CUY : directions, services et sous-services avec leurs descriptions détaillées.",
        icon: Building2, path: "/administration/services", color: "bg-secondary",
        stats: [{ label: "Services", value: "18", icon: Building2 }, { label: "Actifs", value: "16", icon: Activity }],
      },
    ]}
  />
);

export default Administration;
