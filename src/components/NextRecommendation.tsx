import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextRecommendationProps {
  title: string;
  subtitle: string;
  route: string;
  themeColor?: "primary" | "success" | "accent" | "purple";
}

const themes = {
  primary: { bg: "bg-primary/5", border: "border-primary/15", icon: "bg-primary text-primary-foreground", btn: "" },
  success: { bg: "bg-success/5", border: "border-success/15", icon: "bg-success text-success-foreground", btn: "bg-success hover:bg-success/90" },
  accent: { bg: "bg-accent/5", border: "border-accent/15", icon: "bg-accent text-accent-foreground", btn: "bg-accent hover:bg-accent/90" },
  purple: { bg: "bg-[hsl(var(--purple)/0.05)]", border: "border-[hsl(var(--purple)/0.15)]", icon: "bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))]", btn: "bg-[hsl(var(--purple))] hover:bg-[hsl(var(--purple)/0.9)]" },
};

const NextRecommendation = ({ title, subtitle, route, themeColor = "primary" }: NextRecommendationProps) => {
  const navigate = useNavigate();
  const t = themes[themeColor];

  return (
    <div className={`${t.bg} rounded-xl p-4 border ${t.border}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${t.icon} flex items-center justify-center shrink-0`}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Next Recommended</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Button size="sm" className={`h-8 text-xs shrink-0 gap-1 ${t.btn}`} onClick={() => navigate(route)}>
          Start <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default NextRecommendation;
