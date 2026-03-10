import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, Target, Clock, Headphones, PenTool, Languages, Mic, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import AiSuggestionEngine from "@/components/AiSuggestionEngine";

const todayPlan = [
  { icon: Headphones, title: "Listening Practice", subtitle: "Academic Section 3", time: "20 min", to: "/practice", color: "bg-primary/10 text-primary" },
  { icon: PenTool, title: "Writing Task 2", subtitle: "Opinion Essay", time: "30 min", to: "/practice/writing", color: "bg-accent/10 text-accent" },
  { icon: Languages, title: "Vocabulary Review", subtitle: "15 new words", time: "10 min", to: "/vocabulary", color: "bg-success/10 text-success" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekMins = [45, 62, 30, 55, 0, 15, 70];
const totalHours = (weekMins.reduce((a, b) => a + b, 0) / 60).toFixed(1);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-8">
      {/* Header — minimal, one line */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold leading-8">Welcome back, Rahima 👋</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-accent" />
          0.5 bands away from your 7.0 goal
        </p>
      </div>

      {/* TODAY'S FOCUS — the single most prominent section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Today's Focus</h2>
          <span className="text-xs text-muted-foreground">~60 min total</span>
        </div>

        {/* Primary CTA card — largest, first */}
        <Link to={todayPlan[0].to} className="block mb-3">
          <div className="bg-card rounded-xl shadow-card card-interactive p-5 border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{todayPlan[0].title}</p>
                <p className="text-xs text-muted-foreground">{todayPlan[0].subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <Button variant="coral" size="sm" className="min-h-[44px] min-w-[80px]" tabIndex={-1}>
                  Start
                </Button>
                <p className="text-[10px] text-muted-foreground mt-1">{todayPlan[0].time}</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary tasks — smaller, grouped */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todayPlan.slice(1).map((item) => (
            <Link key={item.title} to={item.to} className="block">
              <div className="bg-card rounded-xl shadow-card card-interactive p-4 h-full">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color} mb-3`}>
                  <item.icon className="w-[18px] h-[18px]" />
                </div>
                <p className="text-sm font-semibold leading-tight">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                  <span className="text-xs font-semibold text-primary">Start →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Goal Progress — compact, informational */}
      <Link to="/profile" className="block">
        <div className="bg-card rounded-xl p-5 shadow-card card-interactive">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--accent))" strokeWidth="6"
                  strokeDasharray={`${(6.5 / 9) * 263.9} 263.9`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold leading-none">6.5</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Target: Band 7.0</p>
              <p className="text-xs text-muted-foreground mt-0.5">Est. ready: March 15</p>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-accent rounded-full" style={{ width: "72%" }} />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        </div>
      </Link>


      {/* AI Recommendations */}
      <AiSuggestionEngine />

      {/* Weekly Activity */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">This Week</h2>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" /> +23% vs last week
          </span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {weekDays.map((day, i) => {
            const maxH = 80;
            const h = weekMins[i] > 0 ? Math.max(6, (weekMins[i] / 80) * maxH) : 3;
            const isToday = i === new Date().getDay() - 1;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: maxH }}>
                  <div
                    className={`w-full max-w-[28px] rounded transition-all duration-300 ${weekMins[i] > 0
                        ? isToday ? "bg-accent" : "bg-primary/60 hover:bg-primary/80"
                        : "bg-border"
                      }`}
                    style={{ height: h }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? "text-accent font-semibold" : "text-muted-foreground"}`}>{day}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          <span className="font-semibold text-foreground">{totalHours}h</span> practiced this week
        </p>
      </div>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 px-4 pb-2" style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
        <Link to="/practice">
          <Button variant="coral" size="lg" className="w-full min-h-[48px] shadow-elevated">
            <Mic className="w-4 h-4 mr-1.5" />
            Continue Today's Practice
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
