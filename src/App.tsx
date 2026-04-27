import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Administration from "./pages/Administration";
import Utilisateurs from "./pages/Utilisateurs";
import Services from "./pages/Services";
import GEC from "./pages/GEC";
import GECReception from "./pages/GECReception";
import GECEnvoi from "./pages/GECEnvoi";
import GECNouveau from "./pages/GECNouveau";
import CourrierEntrant from "./pages/CourrierEntrant";
import CourrierSortant from "./pages/CourrierSortant";
import CourrierInterne from "./pages/CourrierInterne";
import CourrierDetail from "./pages/CourrierDetail";
import GED from "./pages/GED";
import GEDArborescence from "./pages/GEDArborescence";
import GEDExploration from "./pages/GEDExploration";
import GEDGestion from "./pages/GEDGestion";
import GEDDocumentDetail from "./pages/GEDDocumentDetail";
import GEDVisualisation from "./pages/GEDVisualisation";
import SAE from "./pages/SAE";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="/administration/utilisateurs" element={<Utilisateurs />} />
          <Route path="/administration/services" element={<Services />} />
          <Route path="/gec" element={<GEC />} />
          <Route path="/gec/reception" element={<GECReception />} />
          <Route path="/gec/envoi" element={<GECEnvoi />} />
          <Route path="/gec/nouveau" element={<GECNouveau />} />
          <Route path="/gec/nouveau/entrant" element={<CourrierEntrant />} />
          <Route path="/gec/nouveau/sortant" element={<CourrierSortant />} />
          <Route path="/gec/nouveau/interne" element={<CourrierInterne />} />
          <Route path="/gec/courrier/:id" element={<CourrierDetail />} />
          <Route path="/ged" element={<GED />} />
          <Route path="/ged/arborescence" element={<GEDArborescence />} />
          <Route path="/ged/exploration" element={<GEDExploration />} />
          <Route path="/ged/gestion" element={<GEDGestion />} />
          <Route path="/ged/gestion/document/:id" element={<GEDDocumentDetail />} />
          <Route path="/ged/visualisation" element={<GEDVisualisation />} />
          <Route path="/sae" element={<SAE />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
