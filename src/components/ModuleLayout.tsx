import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoCuy from "@/assets/logoCuy.png";

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

const ModuleLayout = ({ title, sidebarItems, children, backPath = "/dashboard" }: ModuleLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <img src={logoCuy} alt="CUY" className="w-8 h-8 object-contain" />
          <span className="font-bold text-sm">{title}</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <Home className="w-4 h-4" /> Tableau de bord
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </header>
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-6">
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default ModuleLayout;
