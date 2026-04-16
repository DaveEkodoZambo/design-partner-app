import { useState } from "react";
import { RefreshCw, Send as SendIcon } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { id: "interne", label: "Courrier interne", icon: RefreshCw, path: "/gec/nouveau/interne" },
];

const CourrierInterne = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ objet: "", serviceSource: "", serviceDestination: "", priorite: "NORMALE" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Courrier envoyé", description: "Le courrier interne a été transmis." });
    setForm({ objet: "", serviceSource: "", serviceDestination: "", priorite: "NORMALE" });
  };

  return (
    <ModuleLayout title="Courrier interne" sidebarItems={sidebarItems} backPath="/gec/nouveau">
      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-foreground">Envoyer un courrier interne</h3>
          <Input placeholder="Objet" value={form.objet} onChange={e => setForm({...form, objet: e.target.value})} required />
          <Input placeholder="Service source" value={form.serviceSource} onChange={e => setForm({...form, serviceSource: e.target.value})} required />
          <Input placeholder="Service destination" value={form.serviceDestination} onChange={e => setForm({...form, serviceDestination: e.target.value})} required />
          <Select value={form.priorite} onValueChange={v => setForm({...form, priorite: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HAUTE">Haute</SelectItem>
              <SelectItem value="NORMALE">Normale</SelectItem>
              <SelectItem value="BASSE">Basse</SelectItem>
            </SelectContent>
          </Select>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            <RefreshCw className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Joindre un fichier</p>
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2">
            <SendIcon className="w-4 h-4" /> Transmettre
          </Button>
        </form>
      </div>
    </ModuleLayout>
  );
};

export default CourrierInterne;
