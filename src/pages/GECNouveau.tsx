import { Download, Upload, RefreshCw, FileInput, FileOutput, FileSymlink } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GECNouveau = () => (
  <ModuleCards
    title="Nouveau Courrier"
    description="Sélectionnez le type de courrier à enregistrer dans le système"
    cards={[
      {
        id: "entrant", title: "Courrier entrant",
        description: "Enregistrez un document reçu d'une institution externe avec son expéditeur, sa référence et sa priorité.",
        icon: Download, path: "/gec/nouveau/entrant", color: "bg-primary",
        stats: [{ label: "Type", value: "Externe → CUY", icon: FileInput }],
      },
      {
        id: "sortant", title: "Courrier sortant",
        description: "Créez un courrier officiel à destination d'une institution externe avec pièce jointe et niveau de priorité.",
        icon: Upload, path: "/gec/nouveau/sortant", color: "bg-destructive",
        stats: [{ label: "Type", value: "CUY → Externe", icon: FileOutput }],
      },
      {
        id: "interne", title: "Courrier interne",
        description: "Transmettez un document entre deux services de la CUY pour validation, information ou action.",
        icon: RefreshCw, path: "/gec/nouveau/interne", color: "bg-secondary",
        stats: [{ label: "Type", value: "Service → Service", icon: FileSymlink }],
      },
    ]}
    backPath="/gec"
  />
);

export default GECNouveau;
