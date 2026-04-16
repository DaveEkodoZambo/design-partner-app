import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "./LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
}

interface ModuleCardsProps {
  title: string;
  description: string;
  cards: ModuleCard[];
  backPath?: string;
}

const ModuleCards = ({ title, description, cards, backPath = "/dashboard" }: ModuleCardsProps) => {
  const navigate = useNavigate();
  const { loading, triggerLoading } = usePageTransition();

  const handleClick = (path: string) => {
    triggerLoading();
    setTimeout(() => navigate(path), 400);
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen bg-muted">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src={logoCuy} alt="CUY" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 text-muted-foreground">
            <Home className="w-4 h-4" /> Accueil
          </Button>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleClick(card.path)}
                className="cursor-pointer group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg ${card.color || "bg-primary"} flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ModuleCards;
