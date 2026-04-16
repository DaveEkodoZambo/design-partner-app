import { FolderTree, Search, Settings } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GED = () => (
  <ModuleCards
    title="GED - Gestion Documentaire"
    description="Stocker, organiser et modifier les documents"
    cards={[
      { id: "arbo", title: "Arborescence", description: "Créer et gérer les dossiers", icon: FolderTree, path: "/ged/arborescence", color: "bg-primary" },
      { id: "explore", title: "Exploration", description: "Naviguer et rechercher", icon: Search, path: "/ged/exploration", color: "bg-secondary" },
      { id: "gestion", title: "Gestion documentaire", description: "Ajouter, modifier, archiver", icon: Settings, path: "/ged/gestion", color: "bg-destructive" },
    ]}
  />
);

export default GED;
