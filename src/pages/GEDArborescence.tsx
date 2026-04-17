import { useState } from "react";
import { FolderTree, FolderPlus, ChevronRight, Folder, Pencil, Trash2 } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore, FolderNode } from "@/lib/store";
import { toast } from "sonner";

const sidebarItems = [{ id: "arbo", label: "Arborescence", icon: FolderTree, path: "/ged/arborescence" }];

interface FolderItemProps {
  folder: FolderNode;
  level: number;
  allFolders: FolderNode[];
  onEdit: (f: FolderNode) => void;
  onDelete: (f: FolderNode) => void;
}

const FolderItem = ({ folder, level, allFolders, onEdit, onDelete }: FolderItemProps) => {
  const [open, setOpen] = useState(level === 0);
  const children = allFolders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 flex-1 text-left">
          {hasChildren ? (
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
          ) : (
            <span className="w-4" />
          )}
          <Folder className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">{folder.nom}</span>
          {folder.description && <span className="text-xs text-muted-foreground hidden sm:inline">— {folder.description}</span>}
        </button>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => onEdit(folder)}>
            <Pencil className="w-3.5 h-3.5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => onDelete(folder)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      </div>
      {open && children.map((child) => (
        <FolderItem key={child.id} folder={child} level={level + 1} allFolders={allFolders} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

const GEDArborescence = () => {
  const { folders, addFolder, updateFolder, deleteFolder } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FolderNode | null>(null);
  const [form, setForm] = useState({ nom: "", parentId: "root", description: "" });
  const rootFolders = folders.filter((f) => f.parentId === null);

  const resetForm = () => { setForm({ nom: "", parentId: "root", description: "" }); setEditing(null); };

  const handleSave = () => {
    if (!form.nom.trim()) return;
    const parentId = form.parentId === "root" ? null : Number(form.parentId);
    if (editing) {
      updateFolder(editing.id, { nom: form.nom, parentId, description: form.description });
      toast.success("Dossier modifié");
    } else {
      addFolder({ nom: form.nom, parentId, description: form.description });
      toast.success("Dossier créé");
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (f: FolderNode) => {
    setEditing(f);
    setForm({ nom: f.nom, parentId: f.parentId === null ? "root" : String(f.parentId), description: f.description || "" });
    setOpen(true);
  };

  const handleDelete = (f: FolderNode) => {
    if (confirm(`Supprimer "${f.nom}" et tous ses sous-dossiers ?`)) {
      deleteFolder(f.id);
      toast.success("Dossier supprimé");
    }
  };

  return (
    <ModuleLayout title="Arborescence" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-foreground">Structure des dossiers</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Créez et organisez la hiérarchie documentaire</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><FolderPlus className="w-4 h-4" /> Nouveau dossier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Modifier" : "Créer"} un dossier</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom du dossier" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Emplacement" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">📁 Racine</SelectItem>
                    {folders.filter(f => f.id !== editing?.id).map(f => (
                      <SelectItem key={f.id} value={String(f.id)}>📁 {f.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Description (optionnel)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">{editing ? "Modifier" : "Créer"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border p-3 shadow-card">
          {rootFolders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucun dossier — créez le premier !</p>
          ) : (
            rootFolders.map(folder => (
              <FolderItem key={folder.id} folder={folder} level={0} allFolders={folders} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default GEDArborescence;
