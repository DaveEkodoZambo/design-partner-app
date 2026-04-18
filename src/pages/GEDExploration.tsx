import { useState } from "react";
import { Search, Folder, ChevronRight, FileText, File, ArrowLeft, Home } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import TableToolbar from "@/components/TableToolbar";
import { Button } from "@/components/ui/button";
import { useAppStore, FolderNode } from "@/lib/store";

const sidebarItems = [{ id: "explore", label: "Exploration", icon: Search, path: "/ged/exploration" }];

const GEDExploration = () => {
  const { folders, documents } = useAppStore();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const currentFolder = folders.find((f) => f.id === currentFolderId);
  const subfolders = folders.filter((f) => f.parentId === currentFolderId);
  const filesInFolder = documents.filter((d) => d.folderId === currentFolderId && d.actif && !d.scelle);

  // Build breadcrumb
  const breadcrumb: FolderNode[] = [];
  let cursor: FolderNode | undefined = currentFolder;
  while (cursor) {
    breadcrumb.unshift(cursor);
    cursor = folders.find((f) => f.id === cursor!.parentId);
  }

  const filtered = search
    ? {
        folders: subfolders.filter((f) => f.nom.toLowerCase().includes(search.toLowerCase())),
        files: filesInFolder.filter((d) => d.nom.toLowerCase().includes(search.toLowerCase())),
      }
    : { folders: subfolders, files: filesInFolder };

  return (
    <ModuleLayout title="Exploration" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-5">
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher dans ce dossier..."
          exportData={[
            ...filtered.folders.map(f => ({ Type: "Dossier", Nom: f.nom, Taille: "", Date: "", "Créé par": f.createdBy || "", "Modifié par": f.updatedBy || "" })),
            ...filtered.files.map(d => ({ Type: d.type, Nom: d.nom, Taille: d.taille, Date: d.date, "Créé par": d.createdBy || "", "Modifié par": d.updatedBy || "" })),
          ]}
          exportFileName={`exploration_${currentFolder?.nom?.replace(/\s+/g, "_") || "racine"}`}
          exportSheetName="Exploration"
        />

        {/* Breadcrumb */}
        <div className="bg-card rounded-xl border border-border shadow-card p-3 flex items-center gap-1 flex-wrap text-sm">
          {currentFolderId !== null && (
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => {
              const parentId = currentFolder?.parentId ?? null;
              setCurrentFolderId(parentId);
            }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <button onClick={() => setCurrentFolderId(null)} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted text-foreground">
            <Home className="w-3.5 h-3.5" /> Racine
          </button>
          {breadcrumb.map((f) => (
            <div key={f.id} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <button onClick={() => setCurrentFolderId(f.id)} className="px-2 py-1 rounded hover:bg-muted text-foreground font-medium">
                {f.nom}
              </button>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4">
          {filtered.folders.length === 0 && filtered.files.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Ce dossier est vide</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.folders.map((f) => (
                <button key={`folder-${f.id}`} onClick={() => { setCurrentFolderId(f.id); setSearch(""); }}
                  className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <Folder className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" fill="currentColor" fillOpacity={0.1} />
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">{f.nom}</span>
                </button>
              ))}
              {filtered.files.map((d) => (
                <div key={`file-${d.id}`} className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border cursor-pointer">
                  {d.type === "PDF" ? <FileText className="w-12 h-12 text-destructive" /> : <File className="w-12 h-12 text-primary" />}
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">{d.nom}</span>
                  <span className="text-[10px] text-muted-foreground">{d.taille}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default GEDExploration;
