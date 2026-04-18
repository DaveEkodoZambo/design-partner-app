import { useParams } from "react-router-dom";
import { ArrowLeft, Download, Eye, UserPlus, Mail, Calendar, Tag, Hash, FileText, AlertCircle, User, MessageSquare, UserCog } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { usePageTransition } from "@/hooks/usePageTransition";
import LoadingScreen from "@/components/LoadingScreen";
import logoCuy from "@/assets/logoCuy.png";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CourrierDetail = () => {
  const { id } = useParams();
  const courrier = useAppStore((s) => s.courriers.find((c) => c.id === Number(id)));
  const updateCourrier = useAppStore((s) => s.updateCourrier);
  const { loading, goBack, navigateTo } = usePageTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignee, setAssignee] = useState(courrier?.assignedTo || "");
  const [comment, setComment] = useState(courrier?.assignmentComment || "");

  if (!courrier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Courrier introuvable</p>
          <Button onClick={goBack} variant="outline">Retour</Button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success("Téléchargement démarré", { description: courrier.fichier?.nom || "document.pdf" });
  };

  const handleAssign = () => {
    if (assignee) {
      updateCourrier(courrier.id, { assignedTo: assignee, assignmentComment: comment });
      toast.success("Courrier assigné", { description: `Assigné à ${assignee}` });
      setAssignOpen(false);
    }
  };

  const handleMarkAsRead = () => {
    if (courrier.statut === "Non lu") {
      updateCourrier(courrier.id, { statut: "Traité" });
      toast.success("Marqué comme traité");
    }
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen bg-muted">
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-9 h-9" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img src={logoCuy} alt="CUY" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-sm font-bold text-foreground">Détails du courrier</h1>
                <p className="text-[11px] text-muted-foreground">Référence {courrier.reference || `#${courrier.id}`}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)} className="gap-2">
                <UserPlus className="w-3.5 h-3.5" /> Assigner
              </Button>
              <Button size="sm" onClick={handleDownload} className="gap-2 gradient-primary text-primary-foreground">
                <Download className="w-3.5 h-3.5" /> Télécharger
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main details */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <Badge className={courrier.type === "reception" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                      {courrier.type === "reception" ? "Courrier entrant" : "Courrier sortant"}
                    </Badge>
                    <Badge variant="outline" className={courrier.priorite === "HAUTE" ? "border-destructive text-destructive" : ""}>
                      Priorité {courrier.priorite.toLowerCase()}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-foreground leading-tight">{courrier.objet}</h2>
                </div>
                <div className="p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contenu</h3>
                  <p className="text-sm text-foreground leading-relaxed">{courrier.contenu || "Aucun contenu textuel disponible. Consultez le document joint pour plus d'informations."}</p>
                </div>
              </div>

              {/* File preview */}
              {courrier.fichier && (
                <div className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pièce jointe</h3>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-destructive flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-destructive-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{courrier.fichier.nom}</p>
                      <p className="text-xs text-muted-foreground">{courrier.fichier.type} • {courrier.fichier.taille}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)} className="gap-2">
                      <Eye className="w-3.5 h-3.5" /> Aperçu
                    </Button>
                    <Button size="sm" onClick={handleDownload} className="gap-2 gradient-primary text-primary-foreground">
                      <Download className="w-3.5 h-3.5" /> Télécharger
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-5">
              <div className="bg-card rounded-xl border border-border shadow-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Informations</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{courrier.type === "reception" ? "Expéditeur" : "Destinataire"}</p>
                      <p className="font-medium text-foreground mt-0.5">{courrier.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground mt-0.5">{courrier.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Référence</p>
                      <p className="font-medium text-foreground mt-0.5">{courrier.reference || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <Badge className={`mt-1 ${courrier.statut === "Non lu" ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}`}>{courrier.statut}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Priorité</p>
                      <p className="font-medium text-foreground mt-0.5">{courrier.priorite}</p>
                    </div>
                  </div>
                  {courrier.assignedTo && (
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigné à</p>
                        <p className="font-medium text-foreground mt-0.5">{courrier.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {courrier.statut === "Non lu" && (
                <Button onClick={handleMarkAsRead} className="w-full gradient-primary text-primary-foreground">
                  Marquer comme traité
                </Button>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Aperçu — {courrier.fichier?.nom}</DialogTitle></DialogHeader>
          <div className="bg-muted rounded-lg p-12 min-h-[500px] flex flex-col items-center justify-center">
            <FileText className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Aperçu du document. Dans un environnement de production, le contenu PDF/DOCX serait affiché ici via un lecteur intégré.
            </p>
            <Button onClick={handleDownload} className="mt-6 gap-2 gradient-primary text-primary-foreground">
              <Download className="w-4 h-4" /> Télécharger le document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assigner ce courrier</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger><SelectValue placeholder="Choisir un utilisateur" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Jean Nguema">Jean Nguema (Maire)</SelectItem>
                <SelectItem value="Marie Mbarga">Marie Mbarga (SG)</SelectItem>
                <SelectItem value="Paul Fouda">Paul Fouda (Directeur)</SelectItem>
                <SelectItem value="Sophie Atangana">Sophie Atangana (Agent)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAssign} className="w-full gradient-primary text-primary-foreground">Assigner</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourrierDetail;
