import { useState } from "react";
import { Search, FileText, File } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { id: "recherche", label: "Recherche archives", icon: Search, path: "/sae/recherche" },
];

const archives = [
  { nom: "Rapport Q1 2026.pdf", categorie: "Rapports financiers", date: "2026-04-10", hash: "a3f2...b8c1" },
  { nom: "Note 042.docx", categorie: "Notes de service", date: "2026-04-12", hash: "d7e1...4f2a" },
  { nom: "Courrier 001.pdf", categorie: "Courriers officiels", date: "2026-03-15", hash: "f1b9...c3d7" },
];

const SAERecherche = () => {
  const [search, setSearch] = useState("");
  const filtered = archives.filter(a => a.nom.toLowerCase().includes(search.toLowerCase()) || a.categorie.toLowerCase().includes(search.toLowerCase()));

  return (
    <ModuleLayout title="Recherche archives" sidebarItems={sidebarItems} backPath="/sae">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les archives..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="grid gap-3">
          {filtered.map((doc, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                {doc.nom.endsWith(".pdf") ? <FileText className="w-5 h-5 text-destructive" /> : <File className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{doc.nom}</p>
                <p className="text-xs text-muted-foreground">{doc.categorie} • {doc.date}</p>
              </div>
              <Badge variant="outline" className="text-xs font-mono">{doc.hash}</Badge>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune archive trouvée</p>}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default SAERecherche;
