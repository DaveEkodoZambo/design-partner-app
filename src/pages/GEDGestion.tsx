import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings, Plus, FileText, Folder, UserPlus, History, Sparkles, Bell,
} from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import TableToolbar from "@/components/TableToolbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore, type Document } from "@/lib/store";
import { toast } from "sonner";
import { usePageTransition } from "@/hooks/usePageTransition";
import LoadingScreen from "@/components/LoadingScreen";
import AssignDialog from "@/components/AssignDialog";

const sidebarItems = [{ id: "gestion", label: "Gestion documentaire", icon: Settings, path: "/ged/gestion" }];

// Liste démo d'utilisateurs (synchronisée plus tard avec un vrai backend)
const USERS = ["Jean Nguema", "Marie Mbarga", "Paul Fouda", "Sophie Atangana", "Admin CUY"];

const formatDateTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
};

const GEDGestion = () => {
  const { documents, folders, addDocument, updateDocument, deleteDocument, assignDocument } = useAppStore();
  const { loading, navigateTo } = usePageTransition();

  const docs = useMemo(() => documents.filter((d) => !d.scelle), [documents]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: "", type: "PDF", folderId: "none", taille: "" });
  const [search, setSearch] = useState("");

  // Assignation
  const [assignDoc, setAssignDoc] = useState<Document | null>(null);
  const [assignForm, setAssignForm] = useState({ user: "", comment: "", fileName: "" });

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

  const openAssign = (row: Document) => {
    setAssignDoc(row);
    setAssignForm({ user: "", comment: "", fileName: row.nom });
  };

  const submitAssign = () => {
    if (!assignDoc) return;
    if (!assignForm.user) { toast.error("Sélectionnez un utilisateur"); return; }
    assignDocument(assignDoc.id, assignForm.user, assignForm.comment, assignForm.fileName || assignDoc.nom);
    toast.success("Document assigné", { description: `Nouvelle version créée pour ${assignForm.user}` });
    setAssignDoc(null);
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

  const totalNewVersions = docs.filter(d => d.hasNewVersion).length;

  const columns = [
    {
      key: "nom", label: "Nom",
      render: (v: string, row: Document) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{v}</span>
          {row.hasNewVersion && (
            <Badge className="bg-primary/15 text-primary border border-primary/30 gap-1 text-[10px] px-1.5 py-0">
              <Sparkles className="w-3 h-3" /> Nouvelle version
            </Badge>
          )}
        </div>
      ),
    },
    { key: "type", label: "Type", render: (v: string) => <Badge variant="outline">{v}</Badge> },
    { key: "folderId", label: "Dossier", render: (v: number | null) => folderName(v) },
    {
      key: "versions", label: "Versions",
      render: (_: any, row: Document) => (
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold">{row.versions?.length ?? 0}</span>
        </div>
      ),
    },
    { key: "date", label: "Date" },
    { key: "updatedBy", label: "Dernier intervenant", render: (v: string) => <span className="text-xs text-muted-foreground">{v || "—"}</span> },
  ];

  return (
    <>
    <LoadingScreen show={loading} />
    <ModuleLayout title="Gestion documentaire" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard title="Total documents" value={docs.length} icon={FileText} />
          <KpiCard title="Documents actifs" value={docs.filter(d => d.actif).length} icon={FileText} color="bg-success" />
          <KpiCard title="Nouvelles versions" value={totalNewVersions} icon={Bell} color={totalNewVersions ? "bg-primary" : "bg-muted"} />
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

        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher un document (nom, type, dossier)..."
          exportData={filtered}
          exportFileName="documents"
          exportSheetName="Documents"
          exportMapper={(d) => ({
            Nom: d.nom, Type: d.type, Dossier: folderName(d.folderId),
            Taille: d.taille, Date: d.date, "Nb versions": d.versions?.length ?? 0,
            "Créé par": d.createdBy || "", "Modifié par": d.updatedBy || "",
          })}
        />

        <DataTable
          columns={columns}
          data={filtered}
          actionsAsMenu
          onRowClick={(row) => navigateTo(`/ged/gestion/document/${row.id}`)}
          onView={(row) => navigateTo(`/ged/gestion/document/${row.id}`)}
          extraActions={[
            { label: "Assigner à un utilisateur", icon: UserPlus, onClick: (row) => openAssign(row) },
          ]}
        />

        {/* ===================== Modal Assignation ===================== */}
        <AssignDialog
          doc={assignDoc}
          onClose={() => setAssignDoc(null)}
          form={assignForm}
          setForm={setAssignForm}
          onSubmit={submitAssign}
        />

      </div>
    </ModuleLayout>
    </>
  );
};

export default GEDGestion;
