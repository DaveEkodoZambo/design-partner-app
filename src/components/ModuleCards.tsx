import { motion } from "framer-motion";
import { ArrowLeft, Home, ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "./LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

export interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
  stats?: { label: string; value: string; icon: LucideIcon }[];
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
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="w-9 h-9" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <img src={logoCuy} alt="CUY" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight">{title}</h1>
                <p className="text-[11px] text-muted-foreground">Communauté Urbaine de Yaoundé</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateTo("/dashboard")} className="gap-2 text-xs text-muted-foreground">
              <Home className="w-3.5 h-3.5" /> Tableau de bord
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigateTo(card.path)}
                className="cursor-pointer group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${card.color || "bg-primary"} flex items-center justify-center shrink-0`}>
                      <card.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </div>
                {card.stats && card.stats.length > 0 && (
                  <div className="border-t border-border bg-muted/50 px-5 py-3 flex gap-6 flex-wrap">
                    {card.stats.map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2">
                        <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{stat.label}:</span>
                        <span className="text-xs font-semibold text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ModuleCards;
