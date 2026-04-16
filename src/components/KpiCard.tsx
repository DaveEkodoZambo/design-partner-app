import { type LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

const KpiCard = ({ title, value, icon: Icon, color = "bg-primary" }: KpiCardProps) => (
  <div className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4">
    <div className={`w-11 h-11 rounded-lg ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

export default KpiCard;
