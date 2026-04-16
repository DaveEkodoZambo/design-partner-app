import { Search, FileText, File } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const sidebarItems = [
  { id: "explore", label: "Exploration", icon: Search, path: "/ged/exploration" },
];

const allDocs = [
  { nom: "Rapport Q1 2026.pdf", type: "PDF", dossier: "Rapports/Q1", date: "2026-03-30" },
  { nom: "Note de service 042.docx", type: "DOCX", dossier: "Notes de service", date: "2026-04-10" },
  { nom: "Courrier entrant 001.pdf", type: "PDF", dossier: "Courriers 2026/Entrants", date: "2026-04-14" },
  { nom: "Budget prévisionnel.xlsx", type: "XLSX", dossier: "Rapports", date: "2026-02-15" },
];

const GEDExploration = () => {
  const [search, setSearch] = useState("");
  const filtered = allDocs.filter(d => d.nom.toLowerCase().includes(search.toLowerCase()));

  return (
    <ModuleLayout title="Exploration" sidebarItems={sidebarItems} backPath="/ged">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher un document..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid gap-3">
          {filtered.map((doc, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                {doc.type === "PDF" ? <FileText className="w-5 h-5 text-destructive" /> : <File className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{doc.nom}</p>
                <p className="text-xs text-muted-foreground">{doc.dossier} • {doc.date}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun document trouvé</p>}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default GEDExploration;
