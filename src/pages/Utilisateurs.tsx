import { useState } from "react";
import { Users, UserCheck, Plus, Mail, Building2, Shield, Calendar } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const initialUsers = [
  { id: 1, nom: "Nguema", prenom: "Jean", email: "jean@cuy.cm", role: "MAIRE", service: "Direction Générale", actif: true, createdAt: "2024-01-15" },
  { id: 2, nom: "Mbarga", prenom: "Marie", email: "marie@cuy.cm", role: "SG", service: "Secrétariat Général", actif: true, createdAt: "2024-02-10" },
  { id: 3, nom: "Fouda", prenom: "Paul", email: "paul@cuy.cm", role: "DIRECTEUR", service: "Direction Technique", actif: true, createdAt: "2024-03-05" },
  { id: 4, nom: "Atangana", prenom: "Sophie", email: "sophie@cuy.cm", role: "AGENT", service: "Service Courrier", actif: false, createdAt: "2024-04-20" },
];

const sidebarItems = [{ id: "users", label: "Utilisateurs", icon: Users, path: "/administration/utilisateurs" }];

const Utilisateurs = () => {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<any>(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", role: "AGENT", service: "", actif: true });
  const [editId, setEditId] = useState<number | null>(null);

  const handleSave = () => {
    if (!form.nom || !form.email) return;
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, ...form } : u));
      toast.success("Utilisateur modifié");
    } else {
      setUsers([...users, { ...form, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }]);
      toast.success("Utilisateur ajouté");
    }
    setForm({ nom: "", prenom: "", email: "", role: "AGENT", service: "", actif: true });
    setEditId(null);
    setOpen(false);
  };

  const handleEdit = (row: any) => { setForm(row); setEditId(row.id); setOpen(true); };
  const handleDelete = (row: any) => { setUsers(users.filter(u => u.id !== row.id)); toast.success("Utilisateur supprimé"); };
  const handleToggle = (row: any) => {
    setUsers(users.map(u => u.id === row.id ? { ...u, actif: !u.actif } : u));
    toast.success(row.actif ? "Utilisateur désactivé" : "Utilisateur activé");
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prénom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle", render: (v: string) => <Badge variant="outline">{v}</Badge> },
    { key: "service", label: "Service" },
    { key: "actif", label: "Statut", render: (v: boolean) => (
      <Badge className={v ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>{v ? "Actif" : "Inactif"}</Badge>
    )},
  ];

  return (
    <ModuleLayout title="Utilisateurs" sidebarItems={sidebarItems} backPath="/administration">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total utilisateurs" value={users.length} icon={Users} />
          <KpiCard title="Utilisateurs actifs" value={users.filter(u => u.actif).length} icon={UserCheck} color="bg-success" />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Liste des utilisateurs</h3>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ nom: "", prenom: "", email: "", role: "AGENT", service: "", actif: true }); } }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Modifier" : "Ajouter"} un utilisateur</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                <Input placeholder="Prénom" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
                <Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAIRE">Maire</SelectItem>
                    <SelectItem value="SG">Secrétaire Général</SelectItem>
                    <SelectItem value="DIRECTEUR">Directeur</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Service" value={form.service} onChange={e => setForm({...form, service: e.target.value})} />
                <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">{editId ? "Modifier" : "Ajouter"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={columns} data={users} onView={setDetailUser} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggle} />

        {/* Detail Modal */}
        <Dialog open={!!detailUser} onOpenChange={(v) => !v && setDetailUser(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Détails de l'utilisateur</DialogTitle></DialogHeader>
            {detailUser && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {detailUser.prenom[0]}{detailUser.nom[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{detailUser.prenom} {detailUser.nom}</h3>
                    <Badge variant="outline" className="mt-1">{detailUser.role}</Badge>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Email:</span><span className="text-foreground font-medium">{detailUser.email}</span></div>
                  <div className="flex items-center gap-3"><Building2 className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Service:</span><span className="text-foreground font-medium">{detailUser.service}</span></div>
                  <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Statut:</span>
                    <Badge className={detailUser.actif ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>{detailUser.actif ? "Actif" : "Inactif"}</Badge>
                  </div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Créé le:</span><span className="text-foreground font-medium">{detailUser.createdAt}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default Utilisateurs;
