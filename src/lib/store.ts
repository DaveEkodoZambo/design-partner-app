// Mock in-memory store shared across pages (simulates a backend)
import { create } from "zustand";

export interface Courrier {
  id: number;
  type: "reception" | "envoi";
  objet: string;
  contact: string; // expéditeur ou destinataire
  reference?: string;
  priorite: "HAUTE" | "NORMALE" | "BASSE";
  date: string;
  statut: string;
  contenu?: string;
  fichier?: { nom: string; taille: string; type: string };
  assignedTo?: string;
  assignmentComment?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FolderNode {
  id: number;
  nom: string;
  parentId: number | null;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Document {
  id: number;
  nom: string;
  type: string;
  folderId: number | null;
  date: string;
  taille: string;
  actif: boolean;
  scelle: boolean;
  hash?: string;
  categorie?: string;
  createdBy?: string;
  updatedBy?: string;
}

export const CURRENT_USER = "Admin CUY";

interface AppState {
  courriers: Courrier[];
  addCourrier: (c: Omit<Courrier, "id">) => void;
  updateCourrier: (id: number, patch: Partial<Courrier>) => void;

  folders: FolderNode[];
  addFolder: (f: Omit<FolderNode, "id">) => void;
  updateFolder: (id: number, patch: Partial<FolderNode>) => void;
  deleteFolder: (id: number) => void;

  documents: Document[];
  addDocument: (d: Omit<Document, "id">) => void;
  updateDocument: (id: number, patch: Partial<Document>) => void;
  deleteDocument: (id: number) => void;
  sealDocument: (id: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  courriers: [
    { id: 1, type: "reception", objet: "Demande d'autorisation de construire", contact: "Ministère de l'Habitat", reference: "MH/2026/0421", priorite: "HAUTE", date: "2026-04-15", statut: "Non lu", contenu: "Demande officielle d'autorisation de construire un complexe administratif dans la zone Bastos. Veuillez examiner et fournir une réponse sous 15 jours.", fichier: { nom: "demande_autorisation.pdf", taille: "1.2 Mo", type: "PDF" }, createdBy: "Marie Mbarga", updatedBy: "Marie Mbarga" },
    { id: 2, type: "reception", objet: "Rapport d'activité Q1 2026", contact: "Direction Technique", reference: "DT/RA/Q1", priorite: "NORMALE", date: "2026-04-14", statut: "Traité", contenu: "Rapport trimestriel détaillant les activités, budgets engagés et prochaines étapes du premier trimestre 2026.", fichier: { nom: "rapport_q1.pdf", taille: "3.4 Mo", type: "PDF" }, createdBy: "Paul Fouda", updatedBy: "Jean Nguema" },
    { id: 3, type: "reception", objet: "Convocation réunion conseil municipal", contact: "Cabinet du Maire", reference: "CM/CONV/042", priorite: "HAUTE", date: "2026-04-13", statut: "Non lu", contenu: "Convocation à la réunion extraordinaire du conseil municipal prévue le 25 avril 2026 à 10h00.", fichier: { nom: "convocation.pdf", taille: "240 Ko", type: "PDF" }, createdBy: "Sophie Atangana", updatedBy: "Sophie Atangana" },
    { id: 4, type: "envoi", objet: "Réponse autorisation construire", contact: "Ministère de l'Habitat", reference: "CUY/REP/0089", priorite: "HAUTE", date: "2026-04-15", statut: "Envoyé", contenu: "Réponse officielle à la demande d'autorisation de construire transmise par le Ministère.", fichier: { nom: "reponse_autorisation.pdf", taille: "890 Ko", type: "PDF" }, createdBy: "Jean Nguema", updatedBy: "Jean Nguema" },
    { id: 5, type: "envoi", objet: "Note de service – Horaires", contact: "Tous les services", reference: "CUY/NS/2026-12", priorite: "NORMALE", date: "2026-04-12", statut: "Envoyé", contenu: "Nouvelle organisation des horaires de travail effective à compter du 1er mai 2026.", fichier: { nom: "note_horaires.docx", taille: "45 Ko", type: "DOCX" }, createdBy: "Marie Mbarga", updatedBy: "Marie Mbarga" },
  ],
  addCourrier: (c) => set((s) => ({ courriers: [{ ...c, id: Date.now() }, ...s.courriers] })),
  updateCourrier: (id, patch) => set((s) => ({ courriers: s.courriers.map((c) => (c.id === id ? { ...c, ...patch, updatedBy: patch.updatedBy ?? CURRENT_USER } : c)) })),

  folders: [
    { id: 1, nom: "Courriers 2026", parentId: null, description: "Tous les courriers de l'année 2026", createdBy: "Admin CUY", updatedBy: "Admin CUY" },
    { id: 2, nom: "Entrants", parentId: 1, description: "Courriers reçus", createdBy: "Marie Mbarga", updatedBy: "Marie Mbarga" },
    { id: 3, nom: "Sortants", parentId: 1, description: "Courriers envoyés", createdBy: "Marie Mbarga", updatedBy: "Marie Mbarga" },
    { id: 4, nom: "Notes de service", parentId: null, description: "Notes internes", createdBy: "Jean Nguema", updatedBy: "Jean Nguema" },
    { id: 5, nom: "Rapports", parentId: null, description: "Rapports d'activité", createdBy: "Paul Fouda", updatedBy: "Paul Fouda" },
    { id: 6, nom: "Q1 2026", parentId: 5, createdBy: "Paul Fouda", updatedBy: "Paul Fouda" },
  ],
  addFolder: (f) => set((s) => ({ folders: [...s.folders, { ...f, id: Date.now(), createdBy: f.createdBy ?? CURRENT_USER, updatedBy: f.updatedBy ?? CURRENT_USER }] })),
  updateFolder: (id, patch) => set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, ...patch, updatedBy: patch.updatedBy ?? CURRENT_USER } : f)) })),
  deleteFolder: (id) => set((s) => {
    const toDelete = new Set<number>();
    const collect = (pid: number) => {
      toDelete.add(pid);
      s.folders.filter((f) => f.parentId === pid).forEach((f) => collect(f.id));
    };
    collect(id);
    return {
      folders: s.folders.filter((f) => !toDelete.has(f.id)),
      documents: s.documents.filter((d) => !d.folderId || !toDelete.has(d.folderId)),
    };
  }),

  documents: [
    { id: 1, nom: "Rapport Q1 2026.pdf", type: "PDF", folderId: 6, date: "2026-03-30", taille: "3.4 Mo", actif: true, scelle: false, createdBy: "Paul Fouda", updatedBy: "Paul Fouda" },
    { id: 2, nom: "Note de service 042.docx", type: "DOCX", folderId: 4, date: "2026-04-10", taille: "45 Ko", actif: true, scelle: false, createdBy: "Jean Nguema", updatedBy: "Marie Mbarga" },
    { id: 3, nom: "Courrier entrant 001.pdf", type: "PDF", folderId: 2, date: "2026-04-14", taille: "1.2 Mo", actif: true, scelle: false, createdBy: "Sophie Atangana", updatedBy: "Sophie Atangana" },
    { id: 4, nom: "Budget prévisionnel.xlsx", type: "XLSX", folderId: 5, date: "2026-02-15", taille: "210 Ko", actif: true, scelle: false, createdBy: "Paul Fouda", updatedBy: "Paul Fouda" },
    { id: 5, nom: "Archive officielle 2024.pdf", type: "PDF", folderId: null, date: "2024-12-31", taille: "5.6 Mo", actif: true, scelle: true, hash: "a3f2b8c14d7e9f02", categorie: "Rapports financiers", createdBy: "Admin CUY", updatedBy: "Admin CUY" },
    { id: 6, nom: "Décret municipal 2023.pdf", type: "PDF", folderId: null, date: "2023-06-15", taille: "1.8 Mo", actif: true, scelle: true, hash: "d7e14f2ab9c3e801", categorie: "Décrets", createdBy: "Admin CUY", updatedBy: "Admin CUY" },
  ],
  addDocument: (d) => set((s) => ({ documents: [...s.documents, { ...d, id: Date.now(), createdBy: d.createdBy ?? CURRENT_USER, updatedBy: d.updatedBy ?? CURRENT_USER }] })),
  updateDocument: (id, patch) => set((s) => ({ documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch, updatedBy: patch.updatedBy ?? CURRENT_USER } : d)) })),
  deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
  sealDocument: (id) => set((s) => ({
    documents: s.documents.map((d) => d.id === id ? {
      ...d, scelle: true,
      hash: Math.random().toString(16).slice(2, 18),
      categorie: d.categorie || "Documents archivés",
    } : d),
  })),
}));
