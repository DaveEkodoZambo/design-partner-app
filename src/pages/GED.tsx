import { FolderTree, Search, Settings, Eye, Folder, FileText, FileEdit } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GED = () => (
  <ModuleCards
    title="GED — Gestion Documentaire"
    description="Structurez, explorez et administrez l'ensemble des documents institutionnels"
    cards={[
      {
        id: "arbo", title: "Arborescence",
        description: "Construisez la structure hiérarchique des dossiers et sous-dossiers. Modifiez ou supprimez les emplacements.",
        icon: FolderTree, path: "/ged/arborescence", color: "bg-primary",
        stats: [{ label: "Dossiers", value: "346", icon: Folder }],
      },
      {
        id: "explore", title: "Exploration",
        description: "Naviguez de manière hiérarchique dans tous les dossiers racines jusqu'aux fichiers, comme un explorateur.",
        icon: Search, path: "/ged/exploration", color: "bg-secondary",
        stats: [{ label: "Documents", value: "8 712", icon: FileText }],
      },
      {
        id: "gestion", title: "Gestion documentaire",
        description: "Créez, modifiez, activez ou supprimez les documents avant leur diffusion dans l'exploration.",
        icon: Settings, path: "/ged/gestion", color: "bg-destructive",
        stats: [{ label: "Opérations", value: "CRUD", icon: FileEdit }],
      },
      {
        id: "visu", title: "Visualisation",
        description: "Prévisualisez les documents et scellez-les en archive pour les transférer définitivement vers la SAE.",
        icon: Eye, path: "/ged/visualisation", color: "bg-primary",
        stats: [{ label: "Action", value: "Sceller", icon: FileEdit }],
      },
    ]}
  />
);

export default GED;
