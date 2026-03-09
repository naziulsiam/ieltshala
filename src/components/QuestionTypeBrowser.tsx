import { useState } from "react";
import { ChevronRight, Star, Play, Clock, AlertTriangle, Zap, X } from "lucide-react";

interface QuestionType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  avgScore?: string | number;
  difficulty?: number; // 1-5 scale
  description?: string;
  avgTime?: string;
  commonMistakes?: string[];
  sampleQuestionId?: string;
}

interface QuestionTypeBrowserProps {
  types: QuestionType[];
  activeType: string;
  onSelectType: (id: string) => void;
  onTrySample?: (typeId: string) => void;
  themeColor?: "primary" | "success" | "accent" | "purple";
  columns?: 2 | 3;
}

const themeMap = {
  primary: {
    activeBg: "bg-primary/5",
    activeBorder: "border-primary/30",
    activeIcon: "bg-primary text-primary-foreground",
    hoverIcon: "group-hover:bg-primary/10 group-hover:text-primary",
    scoreHigh: "text-success",
    scoreMid: "text-warning",
    scoreLow: "text-destructive",
    playBg: "bg-primary/10",
    playIcon: "text-primary",
  },
  success: {
    activeBg: "bg-success/5",
    activeBorder: "border-success/30",
    activeIcon: "bg-success text-success-foreground",
    hoverIcon: "group-hover:bg-success/10 group-hover:text-success",
    scoreHigh: "text-success",
    scoreMid: "text-warning",
    scoreLow: "text-destructive",
    playBg: "bg-success/10",
    playIcon: "text-success",
  },
  accent: {
    activeBg: "bg-accent/5",
    activeBorder: "border-accent/30",
    activeIcon: "bg-accent text-accent-foreground",
    hoverIcon: "group-hover:bg-accent/10 group-hover:text-accent",
    scoreHigh: "text-success",
    scoreMid: "text-warning",
    scoreLow: "text-destructive",
    playBg: "bg-accent/10",
    playIcon: "text-accent",
  },
  purple: {
    activeBg: "bg-[hsl(var(--purple)/0.05)]",
    activeBorder: "border-[hsl(var(--purple)/0.3)]",
    activeIcon: "bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))]",
    hoverIcon: "group-hover:bg-[hsl(var(--purple)/0.1)] group-hover:text-[hsl(var(--purple))]",
    scoreHigh: "text-success",
    scoreMid: "text-warning",
    scoreLow: "text-destructive",
    playBg: "bg-[hsl(var(--purple)/0.1)]",
    playIcon: "text-[hsl(var(--purple))]",
  },
};

const difficultyDots = (level: number) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-1.5 h-1.5 rounded-full transition-colors ${
          i <= level
            ? level <= 2 ? "bg-success" : level <= 3 ? "bg-warning" : "bg-destructive"
            : "bg-border"
        }`}
      />
    ))}
    <span className="text-[9px] text-muted-foreground ml-1">
      {level <= 2 ? "Easy" : level <= 3 ? "Medium" : "Hard"}
    </span>
  </div>
);

/* ─── Expanded Card Detail (shown on click) ─── */
const CardDetail = ({
  qt,
  theme,
  onTrySample,
  onClose,
}: {
  qt: QuestionType;
  theme: (typeof themeMap)["primary"];
  onTrySample?: (id: string) => void;
  onClose: () => void;
}) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="col-span-full bg-card rounded-xl border border-border p-4 animate-fade-in space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.activeIcon}`}>
            <qt.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{qt.label}</h3>
            {qt.description && (
              <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{qt.description}</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors press">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Video thumbnail */}
        <button
          onClick={() => setVideoPlaying(!videoPlaying)}
          className="relative w-full sm:w-48 h-28 rounded-lg bg-secondary overflow-hidden group/vid shrink-0 press"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            {videoPlaying ? (
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: 8 + Math.random() * 12, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full ${theme.playBg} flex items-center justify-center group-hover/vid:scale-110 transition-transform`}>
                <Play className={`w-5 h-5 ${theme.playIcon} ml-0.5`} />
              </div>
            )}
            <span className="text-[10px] font-semibold text-muted-foreground">
              {videoPlaying ? "Playing demo..." : "30s Demo"}
            </span>
          </div>
          <div className="absolute bottom-1.5 right-1.5 bg-foreground/70 text-background text-[9px] font-bold px-1.5 py-0.5 rounded">
            0:30
          </div>
        </button>

        {/* Stats & info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg time: <span className="font-semibold text-foreground">{qt.avgTime || "~2 min"}</span>/question</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5" />
              <span>Your avg: <span className="font-semibold text-foreground">{qt.avgScore || "—"}</span></span>
            </div>
            {qt.difficulty && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {difficultyDots(qt.difficulty)}
              </div>
            )}
          </div>

          {/* Common mistakes */}
          {qt.commonMistakes && qt.commonMistakes.length > 0 && (
            <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
              <p className="text-[10px] font-bold text-destructive uppercase mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Common Mistakes
              </p>
              <ul className="space-y-1">
                {qt.commonMistakes.map((m, i) => (
                  <li key={i} className="text-[11px] text-foreground flex items-start gap-1.5">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Try sample CTA */}
          <div className="flex gap-2">
            <button
              onClick={() => onTrySample?.(qt.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${theme.playBg} ${theme.playIcon} hover:opacity-80 transition-opacity press`}
            >
              <Zap className="w-3.5 h-3.5" />
              Try 1 Sample Question
            </button>
            <button
              onClick={() => onTrySample?.(qt.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-colors press"
            >
              All {qt.count} tests <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionTypeBrowser = ({
  types,
  activeType,
  onSelectType,
  onTrySample,
  themeColor = "primary",
  columns = 3,
}: QuestionTypeBrowserProps) => {
  const theme = themeMap[themeColor];
  const activeQt = types.find((t) => t.id === activeType);

  return (
    <div>
      {/* Desktop/Tablet: Grid */}
      <div className={`hidden sm:grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {types.map((qt) => {
          const Icon = qt.icon;
          const isActive = activeType === qt.id;
          const scoreNum = qt.avgScore ? parseFloat(String(qt.avgScore)) : null;

          return (
            <button
              key={qt.id}
              onClick={() => onSelectType(isActive ? "" : qt.id)}
              className={`rounded-xl p-4 text-left transition-all duration-200 press focus-ring border group ${
                isActive
                  ? `${theme.activeBg} ${theme.activeBorder} shadow-sm`
                  : "bg-card border-border hover:shadow-card"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-200 ${
                isActive ? theme.activeIcon : `bg-secondary text-muted-foreground ${theme.hoverIcon}`
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{qt.label}</p>

              {/* 1-sentence description */}
              {qt.description && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{qt.description}</p>
              )}

              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground">{qt.count} tests</span>
                {qt.avgTime && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {qt.avgTime}
                  </span>
                )}
              </div>

              {/* Avg score */}
              {scoreNum !== null && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Your avg:</span>
                  <span className={`text-xs font-bold ${
                    scoreNum >= 7 ? theme.scoreHigh : scoreNum >= 6 ? theme.scoreMid : theme.scoreLow
                  }`}>
                    {qt.avgScore}
                  </span>
                </div>
              )}

              {/* Difficulty */}
              {qt.difficulty && (
                <div className="mt-2">
                  {difficultyDots(qt.difficulty)}
                </div>
              )}

              {/* Practice CTA */}
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                Practice <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}

        {/* Expanded detail panel */}
        {activeQt && (
          <CardDetail
            qt={activeQt}
            theme={theme}
            onTrySample={onTrySample}
            onClose={() => onSelectType("")}
          />
        )}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {types.map((qt) => {
            const Icon = qt.icon;
            const isActive = activeType === qt.id;
            const scoreNum = qt.avgScore ? parseFloat(String(qt.avgScore)) : null;

            return (
              <button
                key={qt.id}
                onClick={() => onSelectType(isActive ? "" : qt.id)}
                className={`shrink-0 w-[160px] rounded-xl p-3.5 text-left transition-all duration-200 press focus-ring border ${
                  isActive
                    ? `${theme.activeBg} ${theme.activeBorder} shadow-sm`
                    : "bg-card border-border"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-all duration-200 ${
                  isActive ? theme.activeIcon : "bg-secondary text-muted-foreground"
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <p className="text-xs font-semibold text-foreground truncate">{qt.label}</p>
                {qt.description && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{qt.description}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-0.5">{qt.count} tests</p>
                {scoreNum !== null && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3 h-3 text-muted-foreground" />
                    <span className={`text-[10px] font-bold ${
                      scoreNum >= 7 ? theme.scoreHigh : scoreNum >= 6 ? theme.scoreMid : theme.scoreLow
                    }`}>
                      {qt.avgScore}
                    </span>
                  </div>
                )}
                {qt.difficulty && <div className="mt-1.5">{difficultyDots(qt.difficulty)}</div>}
              </button>
            );
          })}
        </div>

        {/* Mobile expanded detail */}
        {activeQt && (
          <div className="mt-3">
            <CardDetail
              qt={activeQt}
              theme={theme}
              onTrySample={onTrySample}
              onClose={() => onSelectType("")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionTypeBrowser;