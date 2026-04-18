import { useMemo, useState } from "react";
import { Settings, Plus, FileText, Calendar, Folder, UserCog } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import TableToolbar from "@/components/TableToolbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const sidebarItems = [{ id: "gestion", label: "Gestion documentaire", icon: Settings, path: "/ged/gestion" }];

const GEDGestion = () => {
  const { documents, folders, addDocument, updateDocument, deleteDocument } = useAppStore();
  const docs = documents.filter((d) => !d.scelle);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", type: "PDF", folderId: "none", taille: "" });
  const [search, setSearch] = useState("");

  const resetForm = () => { setForm({ nom: "", type: "PDF", folderId: "none", taille: "" }); setEditId(null); };

  const handleSave = () => {
    if (!form.nom.trim()) return;
    const folderId = form.folderId === "none" ? null : Number(form.folderId);
    if (editId) {
      updateDocument(editId, { nom: form.nom, type: form.type, folderId, taille: form.taille });
      toast.success("Document modifié");
    } else {
      addDocument({ nom: form.nom, type: form.type, folderId, taille: form.taille || "100 Ko",
        date: new Date().toISOString().slice(0, 10), actif: true, scelle: false });
      toast.success("Document créé");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (row: any) => {
    setEditId(row.id);
    setForm({ nom: row.nom, type: row.type, folderId: row.folderId === null ? "none" : String(row.folderId), taille: row.taille });
    setOpen(true);
  };

  const handleDelete = (row: any) => { deleteDocument(row.id); toast.success("Document supprimé"); };
  const handleToggle = (row: any) => {
    updateDocument(row.id, { actif: !row.actif });
    toast.success(row.actif ? "Document désactivé" : "Document activé");
  };

  const folderName = (id: number | null) => folders.find(f => f.id === id)?.nom || "Racine";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter(d =>
      [d.nom, d.type, folderName(d.folderId), d.createdBy, d.updatedBy]
        .some(v => String(v ?? "").toLowerCase().includes(q))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, search, folders]);

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "type", label: "Type", render: (v: string) => <Badge variant="outline">{v}</Badge> },
    { key: "folderId", label: "Dossier", render: (v: number | null) => folderName(v) },
    { key: "taille", label: "Taille" },
    { key: "date", label: "Date" },
    { key: "actif", label: "Statut", render: (v: boolean) => (
      <Badge className={v ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>{v ? "Actif" : "Inactif"}</Badge>
    )},
    { key: "updatedBy", label: "Modifié par", render: (v: string) => <span className="text-xs text-muted-foreground">{v || "—"}</span> },
  ];

  return (
    <ModuleLayout title="Gestion documentaire" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Total documents" value={docs.length} icon={FileText} />
          <KpiCard title="Documents actifs" value={docs.filter(d => d.actif).length} icon={FileText} color="bg-success" />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Documents</h3>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "Modifier" : "Ajouter"} un document</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom du document" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.folderId} onValueChange={v => setForm({ ...form, folderId: v })}>
                  <SelectTrigger><SelectValue placeholder="Dossier de destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Racine</SelectItem>
                    {folders.map(f => <SelectItem key={f.id} value={String(f.id)}>{f.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Taille (ex: 1.2 Mo)" value={form.taille} onChange={e => setForm({ ...form, taille: e.target.value })} />
                <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">{editId ? "Modifier" : "Ajouter"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={columns} data={docs} onView={setDetail} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggle} />

        <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Détails du document</DialogTitle></DialogHeader>
            {detail && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-lg bg-destructive flex items-center justify-center">
                    <FileText className="w-7 h-7 text-destructive-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{detail.nom}</h3>
                    <Badge variant="outline" className="mt-1">{detail.type}</Badge>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><Folder className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Dossier:</span><span className="text-foreground font-medium">{folderName(detail.folderId)}</span></div>
                  <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Taille:</span><span className="text-foreground font-medium">{detail.taille}</span></div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Date:</span><span className="text-foreground font-medium">{detail.date}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default GEDGestion;
