import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Headphones, BookOpen, PenTool, Mic, Play, Clock, ChevronRight,
  Sparkles, X, CheckCircle2, ArrowRight, TrendingUp, Target,
  Flame, Bookmark, BookmarkCheck, Trophy, Filter, AlertTriangle
} from "lucide-react";
import { ListItemSkeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AiSuggestionEngine from "@/components/AiSuggestionEngine";

/* ─── Data ─── */
type TestStatus = "new" | "completed" | "in-progress";
type DifficultyFilter = "all" | "easy" | "medium" | "hard" | "not-attempted" | "need-work";

interface Test {
  title: string;
  meta: string;
  status: TestStatus;
  difficulty?: "easy" | "medium" | "hard";
  bookmarked?: boolean;
  lastScore?: number;
}

interface Module {
  id: string;
  icon: typeof Headphones;
  title: string;
  totalTests: number;
  completed: number;
  aiSuggestion: string;
  aiSubtitle: string;
  themeClass: string;
  iconBg: string;
  accentText: string;
  accentBg: string;
  tests: Test[];
}

const modules: Module[] = [
  {
    id: "listening", icon: Headphones, title: "Listening", totalTests: 42, completed: 12,
    aiSuggestion: "Section 3 Practice", aiSubtitle: "Multiple Choice — your weakest area",
    themeClass: "from-primary to-primary/80", iconBg: "bg-primary", accentText: "text-primary", accentBg: "bg-primary/10",
    tests: [
      { title: "Cambridge 18 Test 1", meta: "Academic • 30 min • 40 questions", status: "new" },
      { title: "Cambridge 17 Test 4", meta: "Academic • 30 min • 40 questions", status: "in-progress" },
      { title: "Form Completion Drills", meta: "By Type • 10 min • 10 questions", status: "completed", difficulty: "easy", lastScore: 7.5 },
      { title: "Map & Plan Labeling", meta: "By Type • 8 min • 8 questions", status: "new", difficulty: "medium", bookmarked: true },
      { title: "Section 3: Multiple Choice", meta: "By Type • 12 min • 10 questions", status: "new", difficulty: "hard" },
    ],
  },
  {
    id: "reading", icon: BookOpen, title: "Reading", totalTests: 45, completed: 8,
    aiSuggestion: "T/F/NG Practice", aiSubtitle: "Accuracy dropped 15% last week",
    themeClass: "from-success to-success/80", iconBg: "bg-success", accentText: "text-success", accentBg: "bg-success/10",
    tests: [
      { title: "Climate Science Passage", meta: "Hard • Science • 20 min", status: "new", difficulty: "hard" },
      { title: "Ancient Civilizations", meta: "Medium • History • 20 min", status: "completed", difficulty: "medium", lastScore: 6.5 },
      { title: "True/False/NG Set A", meta: "By Type • 15 min • 10 questions", status: "new", difficulty: "medium", bookmarked: true },
      { title: "Matching Headings", meta: "By Type • 12 min • 8 questions", status: "new", difficulty: "easy" },
      { title: "Summary Completion", meta: "By Type • 10 min • 6 questions", status: "completed", difficulty: "medium", lastScore: 5.5 },
    ],
  },
  {
    id: "writing", icon: PenTool, title: "Writing", totalTests: 30, completed: 5,
    aiSuggestion: "Task 2: Opinion Essay", aiSubtitle: "Coherence score needs improvement",
    themeClass: "from-accent to-accent/80", iconBg: "bg-accent", accentText: "text-accent", accentBg: "bg-accent/10",
    tests: [
      { title: "Task 1 — Bar Chart", meta: "Academic • 20 min", status: "new" },
      { title: "Task 1 — Line Graph", meta: "Academic • 20 min", status: "completed", lastScore: 7.0 },
      { title: "Task 2 — Opinion Essay", meta: "Essay • 40 min", status: "new", bookmarked: true },
      { title: "Task 2 — Discussion Essay", meta: "Essay • 40 min", status: "new" },
      { title: "Task 1 — Process Diagram", meta: "Academic • 20 min", status: "new" },
    ],
  },
  {
    id: "speaking", icon: Mic, title: "Speaking", totalTests: 36, completed: 10,
    aiSuggestion: "Part 2: Cue Card", aiSubtitle: "Practice fluency & timing",
    themeClass: "from-[hsl(var(--purple))] to-[hsl(var(--purple)/0.8)]", iconBg: "bg-[hsl(var(--purple))]",
    accentText: "text-[hsl(var(--purple))]", accentBg: "bg-[hsl(var(--purple)/0.1)]",
    tests: [
      { title: "Part 1 — Introduction", meta: "5 questions • 5 min", status: "completed", lastScore: 6.5 },
      { title: "Part 2 — Cue Card: Travel", meta: "Long turn • 3 min", status: "completed", lastScore: 7.0 },
      { title: "Part 2 — Cue Card: Education", meta: "Long turn • 3 min", status: "new" },
      { title: "Part 3 — Discussion: Technology", meta: "4 questions • 5 min", status: "new", bookmarked: true },
      { title: "Full Mock Interview", meta: "All parts • 14 min", status: "new" },
    ],
  },
];

const difficultyConfig = {
  easy: { label: "Easy", className: "bg-success/10 text-success" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning" },
  hard: { label: "Hard", className: "bg-destructive/10 text-destructive" },
};

const statusConfig = {
  new: { label: "New", icon: ChevronRight },
  "in-progress": { label: "Continue", icon: Play },
  completed: { label: "Done", icon: CheckCircle2 },
};

const filterOptions: { id: DifficultyFilter; label: string; icon?: typeof Filter }[] = [
  { id: "all", label: "All Types" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
  { id: "not-attempted", label: "Not Attempted" },
  { id: "need-work", label: "Need Work" },
];

/* Recent activity data */
const recentActivity = [
  { title: "Cambridge 17 Test 4", module: "Listening", icon: Headphones, time: "2h ago", color: "bg-primary/10 text-primary", route: "/practice/listening" },
  { title: "T/F/NG Set A", module: "Reading", icon: BookOpen, time: "Yesterday", color: "bg-success/10 text-success", route: "/practice/reading" },
  { title: "Task 2 — Opinion Essay", module: "Writing", icon: PenTool, time: "2 days ago", color: "bg-accent/10 text-accent", route: "/practice/writing" },
];

const achievements = [
  { emoji: "🔥", label: "5-day streak", earned: true },
  { emoji: "🎯", label: "10 tests done", earned: true },
  { emoji: "📖", label: "Reading 7.0", earned: false },
  { emoji: "✍️", label: "5 essays", earned: true },
];

/* ─── Animated Progress Ring ─── */
const AnimatedRing = ({ value, size = 48, stroke = 4, color }: { value: number; size?: number; stroke?: number; color: string }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={`${(animatedValue / 100) * circ} ${circ}`}
        strokeLinecap="round" className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

/* ─── Component ─── */
const Practice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("all");
  const [showAiBanner, setShowAiBanner] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredModules = activeTab === "all"
    ? modules
    : modules.filter((m) => m.id === activeTab);

  const totalCompleted = modules.reduce((a, m) => a + (m.completed > 0 ? 1 : 0), 0);
  const bookmarkedTests = modules.flatMap((m) => m.tests.filter((t) => t.bookmarked).map((t) => ({ ...t, moduleId: m.id, moduleTitle: m.title, icon: m.icon, color: m.accentBg + " " + m.accentText })));
  const hasActivity = recentActivity.length > 0;

  const filterTest = (test: Test): boolean => {
    if (diffFilter === "all") return true;
    if (diffFilter === "easy") return test.difficulty === "easy";
    if (diffFilter === "medium") return test.difficulty === "medium";
    if (diffFilter === "hard") return test.difficulty === "hard";
    if (diffFilter === "not-attempted") return test.status === "new";
    if (diffFilter === "need-work") return test.lastScore !== undefined && test.lastScore < 6.5;
    return true;
  };

  const handleTestClick = (moduleId: string) => {
    navigate(`/practice/${moduleId}`);
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "listening", label: "Listening" },
    { id: "reading", label: "Reading" },
    { id: "writing", label: "Writing" },
    { id: "speaking", label: "Speaking" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold leading-8 text-foreground">
            Practice Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Master every IELTS skill with AI-guided practice
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-1">
          {/* Streak */}
          <div className="flex items-center gap-1 bg-accent/10 rounded-full px-2.5 py-1.5">
            <Flame className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs font-bold text-accent">5</span>
          </div>
          <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-card border border-border">
            <Target className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground">{totalCompleted}/4</span>
          </div>
        </div>
      </div>

      {/* ─── AI Suggestion Banner ─── */}
      {showAiBanner && (
        <div className="relative bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 rounded-xl p-4 border border-primary/15 overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_70%)]" />
          <div className="relative flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">AI Recommendation</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Rahima, based on your weak areas: <span className="font-semibold text-foreground">Writing Task 2 — Opinion Essays</span>. Your coherence score needs work.
              </p>
              <Button size="sm" className="mt-2.5 h-8 text-xs gap-1.5" onClick={() => navigate("/practice/writing")}>
                Start Now <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <button onClick={() => setShowAiBanner(false)} className="p-1 rounded-md hover:bg-secondary/80 transition-colors shrink-0" aria-label="Dismiss">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* ─── AI Study Plan ─── */}
      <AiSuggestionEngine compact />

      {/* ─── Pill Tabs ─── */}
      <div ref={tabsRef} className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpandedModule(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 press focus-ring shrink-0 ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-secondary border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setDiffFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all press shrink-0 ${
              diffFilter === f.id
                ? f.id === "easy" ? "bg-success/10 text-success border border-success/30"
                : f.id === "medium" ? "bg-warning/10 text-warning border border-warning/30"
                : f.id === "hard" ? "bg-destructive/10 text-destructive border border-destructive/30"
                : f.id === "need-work" ? "bg-destructive/10 text-destructive border border-destructive/30"
                : "bg-secondary text-foreground border border-border"
                : "bg-transparent text-muted-foreground hover:bg-secondary/50 border border-transparent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── Module Cards ─── */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-24 bg-secondary rounded" />
                    <div className="h-1.5 w-full bg-secondary rounded-full" />
                  </div>
                </div>
                <div className="h-12 w-full bg-secondary rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No modules match the current filter.</p>
          </div>
        ) : (
          filteredModules.map((mod, modIdx) => {
            const Icon = mod.icon;
            const isExpanded = expandedModule === mod.id;
            const progressPct = Math.round((mod.completed / mod.totalTests) * 100);
            const visibleTests = mod.tests.filter(filterTest);

            return (
              <div
                key={mod.id}
                className="bg-card rounded-xl shadow-card overflow-hidden border border-border transition-all duration-300 hover:shadow-elevated animate-fade-in-up"
                style={{ animationDelay: `${modIdx * 80}ms` }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${mod.themeClass}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <AnimatedRing value={progressPct} size={48} stroke={4} color={`hsl(var(--${mod.id === "listening" ? "primary" : mod.id === "reading" ? "success" : mod.id === "writing" ? "accent" : "purple"}))`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${mod.accentText}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">{mod.title}</h2>
                        <span className="text-xs font-medium text-muted-foreground">
                          {mod.completed}/{mod.totalTests} done
                        </span>
                      </div>
                      <div className="mt-2">
                        <Progress value={progressPct} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 flex items-center gap-2 ${mod.accentBg} rounded-lg px-3 py-2.5`}>
                    <Sparkles className={`w-3.5 h-3.5 ${mod.accentText} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">AI Suggests: {mod.aiSuggestion}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{mod.aiSubtitle}</p>
                    </div>
                    <TrendingUp className={`w-3.5 h-3.5 ${mod.accentText} shrink-0`} />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Button size="sm" className="flex-1 h-10 text-sm gap-1.5" onClick={() => handleTestClick(mod.id)}>
                      <Play className="w-4 h-4" /> Start Suggested
                    </Button>
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className={`text-sm font-medium ${mod.accentText} hover:underline underline-offset-4 transition-colors press whitespace-nowrap`}
                    >
                      {isExpanded ? "Hide Tests" : "Browse All →"}
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="border-t border-border">
                    {visibleTests.length === 0 ? (
                      <div className="px-5 py-6 text-center">
                        <AlertTriangle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No tests match "<span className="font-semibold">{filterOptions.find(f => f.id === diffFilter)?.label}</span>"</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {visibleTests.map((test, i) => {
                          const statusCfg = statusConfig[test.status];
                          return (
                            <button
                              key={i}
                              onClick={() => handleTestClick(mod.id)}
                              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/50 transition-colors press focus-ring text-left min-h-[56px] group"
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                                test.status === "completed" ? "bg-success/10"
                                : test.status === "in-progress" ? mod.accentBg
                                : "bg-secondary"
                              }`}>
                                {test.status === "completed" ? (
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                ) : test.status === "in-progress" ? (
                                  <Play className={`w-4 h-4 ${mod.accentText}`} />
                                ) : (
                                  <Play className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate text-foreground">{test.title}</p>
                                  {test.bookmarked && <BookmarkCheck className="w-3.5 h-3.5 text-accent shrink-0" />}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {test.meta}
                                  </p>
                                  {test.difficulty && (
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${difficultyConfig[test.difficulty].className}`}>
                                      {difficultyConfig[test.difficulty].label}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {test.status === "completed" ? (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {test.lastScore && (
                                    <span className={`text-xs font-bold ${test.lastScore >= 7 ? "text-success" : test.lastScore >= 6 ? "text-warning" : "text-destructive"}`}>
                                      {test.lastScore}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">Done</span>
                                </div>
                              ) : test.status === "in-progress" ? (
                                <span className={`text-[10px] font-semibold ${mod.accentBg} ${mod.accentText} px-2 py-0.5 rounded-full shrink-0`}>
                                  Continue
                                </span>
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Continue Where You Left Off ─── */}
      {hasActivity && (
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Continue where you left off
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.route)}
                  className="shrink-0 w-[200px] bg-card rounded-xl border border-border p-4 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.module}</p>
                  <span className="text-[10px] font-semibold text-primary flex items-center gap-0.5 mt-2 group-hover:underline underline-offset-2">
                    Resume <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Bookmarked ─── */}
      {bookmarkedTests.length > 0 && (
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-accent" /> Bookmarked for later
          </h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
            {bookmarkedTests.map((test, i) => {
              const Icon = test.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleTestClick(test.moduleId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors press text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${test.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{test.title}</p>
                    <p className="text-[10px] text-muted-foreground">{test.moduleTitle} • {test.meta}</p>
                  </div>
                  <BookmarkCheck className="w-4 h-4 text-accent shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Achievements This Week ─── */}
      <div className="animate-fade-in-up delay-400">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" /> Achievements this week
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {achievements.map((a) => (
            <div
              key={a.label}
              className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${
                a.earned
                  ? "bg-card border-border shadow-card"
                  : "bg-secondary/30 border-border opacity-50"
              }`}
            >
              <span className={`text-2xl ${a.earned ? "" : "grayscale"}`}>{a.emoji}</span>
              <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{a.label}</span>
              {a.earned && (
                <span className="text-[9px] font-semibold text-success">✓ Earned</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
