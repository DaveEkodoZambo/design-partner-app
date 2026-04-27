import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Settings, FileText, Calendar, Folder, UserCog, UserPlus, History,
  Download, Eye, Sparkles, Clock, MessageSquare, FileCheck2,
  Hash, ShieldCheck, ArrowUpRight,
} from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import AssignDialog from "@/components/AssignDialog";

const sidebarItems = [{ id: "gestion", label: "Gestion documentaire", icon: Settings, path: "/ged/gestion" }];

const USERS = ["Jean Nguema", "Marie Mbarga", "Paul Fouda", "Sophie Atangana", "Admin CUY"];

const formatDateTime = (iso: string) => {
  try { return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso; }
};

const GEDDocumentDetail = () => {
  const { id } = useParams();
  const docId = Number(id);
  const { documents, folders, assignDocument, acknowledgeNewVersion } = useAppStore();
  const detailDoc = useMemo(() => documents.find(d => d.id === docId) || null, [documents, docId]);

  const [previewVersion, setPreviewVersion] = useState<number | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ user: "", comment: "", fileName: "" });

  useEffect(() => {
    if (detailDoc?.hasNewVersion) acknowledgeNewVersion(detailDoc.id);
    if (detailDoc) {
      const last = detailDoc.versions?.[detailDoc.versions.length - 1];
      setPreviewVersion(last?.version ?? null);
      setAssignForm(f => ({ ...f, fileName: detailDoc.nom }));
    }
  }, [detailDoc, acknowledgeNewVersion]);

  if (!detailDoc) {
    return (
      <ModuleLayout title="Document introuvable" sidebarItems={sidebarItems} backPath="/ged/gestion">
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          Ce document n'existe pas ou a été supprimé.
        </div>
      </ModuleLayout>
    );
  }

  const folderName = (fid: number | null) => folders.find(f => f.id === fid)?.nom || "Racine";
  const versions = detailDoc.versions ?? [];
  const previewEntry = versions.find(v => v.version === previewVersion) || versions[versions.length - 1] || null;
  const latestVersion = versions[versions.length - 1];

  const submitAssign = () => {
    if (!assignForm.user) { toast.error("Sélectionnez un utilisateur"); return; }
    assignDocument(detailDoc.id, assignForm.user, assignForm.comment, assignForm.fileName || detailDoc.nom);
    toast.success("Document assigné", { description: `Nouvelle version créée pour ${assignForm.user}` });
    setAssignOpen(false);
    setAssignForm({ user: "", comment: "", fileName: detailDoc.nom });
  };

  return (
    <ModuleLayout title="Détails du document" sidebarItems={sidebarItems} backPath="/ged/gestion">
      <div className="space-y-6">
        {/* ============ HERO ============ */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/40 shadow-sm">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary))_0,transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--primary))_0,transparent_50%)]" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
              <FileText className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="font-semibold">{detailDoc.type}</Badge>
                <Badge className="bg-primary/15 text-primary border border-primary/30">
                  v{latestVersion?.version ?? 1} · {versions.length} version(s)
                </Badge>
                {detailDoc.hasNewVersion && (
                  <Badge className="bg-success text-success-foreground gap-1">
                    <Sparkles className="w-3 h-3" /> Nouvelle version
                  </Badge>
                )}
                {detailDoc.scelle && (
                  <Badge className="bg-foreground text-background gap-1">
                    <ShieldCheck className="w-3 h-3" /> Scellé
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">{detailDoc.nom}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Dossier <span className="font-medium text-foreground">{folderName(detailDoc.folderId)}</span> · Créé le {detailDoc.date}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2" onClick={() => toast.success("Téléchargement démarré", { description: previewEntry?.fileName || detailDoc.nom })}>
                <Download className="w-4 h-4" /> Télécharger
              </Button>
              <Button onClick={() => setAssignOpen(true)} className="gradient-primary text-primary-foreground gap-2">
                <UserPlus className="w-4 h-4" /> Assigner
              </Button>
            </div>
          </div>
        </div>

        {/* ============ KPIs ============ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Versions", value: versions.length, icon: History },
            { label: "Statut courant", value: latestVersion?.status ?? "—", icon: FileCheck2 },
            { label: "Dernier intervenant", value: detailDoc.updatedBy || "—", icon: UserCog },
            { label: "Taille", value: detailDoc.taille, icon: FileText },
          ].map((k, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <k.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-lg font-bold text-foreground truncate">{k.value}</p>
            </div>
          ))}
        </div>

        {/* ============ MAIN GRID ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ===== Colonne gauche : aperçu + métadonnées ===== */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" /> Aperçu du document
                  {previewEntry && <Badge variant="outline" className="text-[10px]">v{previewEntry.version}</Badge>}
                </h3>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Téléchargement démarré", { description: previewEntry?.fileName })}>
                  <Download className="w-3.5 h-3.5" /> Cette version
                </Button>
              </div>
              <div className="p-6">
                <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-border bg-gradient-to-br from-muted/20 via-muted/40 to-muted/60 flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <FileText className="w-10 h-10 text-primary/70" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{previewEntry?.fileName || detailDoc.nom}</p>
                  <p className="text-xs">Aperçu non disponible · {detailDoc.type}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="px-5 py-3.5 border-b border-border bg-muted/30">
                <h3 className="text-sm font-bold text-foreground">Informations</h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Folder, label: "Dossier", value: folderName(detailDoc.folderId) },
                  { icon: FileText, label: "Type", value: detailDoc.type },
                  { icon: FileText, label: "Taille", value: detailDoc.taille },
                  { icon: Calendar, label: "Date de création", value: detailDoc.date },
                  { icon: UserCog, label: "Créé par", value: detailDoc.createdBy || "—" },
                  { icon: UserCog, label: "Dernière action", value: detailDoc.updatedBy || "—" },
                  ...(detailDoc.hash ? [{ icon: Hash, label: "Empreinte", value: detailDoc.hash }] : []),
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center border border-border shrink-0">
                      <m.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{m.label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Colonne droite : timeline ===== */}
          <div className="rounded-xl border border-border bg-card flex flex-col max-h-[800px]">
            <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Historique des versions
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {versions.length} version(s) · cliquez pour prévisualiser
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-border" />

                {versions.slice().reverse().map((v) => {
                  const isActive = v.version === previewVersion;
                  const isLatest = v.version === (versions.length);
                  return (
                    <div
                      key={v.version}
                      className={`relative mb-3 rounded-xl border p-3.5 transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                      }`}
                    >
                      <span className={`absolute -left-[18px] top-4 w-3.5 h-3.5 rounded-full ring-4 ring-card ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <button
                        onClick={() => setPreviewVersion(v.version)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge className={isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>
                            v{v.version}
                          </Badge>
                          {isLatest && (
                            <Badge variant="outline" className="text-[9px] border-primary/40 text-primary gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Actuelle
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <UserCog className="w-3.5 h-3.5 text-primary" /> {v.assignedTo}
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
                      </button>
                      <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-muted-foreground truncate flex-1">{v.fileName}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 gap-1 text-[10px] shrink-0 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Téléchargement démarré", { description: `${v.fileName} (v${v.version})` });
                          }}
                        >
                          <Download className="w-3 h-3" /> Télécharger
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {versions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Aucune version enregistrée.</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20">
              <Button onClick={() => setAssignOpen(true)} className="w-full gradient-primary text-primary-foreground gap-2">
                <ArrowUpRight className="w-4 h-4" /> Créer une nouvelle version
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal Assignation ===== */}
      <AssignDialog
        doc={assignOpen ? detailDoc : null}
        onClose={() => setAssignOpen(false)}
        form={assignForm}
        setForm={setAssignForm}
        onSubmit={submitAssign}
      />
    </ModuleLayout>
  );
};

export default GEDDocumentDetail;
