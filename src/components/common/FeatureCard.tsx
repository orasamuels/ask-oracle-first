import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  footer?: ReactNode;
}

export function FeatureCard({ icon: Icon, title, description, badge, footer }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}
