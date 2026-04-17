import { useState } from "react";
import { Archive, Search, FileText, File, Lock, Eye, Download, Calendar, Hash, Tag } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const sidebarItems = [{ id: "archives", label: "Archives", icon: Archive, path: "/sae" }];

const SAE = () => {
  const archives = useAppStore((s) => s.documents.filter((d) => d.scelle));
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<any>(null);

  const filtered = archives.filter(a =>
    a.nom.toLowerCase().includes(search.toLowerCase()) ||
    (a.categorie || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.hash || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalSize = archives.reduce((acc) => acc + 1, 0); // placeholder
  const categories = new Set(archives.map(a => a.categorie).filter(Boolean)).size;

  return (
    <ModuleLayout title="Système d'Archivage Électronique" sidebarItems={sidebarItems} backPath="/dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Archives scellées</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Documents à valeur probante — inaltérables et tracés</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard title="Total archives" value={archives.length} icon={Archive} color="bg-primary" />
          <KpiCard title="Catégories" value={categories} icon={Tag} color="bg-secondary" />
          <KpiCard title="Documents scellés" value={totalSize} icon={Lock} color="bg-success" />
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher (nom, catégorie, empreinte)..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <DataTable
          actionsAsMenu
          columns={[
            { key: "nom", label: "Document", render: (v: string, row: any) => (
              <div className="flex items-center gap-2">
                {row.type === "PDF" ? <FileText className="w-4 h-4 text-destructive" /> : <File className="w-4 h-4 text-primary" />}
                <span className="font-medium">{v}</span>
              </div>
            )},
            { key: "categorie", label: "Catégorie", render: (v: string) => <Badge variant="outline">{v || "—"}</Badge> },
            { key: "date", label: "Date d'archivage" },
            { key: "hash", label: "Empreinte", render: (v: string) => <code className="text-[11px] font-mono text-muted-foreground">{v?.slice(0, 12)}…</code> },
            { key: "scelle", label: "Statut", render: () => <Badge className="bg-success text-success-foreground gap-1"><Lock className="w-3 h-3" /> Scellé</Badge> },
          ]}
          data={filtered}
          onView={setDetail}
          extraActions={[
            { label: "Télécharger", icon: Download, onClick: () => toast.success("Téléchargement démarré") },
          ]}
        />

        <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Détails de l'archive</DialogTitle></DialogHeader>
            {detail && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                    <Archive className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{detail.nom}</h3>
                    <Badge className="bg-success text-success-foreground mt-1 gap-1"><Lock className="w-3 h-3" /> Scellé</Badge>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Catégorie:</span><span className="text-foreground font-medium">{detail.categorie || "—"}</span></div>
                  <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Type:</span><span className="text-foreground font-medium">{detail.type} ({detail.taille})</span></div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Archivé le:</span><span className="text-foreground font-medium">{detail.date}</span></div>
                  <div className="flex items-start gap-3"><Hash className="w-4 h-4 text-muted-foreground mt-0.5" /><div><p className="text-muted-foreground">Empreinte SHA</p><code className="text-[11px] font-mono text-foreground block mt-0.5 break-all">{detail.hash}</code></div></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => toast.success("Aperçu")}>
                    <Eye className="w-4 h-4" /> Aperçu
                  </Button>
                  <Button className="flex-1 gap-2 gradient-primary text-primary-foreground" onClick={() => toast.success("Téléchargement démarré")}>
                    <Download className="w-4 h-4" /> Télécharger
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default SAE;
