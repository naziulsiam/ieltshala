import { useNavigate } from "react-router-dom";
import {
  Sparkles, ChevronRight, BarChart3,
  Headphones, PenTool, BookOpen, Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Recommendation {
  module: string;
  icon: typeof Headphones;
  skill: string;
  current: number;
  target: number;
  priority: "high" | "medium" | "low";
  action: string;
  route: string;
  duration: string;
}

const recommendations: Recommendation[] = [
  {
    module: "Writing",
    icon: PenTool,
    skill: "Task Response",
    current: 6.0,
    target: 7.0,
    priority: "high",
    action: "Start 20-min Lesson",
    route: "/practice/writing",
    duration: "20 min",
  },
  {
    module: "Speaking",
    icon: Mic,
    skill: "Part 3 Discussion",
    current: 6.5,
    target: 7.0,
    priority: "medium",
    action: "Start AI Practice",
    route: "/practice/speaking",
    duration: "15 min",
  },
  {
    module: "Listening",
    icon: Headphones,
    skill: "Section 4",
    current: 8.0,
    target: 7.0,
    priority: "low",
    action: "Occasional Practice",
    route: "/practice/listening",
    duration: "10 min",
  },
];

const priorityConfig = {
  high: { dot: "bg-destructive", label: "Priority", labelClass: "text-destructive", bg: "bg-destructive/5 border-destructive/15" },
  medium: { dot: "bg-warning", label: "Practice", labelClass: "text-warning", bg: "bg-warning/5 border-warning/15" },
  low: { dot: "bg-success", label: "Maintain", labelClass: "text-success", bg: "bg-success/5 border-success/15" },
};

const AiSuggestionEngine = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary/5 via-primary/8 to-accent/5 rounded-xl p-4 border border-primary/15">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Smart Recommendations</span>
        </div>
        <div className="space-y-2">
          {recommendations.slice(0, 2).map((rec) => {
            const cfg = priorityConfig[rec.priority];
            const Icon = rec.icon;
            return (
              <button
                key={rec.skill}
                onClick={() => navigate(rec.route)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 border text-left transition-all press ${cfg.bg}`}
              >
                <div className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{rec.module}: {rec.skill}</p>
                  <p className="text-[10px] text-muted-foreground">{rec.current} → {rec.target}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Smart Recommendations</p>
            <p className="text-[10px] text-muted-foreground">Based on your last mock test</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {recommendations.map((rec, i) => {
          const cfg = priorityConfig[rec.priority];
          const Icon = rec.icon;
          return (
            <div key={rec.skill} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-muted-foreground">{i + 1}.</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold ${cfg.labelClass}`}>{cfg.label}</span>
                    <span className="text-xs font-semibold text-foreground">{rec.module}: {rec.skill}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                    <span>Current: <span className="font-bold text-foreground">{rec.current}</span></span>
                    <span className="text-border">|</span>
                    <span>Target: <span className="font-bold text-foreground">{rec.target}</span></span>
                  </div>
                  <Button
                    size="sm"
                    variant={rec.priority === "high" ? "default" : rec.priority === "medium" ? "outline" : "ghost"}
                    className="h-8 text-xs gap-1.5"
                    onClick={() => navigate(rec.route)}
                  >
                    {rec.action} <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
                <Icon className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border bg-secondary/20">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary press"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          View Full Study Plan
        </button>
      </div>
    </div>
  );
};

export default AiSuggestionEngine;
