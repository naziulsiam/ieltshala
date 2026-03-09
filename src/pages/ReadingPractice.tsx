import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Play, Clock, CheckCircle2, ChevronRight,
  RotateCcw, Sparkles, FileText, List, AlignLeft, ScanSearch,
  Table2, PenLine, Timer, Highlighter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListItemSkeleton } from "@/components/ui/skeleton-loaders";
import QuestionTypeBrowser from "@/components/QuestionTypeBrowser";
import NextRecommendation from "@/components/NextRecommendation";

/* ─── Question Types (2x3 Grid) ─── */
const questionTypes = [
  { id: "heading", icon: List, label: "Matching Headings", count: 15, avgScore: "7.2", difficulty: 2, description: "Match headings to paragraphs by identifying the main idea of each section.", avgTime: "~2 min", commonMistakes: ["Choosing headings based on single keywords", "Confusing main idea with supporting detail", "Not eliminating used headings systematically"] },
  { id: "tfng", icon: FileText, label: "T/F/Not Given", count: 15, avgScore: "5.8", difficulty: 4, description: "Decide if statements agree with, contradict, or are not mentioned in the passage.", avgTime: "~2.5 min", commonMistakes: ["Confusing 'False' with 'Not Given'", "Using outside knowledge instead of passage content", "Not checking qualifiers like 'all', 'some', 'never'"] },
  { id: "summary", icon: AlignLeft, label: "Summary Completion", count: 12, avgScore: "6.5", difficulty: 3, description: "Complete a summary with words from the passage or a provided list.", avgTime: "~2 min", commonMistakes: ["Using words not from the passage when required", "Ignoring grammar clues (singular/plural, tense)", "Not reading the full summary before answering"] },
  { id: "mcq", icon: ScanSearch, label: "Multiple Choice", count: 10, avgScore: "7.0", difficulty: 3, description: "Select the correct answer from options based on passage details or inference.", avgTime: "~2.5 min", commonMistakes: ["Falling for distractors with passage words but wrong meaning", "Not identifying the question scope (detail vs. main idea)", "Spending too long on one question"] },
  { id: "short", icon: PenLine, label: "Short Answer", count: 8, avgScore: "6.2", difficulty: 3, description: "Write brief answers using words directly from the reading passage.", avgTime: "~1.5 min", commonMistakes: ["Exceeding the word limit", "Paraphrasing instead of using passage words", "Missing the specific location in the text"] },
  { id: "diagram", icon: Table2, label: "Diagram Labeling", count: 6, avgScore: "6.9", difficulty: 2, description: "Label parts of a diagram or flowchart using information from the text.", avgTime: "~1.5 min", commonMistakes: ["Not following the diagram's logical order", "Confusing similar-looking parts", "Missing specific technical terms from the passage"] },
];

/* ─── Passages ─── */
interface Passage {
  id: string;
  title: string;
  type: string;
  duration: string;
  questions: number;
  progress: number;
  status: "new" | "in-progress" | "completed";
  difficulty: "easy" | "medium" | "hard";
  topicTag: string;
}

const passages: Passage[] = [
  { id: "1", title: "The Rise of Urban Farming", type: "tfng", duration: "20 min", questions: 14, progress: 0, status: "new", difficulty: "medium", topicTag: "🌿 Environment" },
  { id: "2", title: "Ancient Mesopotamia", type: "heading", duration: "20 min", questions: 13, progress: 100, status: "completed", difficulty: "medium", topicTag: "📜 History" },
  { id: "3", title: "AI Ethics in Healthcare", type: "summary", duration: "20 min", questions: 14, progress: 60, status: "in-progress", difficulty: "hard", topicTag: "💻 Technology" },
  { id: "4", title: "Ocean Acidification", type: "tfng", duration: "20 min", questions: 13, progress: 0, status: "new", difficulty: "hard", topicTag: "🌊 Science" },
  { id: "5", title: "The Gig Economy", type: "mcq", duration: "20 min", questions: 14, progress: 0, status: "new", difficulty: "medium", topicTag: "💼 Work" },
  { id: "6", title: "Renewable Energy Sources", type: "diagram", duration: "18 min", questions: 12, progress: 100, status: "completed", difficulty: "easy", topicTag: "⚡ Science" },
  { id: "7", title: "Memory & Learning", type: "short", duration: "20 min", questions: 13, progress: 0, status: "new", difficulty: "easy", topicTag: "🧠 Psychology" },
  { id: "8", title: "Global Migration Patterns", type: "heading", duration: "20 min", questions: 14, progress: 40, status: "in-progress", difficulty: "medium", topicTag: "🌍 Social" },
];

const difficultyConfig = {
  easy: { label: "Easy", bg: "bg-success/10", text: "text-success", dot: "bg-success" },
  medium: { label: "Medium", bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
  hard: { label: "Hard", bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
};

/* ─── Reading Player with Timer, Highlights, Question Dots ─── */
const passageText = [
  "The rapid growth of urban populations worldwide has given rise to an innovative approach to food production known as urban farming. This practice, which involves cultivating crops and raising animals within city boundaries, has gained significant momentum in recent years as cities grapple with food security challenges.",
  "Unlike traditional agriculture, urban farming utilizes unconventional spaces such as rooftops, abandoned lots, and vertical structures. Proponents argue that this approach reduces transportation costs and carbon emissions associated with moving food from rural areas to urban centers. Furthermore, it provides fresh produce to communities that might otherwise lack access to nutritious food options.",
  "Critics, however, point out that urban farming cannot match the scale of conventional agriculture. The limited space available in cities means that production volumes remain relatively small compared to rural farms. Additionally, concerns about soil contamination in urban areas and the potential for conflicts with other land uses present ongoing challenges.",
  "Despite these limitations, cities around the world are increasingly incorporating urban agriculture into their planning strategies. Singapore, for instance, aims to produce 30% of its nutritional needs domestically by 2030, with urban farms playing a central role in this ambition. Similarly, Detroit has transformed thousands of vacant lots into productive gardens, creating both food and employment opportunities for local residents.",
  "The economic viability of urban farming varies significantly depending on the model employed. Community gardens, which rely largely on volunteer labor, operate at minimal cost but produce modest yields. In contrast, high-tech vertical farms using hydroponics and artificial lighting can achieve impressive productivity but require substantial capital investment.",
];

const tfngQuestions = [
  "Urban farming has become more popular in recent years.",
  "Traditional agriculture uses the same spaces as urban farming.",
  "Urban farming eliminates all carbon emissions from food production.",
  "Singapore aims to produce 30% of its food locally by 2030.",
  "Detroit's urban farming program has been unsuccessful.",
];

const ReadingPlayer = ({ passage, onClose }: { passage: Passage; onClose: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 min
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const totalQ = tfngQuestions.length;
  const answered = Object.keys(answers).length;
  const isLowTime = timeLeft < 5 * 60;

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleTextSelect = useCallback(() => {
    if (!highlightMode) return;
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      setHighlights((h) => [...h, sel.toString().trim()]);
      sel.removeAllRanges();
    }
  }, [highlightMode]);

  const toggleAnswer = (qIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: prev[qIndex] === value ? null : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{passage.title}</p>
          <p className="text-xs text-muted-foreground">{passage.topicTag}</p>
        </div>

        {/* Question progress dots */}
        <div className="hidden sm:flex items-center gap-1 mr-2">
          {Array.from({ length: totalQ }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                answers[i] != null ? "bg-success" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
          isLowTime ? "bg-destructive/10 text-destructive animate-pulse" : "bg-secondary text-foreground"
        }`}>
          <Timer className="w-3.5 h-3.5" />
          {fmt(timeLeft)}
        </div>
      </div>

      {/* Tools bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
        <button
          onClick={() => setHighlightMode(!highlightMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors press ${
            highlightMode ? "bg-warning/15 text-warning border border-warning/30" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          Highlight
        </button>
        <span className="text-xs text-muted-foreground ml-auto">
          {answered}/{totalQ} answered
        </span>
        {/* Mobile question dots */}
        <div className="flex sm:hidden items-center gap-1">
          {Array.from({ length: totalQ }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                answers[i] != null ? "bg-success" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Split content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Passage */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 border-b md:border-b-0 md:border-r border-border"
          onMouseUp={handleTextSelect}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">{passage.title}</h2>
          <div className="text-sm text-foreground leading-relaxed space-y-3">
            {passageText.map((para, i) => (
              <p key={i}>
                {highlights.some((h) => para.includes(h))
                  ? para.split(new RegExp(`(${highlights.filter((h) => para.includes(h)).map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi")).map((part, j) =>
                      highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
                        <mark key={j} className="bg-warning/20 text-foreground px-0.5 rounded">{part}</mark>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )
                  : para}
              </p>
            ))}
          </div>
          {highlightMode && highlights.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Your Highlights</p>
              <div className="flex flex-wrap gap-1.5">
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-warning/10 text-warning px-2 py-1 rounded-full cursor-pointer hover:bg-warning/20 transition-colors"
                    onClick={() => setHighlights((prev) => prev.filter((_, j) => j !== i))}
                  >
                    "{h.slice(0, 30)}{h.length > 30 ? "..." : ""}" ×
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-1">Questions 1–{totalQ}</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Do the following statements agree with the information given in the passage? Write{" "}
            <span className="font-semibold text-foreground">TRUE</span>,{" "}
            <span className="font-semibold text-foreground">FALSE</span>, or{" "}
            <span className="font-semibold text-foreground">NOT GIVEN</span>.
          </p>
          <div className="space-y-5">
            {tfngQuestions.map((q, i) => (
              <div key={i} className="space-y-2">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold mr-2 ${
                    answers[i] != null ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                  {q}
                </p>
                <div className="flex gap-2 pl-8">
                  {["True", "False", "Not Given"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleAnswer(i, opt)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 press focus-ring min-h-[36px] ${
                        answers[i] === opt
                          ? "bg-success text-success-foreground shadow-sm"
                          : "border border-border text-foreground hover:bg-success/10 hover:border-success/30"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit bar */}
      <div className="border-t border-border bg-card px-4 py-3 pb-safe shrink-0 flex items-center gap-3">
        <div className="flex-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{answered}</span>/{totalQ} answered
        </div>
        <Button className="h-12 px-8 text-sm" disabled={answered < totalQ}>
          Submit Answers
        </Button>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const ReadingPractice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");
  const [activePassage, setActivePassage] = useState<Passage | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeType === "all" || activeType === "" ? passages : passages.filter((p) => p.type === activeType);

  if (activePassage) {
    return <ReadingPlayer passage={activePassage} onClose={() => setActivePassage(null)} />;
  }

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-8 text-foreground">Reading Practice</h1>
          <p className="text-sm text-muted-foreground mt-0.5">56 passages • 8 completed</p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center gap-3 bg-success/5 rounded-xl p-4 border border-success/15">
        <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-success-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Focus: True/False/Not Given</p>
          <p className="text-xs text-muted-foreground mt-0.5">Accuracy dropped 15% — practice paraphrases</p>
        </div>
        <Button size="sm" className="h-8 text-xs shrink-0" onClick={() => setActiveType("tfng")}>
          Practice
        </Button>
      </div>

      {/* Question Type Browser */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">By Question Type</h2>
        <QuestionTypeBrowser
          types={questionTypes}
          activeType={activeType}
          onSelectType={(id) => setActiveType(id || "all")}
          themeColor="success"
          columns={3}
        />
      </div>

      {/* Next Recommendation */}
      <NextRecommendation
        title="True/False/Not Given Practice"
        subtitle="Accuracy dropped 15% — focus on paraphrasing."
        route="/practice/reading"
        themeColor="success"
      />

      {/* Passage List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            {activeType === "all" || activeType === "" ? "All Passages" : questionTypes.find((q) => q.id === activeType)?.label} ({filtered.length})
          </h2>
          {activeType !== "all" && activeType !== "" && (
            <button
              onClick={() => setActiveType("all")}
              className="text-xs font-medium text-primary hover:underline underline-offset-2"
            >
              Show All
            </button>
          )}
        </div>
        <div className="space-y-3">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <ListItemSkeleton />
                </div>
              ))
            : filtered.map((passage) => {
                const diff = difficultyConfig[passage.difficulty];
                return (
                  <button
                    key={passage.id}
                    onClick={() => setActivePassage(passage)}
                    className="w-full bg-card rounded-xl border border-border p-4 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        passage.status === "completed"
                          ? "bg-success/10"
                          : passage.status === "in-progress"
                          ? "bg-success/10"
                          : "bg-secondary group-hover:bg-success/10"
                      }`}>
                        {passage.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <BookOpen className={`w-5 h-5 ${passage.status === "in-progress" ? "text-success" : "text-muted-foreground group-hover:text-success"} transition-colors`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{passage.title}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${diff.bg} ${diff.text}`}>
                            {diff.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{passage.topicTag}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {passage.duration}</span>
                          <span className="text-xs text-muted-foreground">{passage.questions}Q</span>
                        </div>
                        {passage.progress > 0 && (
                          <div className="mt-2 space-y-1">
                            <Progress value={passage.progress} className="h-1.5" />
                            <p className="text-[11px] text-muted-foreground">{passage.progress}%</p>
                          </div>
                        )}
                        <div className="mt-2.5 flex items-center gap-2">
                          {passage.status === "in-progress" ? (
                            <>
                              <span className="text-xs font-semibold text-success flex items-center gap-1"><Play className="w-3 h-3" /> Continue</span>
                              <span className="text-border">|</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Restart</span>
                            </>
                          ) : passage.status === "completed" ? (
                            <>
                              <span className="text-xs font-semibold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
                              <span className="text-border">|</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retake</span>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-success flex items-center gap-1 group-hover:underline underline-offset-2">
                              Start Reading <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default ReadingPractice;
