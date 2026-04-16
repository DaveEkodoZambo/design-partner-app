import { FolderTree, Package, Search } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const SAE = () => (
  <ModuleCards
    title="SAE - Archivage Électronique"
    description="Conservation légale des documents"
    cards={[
      { id: "plan", title: "Plan de classement", description: "Structure d'archivage", icon: FolderTree, path: "/sae/plan", color: "bg-primary" },
      { id: "versement", title: "Versement", description: "Transférer depuis la GED", icon: Package, path: "/sae/versement", color: "bg-secondary" },
      { id: "recherche", title: "Recherche archives", description: "Recherche historique", icon: Search, path: "/sae/recherche", color: "bg-destructive" },
    ]}
  />
);

export default SAE;
