import { useState } from "react";
import { FolderTree, FolderPlus, ChevronRight, Folder } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const sidebarItems = [
  { id: "arbo", label: "Arborescence", icon: FolderTree, path: "/ged/arborescence" },
];

const initialFolders = [
  { id: 1, nom: "Courriers 2026", parent: null, children: [
    { id: 2, nom: "Entrants", parent: 1, children: [] },
    { id: 3, nom: "Sortants", parent: 1, children: [] },
  ]},
  { id: 4, nom: "Notes de service", parent: null, children: [] },
  { id: 5, nom: "Rapports", parent: null, children: [
    { id: 6, nom: "Rapports Q1", parent: 5, children: [] },
  ]},
];

const FolderItem = ({ folder, level = 0 }: { folder: any; level?: number }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = folder.children?.length > 0;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {hasChildren && <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />}
        {!hasChildren && <span className="w-4" />}
        <Folder className="w-4 h-4 text-primary" />
        <span className="text-foreground">{folder.nom}</span>
      </button>
      {open && folder.children?.map((child: any) => (
        <FolderItem key={child.id} folder={child} level={level + 1} />
      ))}
    </div>
  );
};

const GEDArborescence = () => {
  const [newFolder, setNewFolder] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ModuleLayout title="Arborescence" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground">Structure des dossiers</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><FolderPlus className="w-4 h-4" /> Nouveau dossier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Créer un dossier</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Nom du dossier" value={newFolder} onChange={e => setNewFolder(e.target.value)} />
                <Button onClick={() => setDialogOpen(false)} className="w-full gradient-primary text-primary-foreground">Créer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          {initialFolders.map(folder => (
            <FolderItem key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default GEDArborescence;
