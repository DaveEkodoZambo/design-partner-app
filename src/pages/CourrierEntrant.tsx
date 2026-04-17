import { useState } from "react";
import { Download, Send as SendIcon } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

const sidebarItems = [{ id: "entrant", label: "Courrier entrant", icon: Download, path: "/gec/nouveau/entrant" }];

const CourrierEntrant = () => {
  const addCourrier = useAppStore((s) => s.addCourrier);
  const [form, setForm] = useState({ objet: "", expediteur: "", reference: "", priorite: "NORMALE" as const, destinataire: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourrier({
      type: "reception", objet: form.objet, contact: form.expediteur, reference: form.reference,
      priorite: form.priorite, date: new Date().toISOString().slice(0, 10), statut: "Non lu",
      assignedTo: form.destinataire,
    });
    toast.success("Courrier enregistré", { description: "Le courrier entrant a été enregistré." });
    setForm({ objet: "", expediteur: "", reference: "", priorite: "NORMALE", destinataire: "" });
  };

  return (
    <ModuleLayout title="Courrier entrant" sidebarItems={sidebarItems} backPath="/gec/nouveau">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8 shadow-card space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground">Enregistrer un courrier entrant</h3>
              <p className="text-xs text-muted-foreground mt-1">Document reçu d'une institution externe</p>
            </div>
            <Input placeholder="Objet" value={form.objet} onChange={e => setForm({...form, objet: e.target.value})} required />
            <Input placeholder="Expéditeur externe" value={form.expediteur} onChange={e => setForm({...form, expediteur: e.target.value})} required />
            <Input placeholder="Référence externe (optionnel)" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} />
            <Select value={form.priorite} onValueChange={(v: any) => setForm({...form, priorite: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HAUTE">Priorité haute</SelectItem>
                <SelectItem value="NORMALE">Priorité normale</SelectItem>
                <SelectItem value="BASSE">Priorité basse</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Destinataire (service / personne)" value={form.destinataire} onChange={e => setForm({...form, destinataire: e.target.value})} required />
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:border-primary transition-colors cursor-pointer">
              <Download className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Glissez un fichier ici ou cliquez pour importer</p>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2 h-11">
              <SendIcon className="w-4 h-4" /> Enregistrer
            </Button>
          </form>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default CourrierEntrant;
