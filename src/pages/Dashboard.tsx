import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, FolderOpen, Archive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

const modules = [
  { id: "administration", title: "Administration", description: "Gestion des utilisateurs et services", icon: Shield, color: "bg-primary" },
  { id: "gec", title: "GEC", description: "Gestion Électronique du Courrier", icon: Mail, color: "bg-destructive" },
  { id: "ged", title: "GED", description: "Gestion Électronique des Documents", icon: FolderOpen, color: "bg-secondary" },
  { id: "sae", title: "SAE", description: "Système d'Archivage Électronique", icon: Archive, color: "bg-primary" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, triggerLoading } = usePageTransition();

  const handleModuleClick = (id: string) => {
    triggerLoading();
    setTimeout(() => navigate(`/${id}`), 400);
  };

  const handleLogout = () => {
    localStorage.removeItem("cuy-auth");
    navigate("/");
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen bg-muted">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <img src={logoCuy} alt="CUY" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-foreground">CUY - Plateforme de Gestion</h1>
              <p className="text-xs text-muted-foreground">Communauté Urbaine de Yaoundé</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h2 className="text-3xl font-bold text-foreground">Tableau de bord</h2>
            <p className="text-muted-foreground mt-1">Sélectionnez un module pour commencer</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleModuleClick(mod.id)}
                className="cursor-pointer group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg ${mod.color} flex items-center justify-center mb-4`}>
                  <mod.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{mod.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
