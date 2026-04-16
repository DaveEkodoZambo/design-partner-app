import { Users, Building2 } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const Administration = () => (
  <ModuleCards
    title="Administration"
    description="Gestion des utilisateurs et de l'organisation"
    cards={[
      { id: "users", title: "Utilisateurs", description: "Gérer les comptes utilisateurs", icon: Users, path: "/administration/utilisateurs", color: "bg-primary" },
      { id: "services", title: "Services", description: "Gérer les services de la CUY", icon: Building2, path: "/administration/services", color: "bg-secondary" },
    ]}
  />
);

export default Administration;
