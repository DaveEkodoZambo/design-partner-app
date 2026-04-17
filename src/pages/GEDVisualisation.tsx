import { useState } from "react";
import { Eye, FileText, File, Lock, Search, Download } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const sidebarItems = [{ id: "visu", label: "Visualisation", icon: Eye, path: "/ged/visualisation" }];

const GEDVisualisation = () => {
  const { documents, sealDocument } = useAppStore();
  const docs = documents.filter((d) => !d.scelle && d.actif);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [confirmSeal, setConfirmSeal] = useState<any>(null);

  const filtered = docs.filter(d => d.nom.toLowerCase().includes(search.toLowerCase()));

  const handleSeal = () => {
    if (confirmSeal) {
      sealDocument(confirmSeal.id);
      toast.success("Document scellé en archive", { description: "Transféré vers la SAE — désormais inaltérable." });
      setConfirmSeal(null);
      setPreview(null);
    }
  };

  return (
    <ModuleLayout title="Visualisation" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un document..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  {d.type === "PDF" ? <FileText className="w-6 h-6 text-destructive" /> : <File className="w-6 h-6 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{d.nom}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.type} • {d.taille}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] mb-3">{d.date}</Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => setPreview(d)}>
                  <Eye className="w-3.5 h-3.5" /> Aperçu
                </Button>
                <Button size="sm" className="flex-1 gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => setConfirmSeal(d)}>
                  <Lock className="w-3.5 h-3.5" /> Sceller
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12 text-sm">Aucun document à visualiser</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Aperçu — {preview?.nom}</DialogTitle></DialogHeader>
          <div className="bg-muted rounded-lg p-12 min-h-[500px] flex flex-col items-center justify-center">
            <FileText className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Aperçu du document. Le contenu réel s'afficherait ici via un lecteur intégré.
            </p>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="gap-2" onClick={() => toast.success("Téléchargement démarré")}>
                <Download className="w-4 h-4" /> Télécharger
              </Button>
              <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => { setConfirmSeal(preview); }}>
                <Lock className="w-4 h-4" /> Sceller en archive
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm seal */}
      <Dialog open={!!confirmSeal} onOpenChange={(v) => !v && setConfirmSeal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Sceller en archive ?</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-accent rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{confirmSeal?.nom}</p>
                <p className="text-muted-foreground mt-1">Une fois scellé, ce document sera transféré dans le module SAE et deviendra impossible à modifier ou supprimer.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmSeal(null)}>Annuler</Button>
              <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2" onClick={handleSeal}>
                <Lock className="w-4 h-4" /> Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
};

export default GEDVisualisation;
