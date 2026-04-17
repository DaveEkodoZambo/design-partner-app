import { useState } from "react";
import { Building2, Plus, FileText, Calendar } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const initialServices = [
  { id: 1, nom_service: "Direction Générale", description: "Direction de la CUY", actif: true, createdAt: "2024-01-01" },
  { id: 2, nom_service: "Secrétariat Général", description: "Coordination administrative", actif: true, createdAt: "2024-01-01" },
  { id: 3, nom_service: "Direction Technique", description: "Travaux et infrastructures", actif: true, createdAt: "2024-01-15" },
  { id: 4, nom_service: "Service Courrier", description: "Gestion du courrier entrant et sortant", actif: false, createdAt: "2024-02-10" },
];

const sidebarItems = [{ id: "services", label: "Services", icon: Building2, path: "/administration/services" }];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [form, setForm] = useState({ nom_service: "", description: "", actif: true });
  const [editId, setEditId] = useState<number | null>(null);

  const handleSave = () => {
    if (!form.nom_service) return;
    if (editId) {
      setServices(services.map(s => s.id === editId ? { ...s, ...form } : s));
      toast.success("Service modifié");
    } else {
      setServices([...services, { ...form, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }]);
      toast.success("Service ajouté");
    }
    setForm({ nom_service: "", description: "", actif: true });
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (row: any) => { setForm(row); setEditId(row.id); setOpen(true); };
  const handleDelete = (row: any) => { setServices(services.filter(s => s.id !== row.id)); toast.success("Service supprimé"); };
  const handleToggle = (row: any) => {
    setServices(services.map(s => s.id === row.id ? { ...s, actif: !s.actif } : s));
    toast.success(row.actif ? "Service désactivé" : "Service activé");
  };

  const columns = [
    { key: "nom_service", label: "Nom" },
    { key: "description", label: "Description" },
    { key: "actif", label: "Statut", render: (v: boolean) => (
      <Badge className={v ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>{v ? "Actif" : "Inactif"}</Badge>
    )},
  ];

  return (
    <ModuleLayout title="Services" sidebarItems={sidebarItems} backPath="/administration">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total services" value={services.length} icon={Building2} color="bg-secondary" />
          <KpiCard title="Services actifs" value={services.filter(s => s.actif).length} icon={Building2} color="bg-success" />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Liste des services</h3>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ nom_service: "", description: "", actif: true }); } }}>
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

        <DataTable columns={columns} data={services} onView={setDetail} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggle} />

        <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Détails du service</DialogTitle></DialogHeader>
            {detail && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{detail.nom_service}</h3>
                    <Badge className={detail.actif ? "bg-success text-success-foreground mt-1" : "bg-destructive text-destructive-foreground mt-1"}>{detail.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3"><FileText className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-muted-foreground">Description</p><p className="text-foreground font-medium mt-0.5">{detail.description || "—"}</p></div></div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Créé le:</span><span className="text-foreground font-medium">{detail.createdAt}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default Services;
