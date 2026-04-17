import { useState } from "react";
import { RefreshCw, Send as SendIcon } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

const sidebarItems = [{ id: "interne", label: "Courrier interne", icon: RefreshCw, path: "/gec/nouveau/interne" }];

const CourrierInterne = () => {
  const addCourrier = useAppStore((s) => s.addCourrier);
  const [form, setForm] = useState({ objet: "", serviceSource: "", serviceDestination: "", priorite: "NORMALE" as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourrier({
      type: "reception", objet: form.objet, contact: `${form.serviceSource} → ${form.serviceDestination}`,
      priorite: form.priorite, date: new Date().toISOString().slice(0, 10), statut: "Non lu",
      assignedTo: form.serviceDestination,
    });
    toast.success("Courrier transmis", { description: "Le courrier interne a été transmis." });
    setForm({ objet: "", serviceSource: "", serviceDestination: "", priorite: "NORMALE" });
  };

  return (
    <ModuleLayout title="Courrier interne" sidebarItems={sidebarItems} backPath="/gec/nouveau">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8 shadow-card space-y-4">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground">Envoyer un courrier interne</h3>
              <p className="text-xs text-muted-foreground mt-1">Communication entre deux services de la CUY</p>
            </div>
            <Input placeholder="Objet" value={form.objet} onChange={e => setForm({...form, objet: e.target.value})} required />
            <Input placeholder="Service source" value={form.serviceSource} onChange={e => setForm({...form, serviceSource: e.target.value})} required />
            <Input placeholder="Service destination" value={form.serviceDestination} onChange={e => setForm({...form, serviceDestination: e.target.value})} required />
            <Select value={form.priorite} onValueChange={(v: any) => setForm({...form, priorite: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HAUTE">Priorité haute</SelectItem>
                <SelectItem value="NORMALE">Priorité normale</SelectItem>
                <SelectItem value="BASSE">Priorité basse</SelectItem>
              </SelectContent>
            </Select>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:border-primary transition-colors cursor-pointer">
              <RefreshCw className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Joindre un fichier</p>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2 h-11">
              <SendIcon className="w-4 h-4" /> Transmettre
            </Button>
          </form>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default CourrierInterne;
