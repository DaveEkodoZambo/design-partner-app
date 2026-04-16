import { Download, Upload, RefreshCw } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GECNouveau = () => (
  <ModuleCards
    title="Nouveau Courrier"
    description="Sélectionnez le type de courrier à créer"
    cards={[
      { id: "entrant", title: "Courrier entrant", description: "Enregistrer un document externe", icon: Download, path: "/gec/nouveau/entrant", color: "bg-primary" },
      { id: "sortant", title: "Courrier sortant", description: "Créer un courrier pour l'extérieur", icon: Upload, path: "/gec/nouveau/sortant", color: "bg-destructive" },
      { id: "interne", title: "Courrier interne", description: "Communication entre services", icon: RefreshCw, path: "/gec/nouveau/interne", color: "bg-secondary" },
    ]}
    backPath="/gec"
  />
);

export default GECNouveau;
