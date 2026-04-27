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
          onView={(row) => navigateTo(`/ged/gestion/document/${row.id}`)}
          extraActions={[
            { label: "Assigner à un utilisateur", icon: UserPlus, onClick: (row) => openAssign(row) },
          ]}
        />

        {/* ===================== Modal Assignation ===================== */}
        <Dialog open={!!assignDoc} onOpenChange={(v) => !v && setAssignDoc(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Assigner le document
              </DialogTitle>
            </DialogHeader>
            {assignDoc && (
              <div className="space-y-4 pt-2">
                <div className="rounded-lg bg-muted/60 border border-border p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-destructive/90 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-destructive-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{assignDoc.nom}</p>
                    <p className="text-xs text-muted-foreground">Version actuelle : v{assignDoc.versions?.length ?? 1}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Utilisateur</label>
                  <Select value={assignForm.user} onValueChange={v => setAssignForm({ ...assignForm, user: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionnez un utilisateur" /></SelectTrigger>
                    <SelectContent>
                      {USERS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Commentaire</label>
                  <Textarea
                    placeholder="Précisez le motif de l'assignation..."
                    value={assignForm.comment}
                    onChange={e => setAssignForm({ ...assignForm, comment: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Document <span className="text-muted-foreground font-normal">(optionnel — par défaut le document actuel)</span>
                  </label>
                  <Input
                    value={assignForm.fileName}
                    onChange={e => setAssignForm({ ...assignForm, fileName: e.target.value })}
                  />
                </div>

                <Button onClick={submitAssign} className="w-full gradient-primary text-primary-foreground gap-2">
                  <UserPlus className="w-4 h-4" /> Assigner et créer une version
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ===================== Modal Détails (avec timeline versions) ===================== */}
        <Dialog open={!!detailDoc} onOpenChange={(v) => !v && setDetailId(null)}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            {detailDoc && (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] max-h-[85vh]">
                {/* ======== Colonne gauche : infos + aperçu ======== */}
                <div className="p-6 overflow-y-auto space-y-5 border-r border-border">
                  <DialogHeader className="text-left">
                    <DialogTitle className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-destructive flex items-center justify-center">
                        <FileText className="w-6 h-6 text-destructive-foreground" />
                      </div>
                      <div>
                        <p className="text-base font-bold">{detailDoc.nom}</p>
                        <p className="text-xs font-normal text-muted-foreground">Suivi complet du document</p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  {/* KPIs versions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <History className="w-3.5 h-3.5" /> Total versions
                      </div>
                      <p className="text-2xl font-bold text-foreground mt-1">{detailDoc.versions?.length ?? 0}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <FileCheck2 className="w-3.5 h-3.5" /> Statut courant
                      </div>
                      <p className="text-sm font-bold text-foreground mt-1.5">
                        {detailDoc.versions?.[detailDoc.versions.length - 1]?.status ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2"><Folder className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Dossier:</span><span className="font-medium">{folderName(detailDoc.folderId)}</span></div>
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Type:</span><span className="font-medium">{detailDoc.type}</span></div>
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Taille:</span><span className="font-medium">{detailDoc.taille}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Créé le:</span><span className="font-medium">{detailDoc.date}</span></div>
                    <div className="flex items-center gap-2"><UserCog className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Expéditeur:</span><span className="font-medium">{detailDoc.createdBy || "—"}</span></div>
                    <div className="flex items-center gap-2"><UserCog className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Dernière action:</span><span className="font-medium">{detailDoc.updatedBy || "—"}</span></div>
                  </div>

                  {/* Aperçu */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" /> Aperçu
                        {previewEntry && (
                          <Badge variant="outline" className="text-[10px] ml-1">
                            v{previewEntry.version}
                          </Badge>
                        )}
                      </h4>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("Téléchargement démarré", { description: previewEntry?.fileName || detailDoc.nom })}>
                        <Download className="w-3.5 h-3.5" /> Télécharger
                      </Button>
                    </div>
                    <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-border bg-gradient-to-br from-muted/30 to-muted/60 flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <FileText className="w-12 h-12 opacity-50" />
                      <p className="text-xs font-medium">{previewEntry?.fileName || detailDoc.nom}</p>
                      <p className="text-[10px]">Aperçu du document</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => { setAssignDoc(detailDoc); setAssignForm({ user: "", comment: "", fileName: detailDoc.nom }); }} className="flex-1 gradient-primary text-primary-foreground gap-2">
                      <UserPlus className="w-4 h-4" /> Assigner à un utilisateur
                    </Button>
                  </div>
                </div>

                {/* ======== Colonne droite : timeline versions ======== */}
                <div className="bg-muted/30 flex flex-col">
                  <div className="px-5 py-4 border-b border-border bg-card/50">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" /> Historique des versions
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {detailDoc.versions?.length ?? 0} version(s) · cliquez pour prévisualiser
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <div className="relative pl-6">
                      {/* Ligne verticale */}
                      <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />

                      {(detailDoc.versions ?? []).slice().reverse().map((v) => {
                        const isActive = v.version === previewVersion;
                        const isLatest = v.version === (detailDoc.versions?.length ?? 0);
                        return (
                          <button
                            key={v.version}
                            onClick={() => setPreviewVersion(v.version)}
                            className={`relative w-full text-left mb-3 rounded-lg border p-3 transition-all ${
                              isActive
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-card hover:border-primary/40 hover:bg-card"
                            }`}
                          >
                            {/* Pastille */}
                            <span className={`absolute -left-[18px] top-3.5 w-3 h-3 rounded-full ring-4 ring-muted/30 ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`} />
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <Badge className={isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>
                                v{v.version}
                              </Badge>
                              {isLatest && (
                                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
                                  Actuelle
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                              <UserCog className="w-3 h-3" /> {v.assignedTo}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" /> {formatDateTime(v.date)}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Assigné par <span className="font-medium text-foreground">{v.assignedBy}</span>
                            </div>
                            {v.comment && (
                              <div className="mt-2 flex items-start gap-1.5 text-[11px] text-foreground/80 bg-muted/50 rounded px-2 py-1.5 border-l-2 border-primary/40">
                                <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                                <span className="leading-snug">{v.comment}</span>
                              </div>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground truncate">{v.fileName}</span>
                              <ChevronRight className={`w-3 h-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                          </button>
                        );
                      })}

                      {(!detailDoc.versions || detailDoc.versions.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-6">Aucune version enregistrée.</p>
                      )}
                    </div>
                  </div>
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
