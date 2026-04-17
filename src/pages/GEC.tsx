import { Inbox, Send, PlusCircle, Mail, Clock, FileText } from "lucide-react";
import ModuleCards from "@/components/ModuleCards";

const GEC = () => (
  <ModuleCards
    title="GEC — Gestion du Courrier"
    description="Pilotez le flux complet des correspondances entrantes, sortantes et internes"
    cards={[
      {
        id: "inbox", title: "Boîte de réception",
        description: "Consultez les courriers reçus, traitez les demandes et assignez les documents aux services concernés.",
        icon: Inbox, path: "/gec/reception", color: "bg-primary",
        stats: [{ label: "Reçus", value: "342", icon: Mail }, { label: "Non lus", value: "12", icon: Clock }],
      },
      {
        id: "outbox", title: "Boîte d'envoi",
        description: "Suivez l'historique des courriers émis vers l'externe et vérifiez leur statut de transmission.",
        icon: Send, path: "/gec/envoi", color: "bg-destructive",
        stats: [{ label: "Envoyés", value: "215", icon: Send }, { label: "Ce mois", value: "28", icon: FileText }],
      },
      {
        id: "new", title: "Nouveau courrier",
        description: "Enregistrez un courrier entrant, créez un courrier sortant ou transmettez en interne entre services.",
        icon: PlusCircle, path: "/gec/nouveau", color: "bg-secondary",
        stats: [{ label: "Types", value: "3", icon: FileText }],
      },
    ]}
  />
);

export default GEC;
