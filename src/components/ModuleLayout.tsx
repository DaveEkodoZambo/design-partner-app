import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "./LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface ModuleLayoutProps {
  title: string;
  sidebarItems: SidebarItem[];
  children: ReactNode;
  backPath?: string;
}

const ModuleLayout = ({ title, sidebarItems, children }: ModuleLayoutProps) => {
  const location = useLocation();
  const { loading, navigateTo, goBack } = usePageTransition();

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen flex bg-muted">
        {/* Sidebar */}
        <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
          <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
            <img src={logoCuy} alt="CUY" className="w-7 h-7 object-contain" />
            <span className="font-bold text-xs">{title}</span>
          </div>
          <nav className="flex-1 p-2.5 space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-2.5 border-t border-sidebar-border">
            <button onClick={() => navigateTo("/dashboard")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <Home className="w-3.5 h-3.5" /> Tableau de bord
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-card border-b border-border px-5 py-3 flex items-center gap-2.5">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={goBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-sm font-bold text-foreground">{title}</h1>
          </header>
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-5">
            {children}
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default ModuleLayout;
