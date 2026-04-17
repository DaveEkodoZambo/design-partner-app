import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoCuy from "@/assets/logoCuy.png";
import LoadingScreen from "@/components/LoadingScreen";

const VALID_EMAIL = "admin@cuy.cm";
const VALID_PASSWORD = "admin123";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setLoading(true);
      toast.success("Connexion réussie", {
        description: "Bienvenue sur la plateforme CUY",
        className: "bg-success text-success-foreground border-success",
      });
      localStorage.setItem("cuy-auth", "true");
      setTimeout(() => navigate("/dashboard"), 700);
    } else {
      toast.error("Échec de la connexion", {
        description: "Email ou mot de passe incorrect",
        className: "bg-destructive text-destructive-foreground border-destructive",
      });
    }
  };

  return (
    <>
      <LoadingScreen show={loading} />
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden flex-col items-center justify-center p-12">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(145 63% 60%) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, hsl(45 93% 60%) 0%, transparent 40%)`
          }} />
          <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            src={logoCuy} alt="CUY" className="w-52 h-52 object-contain mb-8 relative z-10"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="text-3xl font-bold text-white mb-3">Communauté Urbaine de Yaoundé</h1>
            <p className="text-white/80 text-base max-w-sm leading-relaxed">
              Plateforme intégrée de gestion du courrier, des documents et des archives
            </p>
          </motion.div>
          <div className="absolute bottom-8 flex items-center gap-2 text-white/50 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Accès sécurisé — Données protégées
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <div className="lg:hidden flex flex-col items-center mb-8">
              <img src={logoCuy} alt="CUY" className="w-24 h-24 object-contain mb-3" />
              <h1 className="text-lg font-bold text-foreground">Communauté Urbaine de Yaoundé</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
              <p className="text-muted-foreground text-sm mt-1.5">Accédez à votre espace de travail</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="nom@cuy.cm" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground gap-2 text-sm font-semibold">
                <LogIn className="w-4 h-4" /> Se connecter
              </Button>
            </form>

            <div className="mt-6 p-3 bg-muted rounded-lg text-[11px] text-muted-foreground">
              <strong className="text-foreground">Démo :</strong> admin@cuy.cm / admin123
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              © {new Date().getFullYear()} Communauté Urbaine de Yaoundé
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
