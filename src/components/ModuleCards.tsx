import { motion } from "framer-motion";
import { ArrowLeft, Home, ChevronRight, type LucideIcon } from "lucide-react";
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

const ModuleCards = ({ title, description, cards }: ModuleCardsProps) => {
  const { loading, navigateTo, goBack } = usePageTransition();

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen bg-muted">
        <header className="bg-card border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img src={logoCuy} alt="CUY" className="w-8 h-8 object-contain" />
              <h1 className="text-sm font-bold text-foreground">{title}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateTo("/dashboard")} className="gap-2 text-xs text-muted-foreground">
              <Home className="w-3.5 h-3.5" /> Accueil
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigateTo(card.path)}
                className="cursor-pointer group bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${card.color || "bg-primary"} flex items-center justify-center`}>
                    <card.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ModuleCards;
