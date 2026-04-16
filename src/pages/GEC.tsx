import { Inbox, Send, PlusCircle } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GEC = () => (
  <ModuleCards
    title="GEC - Gestion du Courrier"
    description="Gérer le flux des courriers"
    cards={[
      { id: "inbox", title: "Boîte de réception", description: "Courriers reçus", icon: Inbox, path: "/gec/reception", color: "bg-primary" },
      { id: "outbox", title: "Boîte d'envoi", description: "Courriers envoyés", icon: Send, path: "/gec/envoi", color: "bg-destructive" },
      { id: "new", title: "Nouveau courrier", description: "Créer un nouveau courrier", icon: PlusCircle, path: "/gec/nouveau", color: "bg-secondary" },
    ]}
  />
);

export default GEC;
