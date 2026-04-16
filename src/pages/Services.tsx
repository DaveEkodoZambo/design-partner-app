import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialServices = [
  { id: 1, nom_service: "Direction Générale", description: "Direction de la CUY" },
  { id: 2, nom_service: "Secrétariat Général", description: "Coordination administrative" },
  { id: 3, nom_service: "Direction Technique", description: "Travaux et infrastructures" },
  { id: 4, nom_service: "Service Courrier", description: "Gestion du courrier entrant et sortant" },
];

const sidebarItems = [
  { id: "services", label: "Services", icon: Building2, path: "/administration/services" },
];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nom_service: "", description: "" });
  const [editId, setEditId] = useState<number | null>(null);

  const handleSave = () => {
    if (!form.nom_service) return;
    if (editId) {
      setServices(services.map(s => s.id === editId ? { ...s, ...form } : s));
    } else {
      setServices([...services, { ...form, id: Date.now() }]);
    }
    setForm({ nom_service: "", description: "" });
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (row: any) => { setForm(row); setEditId(row.id); setOpen(true); };
  const handleDelete = (row: any) => { setServices(services.filter(s => s.id !== row.id)); };

  return (
    <ModuleLayout title="Services" sidebarItems={sidebarItems} backPath="/administration">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total services" value={services.length} icon={Building2} color="bg-secondary" />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Liste des services</h3>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ nom_service: "", description: "" }); } }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Modifier" : "Ajouter"} un service</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom du service" value={form.nom_service} onChange={e => setForm({...form, nom_service: e.target.value})} />
                <Textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">{editId ? "Modifier" : "Ajouter"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={[{ key: "nom_service", label: "Nom" }, { key: "description", label: "Description" }]} data={services} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </ModuleLayout>
  );
};

export default Services;
