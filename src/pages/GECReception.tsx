import { Inbox, MailOpen, Mail, UserPlus } from "lucide-react";
import ModuleLayout from "@/components/ModuleLayout";
import KpiCard from "@/components/KpiCard";
import DataTable from "@/components/DataTable";
import TableToolbar from "@/components/TableToolbar";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const sidebarItems = [{ id: "reception", label: "Boîte de réception", icon: Inbox, path: "/gec/reception" }];

const GECReception = () => {
  const allCourriers = useAppStore((s) => s.courriers);
  const courriers = useMemo(() => allCourriers.filter((c) => c.type === "reception"), [allCourriers]);
  const updateCourrier = useAppStore((s) => s.updateCourrier);
  const { navigateTo } = usePageTransition();
  const [search, setSearch] = useState("");
  const [assignTarget, setAssignTarget] = useState<any>(null);
  const [assignee, setAssignee] = useState("");
  const [comment, setComment] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courriers.filter((c) =>
      [c.objet, c.contact, c.statut, c.priorite, c.reference, c.updatedBy, c.createdBy]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [courriers, search]);

  const handleAssign = () => {
    if (assignTarget && assignee) {
      updateCourrier(assignTarget.id, { assignedTo: assignee, assignmentComment: comment });
      toast.success("Courrier assigné", { description: `Assigné à ${assignee}` });
      setAssignTarget(null);
      setAssignee("");
      setComment("");
    }
  };

  return (
    <ModuleLayout title="Boîte de réception" sidebarItems={sidebarItems} backPath="/gec">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard title="Courriers non lus" value={courriers.filter((d) => d.statut === "Non lu").length} icon={Mail} color="bg-destructive" />
          <KpiCard title="Courriers traités" value={courriers.filter((d) => d.statut === "Traité").length} icon={MailOpen} color="bg-success" />
        </div>

        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Rechercher un courrier (objet, expéditeur, statut)..."
          exportData={filtered}
          exportFileName="boite_reception"
          exportSheetName="Réception"
          exportMapper={(c) => ({
            Objet: c.objet,
            Expéditeur: c.contact,
            Référence: c.reference || "",
            Date: c.date,
            Priorité: c.priorite,
            Statut: c.statut,
            "Assigné à": c.assignedTo || "",
            "Créé par": c.createdBy || "",
            "Modifié par": c.updatedBy || "",
          })}
        />

        <DataTable
          actionsAsMenu
          columns={[
            { key: "objet", label: "Objet" },
            { key: "contact", label: "Expéditeur" },
            { key: "date", label: "Date" },
            { key: "priorite", label: "Priorité", render: (v: string) => (
              <Badge variant="outline" className={v === "HAUTE" ? "border-destructive text-destructive" : ""}>{v}</Badge>
            )},
            { key: "statut", label: "Statut", render: (v: string) => (
              <Badge className={v === "Non lu" ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}>{v}</Badge>
            )},
            { key: "updatedBy", label: "Modifié par", render: (v: string) => (
              <span className="text-xs text-muted-foreground">{v || "—"}</span>
            )},
          ]}
          data={filtered}
          onRowClick={(row) => navigateTo(`/gec/courrier/${row.id}`)}
          onView={(row) => navigateTo(`/gec/courrier/${row.id}`)}
          extraActions={[
            { label: "Assigner à un utilisateur", icon: UserPlus, onClick: (row) => setAssignTarget(row) },
          ]}
        />

        <Dialog open={!!assignTarget} onOpenChange={(v) => { if (!v) { setAssignTarget(null); setAssignee(""); setComment(""); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Assigner le courrier</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">{assignTarget?.objet}</p>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger><SelectValue placeholder="Choisir un utilisateur" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jean Nguema">Jean Nguema</SelectItem>
                  <SelectItem value="Marie Mbarga">Marie Mbarga</SelectItem>
                  <SelectItem value="Paul Fouda">Paul Fouda</SelectItem>
                  <SelectItem value="Sophie Atangana">Sophie Atangana</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Commentaire (instructions, contexte...)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <Button onClick={handleAssign} className="w-full gradient-primary text-primary-foreground">Assigner</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default GECReception;
