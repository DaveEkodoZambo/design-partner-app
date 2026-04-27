import { useRef, useState } from "react";
import { UserPlus, FileText, Upload, X, CheckCircle2, FileUp, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/store";

const USERS = ["Jean Nguema", "Marie Mbarga", "Paul Fouda", "Sophie Atangana", "Admin CUY"];

export interface AssignFormState {
  user: string;
  comment: string;
  fileName: string;
}

interface AssignDialogProps {
  doc: Document | null;
  onClose: () => void;
  form: AssignFormState;
  setForm: (f: AssignFormState) => void;
  onSubmit: () => void;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
};

const AssignDialog = ({ doc, onClose, form, setForm, onSubmit }: AssignDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  if (!doc) return null;

  const currentVersion = doc.versions?.length ?? 1;
  const nextVersion = currentVersion + 1;

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setForm({ ...form, fileName: file.name });
  };

  const handleClear = () => {
    setUploadedFile(null);
    setForm({ ...form, fileName: doc.nom });
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = () => {
    onSubmit();
    setUploadedFile(null);
  };

  return (
    <Dialog open={!!doc} onOpenChange={(v) => { if (!v) { onClose(); setUploadedFile(null); } }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* ===== Header gradient ===== */}
        <div className="relative gradient-primary px-6 py-5 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white_0,transparent_50%)]" />
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center gap-3 text-primary-foreground">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold">Nouvelle assignation</p>
                <p className="text-xs font-normal text-primary-foreground/80">
                  Création de la version v{nextVersion}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* ===== Document concerné ===== */}
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-foreground">{doc.nom}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className="text-[10px] py-0 h-4">{doc.type}</Badge>
                <span className="text-[11px] text-muted-foreground">Actuelle : v{currentVersion}</span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
          </div>

          {/* ===== Utilisateur ===== */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">Assigner à</label>
            <Select value={form.user} onValueChange={(v) => setForm({ ...form, user: v })}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Sélectionnez un utilisateur" /></SelectTrigger>
              <SelectContent>
                {USERS.map((u) => (
                  <SelectItem key={u} value={u}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {u.split(" ").map(p => p[0]).slice(0, 2).join("")}
                      </div>
                      {u}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ===== Commentaire ===== */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">Commentaire</label>
            <Textarea
              placeholder="Précisez le motif de l'assignation..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* ===== Fichier (upload) ===== */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Document</label>
              <span className="text-[10px] text-muted-foreground">Optionnel · par défaut le document actuel</span>
            </div>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {uploadedFile ? (
              <div className="rounded-xl border-2 border-success/40 bg-success/5 p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1">
                <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{uploadedFile.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatSize(uploadedFile.size)} · prêt à envoyer</p>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0" onClick={handleClear}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className={`w-full rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 transition-all ${
                  dragOver
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Choisir un fichier</p>
                <p className="text-[11px] text-muted-foreground">ou glissez-déposez ici · PDF, DOCX, XLSX, images</p>
              </button>
            )}

            {!uploadedFile && (
              <p className="text-[10px] text-muted-foreground italic pt-1">
                Si aucun fichier n'est choisi, la version utilisera <span className="font-semibold text-foreground">{doc.nom}</span>.
              </p>
            )}
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => { onClose(); setUploadedFile(null); }}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground gap-2 flex-1 max-w-[260px]">
            <Upload className="w-4 h-4" /> Créer la version v{nextVersion}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDialog;
