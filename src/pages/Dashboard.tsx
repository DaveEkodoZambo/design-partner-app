import { motion } from "framer-motion";
import { Shield, Mail, FolderOpen, Archive, LogOut, ChevronRight, Users, FileText, Database, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

const modules = [
  { id: "administration", title: "Administration", description: "Gérez les utilisateurs, les rôles et les services de l'organisation. Configurez les accès et les permissions.", icon: Shield, color: "bg-primary",
    stats: [{ label: "Utilisateurs", value: "124", icon: Users }, { label: "Services", value: "18", icon: BarChart3 }] },
  { id: "gec", title: "Gestion Électronique du Courrier", description: "Suivez les courriers entrants, sortants et internes. Enregistrez et tracez chaque correspondance.", icon: Mail, color: "bg-destructive",
    stats: [{ label: "Courriers reçus", value: "2 340", icon: FileText }, { label: "En attente", value: "47", icon: BarChart3 }] },
  { id: "ged", title: "Gestion Électronique des Documents", description: "Organisez, indexez et explorez les documents institutionnels. Gérez l'arborescence documentaire.", icon: FolderOpen, color: "bg-secondary",
    stats: [{ label: "Documents", value: "8 712", icon: Database }, { label: "Dossiers", value: "346", icon: FolderOpen }] },
  { id: "sae", title: "Système d'Archivage Électronique", description: "Archivez les documents à valeur probante. Consultez les archives scellées avec leur empreinte.", icon: Archive, color: "bg-primary",
    stats: [{ label: "Archives", value: "3 891", icon: Database }, { label: "Versements", value: "62", icon: FileText }] },
];

const Dashboard = () => {
  const { loading, navigateTo } = usePageTransition();

  const handleLogout = () => {
    localStorage.removeItem("cuy-auth");
    navigateTo("/");
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen bg-muted">
        <header className="bg-card border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoCuy} alt="CUY" className="w-14 h-14 object-contain" />
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight">Communauté Urbaine de Yaoundé</h1>
                <p className="text-[11px] text-muted-foreground">Plateforme de gestion intégrée</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-xs text-muted-foreground hover:text-destructive">
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Sélectionnez un module pour accéder à ses fonctionnalités</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {modules.map((mod, i) => (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => navigateTo(`/${mod.id}`)}
                className="cursor-pointer group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${mod.color} flex items-center justify-center shrink-0`}>
                      <mod.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{mod.title}</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border bg-muted/50 px-5 py-3 flex gap-6">
                  {mod.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}:</span>
                      <span className="text-xs font-semibold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        <footer className="border-t border-border bg-card mt-12">
          <div className="max-w-6xl mx-auto px-6 py-4 text-center">
            <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} Communauté Urbaine de Yaoundé — Tous droits réservés</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
