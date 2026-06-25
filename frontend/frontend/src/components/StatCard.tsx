import { useEffect, useState, type ComponentType } from "react";
import { ArrowDown, ArrowUp, type LucideProps } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon: ComponentType<LucideProps>;
  gradient?: "primary" | "success" | "warning" | "danger" | "info";
};

export function StatCard({ label, value, prefix = "", suffix = "", trend, icon: Icon, gradient = "primary" }: Props) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const positive = (trend ?? 0) >= 0;
  return (
    <Card className="relative overflow-hidden p-5 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-0.5 group">
      <div className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40",
        gradient === "primary" && "gradient-primary",
        gradient === "success" && "gradient-success",
        gradient === "warning" && "gradient-warning",
        gradient === "danger"  && "gradient-danger",
        gradient === "info"    && "gradient-info",
      )} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
            {prefix}{n.toLocaleString()}{suffix}
          </p>
          {typeof trend === "number" && (
            <div className={cn("mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
              {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-elegant",
          gradient === "primary" && "gradient-primary",
          gradient === "success" && "gradient-success",
          gradient === "warning" && "gradient-warning",
          gradient === "danger"  && "gradient-danger",
          gradient === "info"    && "gradient-info",
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
