import { useState } from "react";
import { Download, Send as SendIcon } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { id: "entrant", label: "Courrier entrant", icon: Download, path: "/gec/nouveau/entrant" },
];

const CourrierEntrant = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ objet: "", expediteur: "", reference: "", priorite: "NORMALE", destinataire: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Courrier enregistré", description: "Le courrier entrant a été enregistré avec succès." });
    setForm({ objet: "", expediteur: "", reference: "", priorite: "NORMALE", destinataire: "" });
  };

  return (
    <ModuleLayout title="Courrier entrant" sidebarItems={sidebarItems} backPath="/gec/nouveau">
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-foreground">Enregistrer un courrier entrant</h3>
          <Input placeholder="Objet" value={form.objet} onChange={e => setForm({...form, objet: e.target.value})} required />
          <Input placeholder="Expéditeur externe" value={form.expediteur} onChange={e => setForm({...form, expediteur: e.target.value})} required />
          <Input placeholder="Référence externe" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} />
          <Select value={form.priorite} onValueChange={v => setForm({...form, priorite: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HAUTE">Haute</SelectItem>
              <SelectItem value="NORMALE">Normale</SelectItem>
              <SelectItem value="BASSE">Basse</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Destinataire (service/personne)" value={form.destinataire} onChange={e => setForm({...form, destinataire: e.target.value})} required />
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            <Download className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Glissez un fichier ici ou cliquez pour importer</p>
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2">
            <SendIcon className="w-4 h-4" /> Enregistrer
          </Button>
        </form>
      </div>
    </ModuleLayout>
  );
};

export default CourrierEntrant;
