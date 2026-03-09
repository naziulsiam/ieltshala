import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mic, MicOff, Play, Pause, RotateCcw, Volume2,
  Sparkles, ChevronRight, Clock, CheckCircle2, MessageSquare,
  Users, FileText, Timer, Target, Zap, BookOpen, Square,
  AlertCircle, Lightbulb, BarChart3, Type, BookA, PenTool,
  ArrowUpRight, ArrowDownRight, Minus, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ─── Types & Data ─── */
interface SpeakingTopic {
  id: string;
  part: "part1" | "part2" | "part3";
  title: string;
  question: string;
  followUps?: string[];
  duration: string;
  status: "new" | "practiced" | "scored";
  lastScore?: number;
  tips?: string[];
}

type PracticeMode = "ai-interview" | "quickfire" | "cuecard";

const partConfig = {
  part1: { label: "Part 1", subtitle: "Introduction & Interview", icon: MessageSquare, duration: "4-5 min", color: "bg-[hsl(var(--purple))]", lightBg: "bg-[hsl(var(--purple)/0.1)]", text: "text-[hsl(var(--purple))]" },
  part2: { label: "Part 2", subtitle: "Long Turn (Cue Card)", icon: FileText, duration: "3-4 min", color: "bg-[hsl(var(--purple))]", lightBg: "bg-[hsl(var(--purple)/0.1)]", text: "text-[hsl(var(--purple))]" },
  part3: { label: "Part 3", subtitle: "Discussion", icon: Users, duration: "4-5 min", color: "bg-[hsl(var(--purple))]", lightBg: "bg-[hsl(var(--purple)/0.1)]", text: "text-[hsl(var(--purple))]" },
};

const topics: SpeakingTopic[] = [
  { id: "1", part: "part1", title: "Hometown", question: "Can you describe your hometown? What do you like most about living there?", followUps: ["Is your hometown a good place for young people?", "Has your hometown changed much recently?", "What would you improve about your hometown?"], duration: "5 min", status: "scored", lastScore: 6.5, tips: ["Use descriptive adjectives", "Compare past and present", "Give specific examples"] },
  { id: "2", part: "part1", title: "Work & Studies", question: "Do you work or are you a student? What do you enjoy about it?", followUps: ["What do you plan to do in the future?", "Is it a popular field in your country?"], duration: "5 min", status: "practiced", tips: ["Use present perfect for experience", "Show enthusiasm naturally"] },
  { id: "3", part: "part1", title: "Daily Routine", question: "Can you describe a typical day for you?", followUps: ["Do you prefer mornings or evenings?", "Has your routine changed recently?"], duration: "5 min", status: "new", tips: ["Use time connectors", "Vary sentence structure"] },
  { id: "4", part: "part2", title: "A Memorable Trip", question: "Describe a place you visited recently that left a strong impression on you.\n\nYou should say:\n• where you went\n• when you went there\n• what you did there\n\nAnd explain why it left a strong impression.", duration: "3 min", status: "scored", lastScore: 7.0, tips: ["Use past tense consistently", "Describe feelings and emotions", "Add sensory details (sight, sound, smell)"] },
  { id: "5", part: "part2", title: "A Skill You Learned", question: "Describe a skill you learned that you are proud of.\n\nYou should say:\n• what the skill is\n• how you learned it\n• how long it took\n\nAnd explain why you are proud of it.", duration: "3 min", status: "new", tips: ["Structure: what → how → why", "Use 'initially', 'gradually', 'eventually'", "Express personal growth"] },
  { id: "6", part: "part2", title: "A Person You Admire", question: "Describe a person you admire.\n\nYou should say:\n• who this person is\n• how you know them\n• what they have achieved\n\nAnd explain why you admire them.", duration: "3 min", status: "new", tips: ["Use character adjectives", "Give concrete achievements", "Explain personal impact"] },
  { id: "7", part: "part3", title: "Technology & Society", question: "Do you think technology has made people's lives better or worse?", followUps: ["Should children be limited in their use of technology?", "How will AI change the workforce?", "Is social media harmful for democracy?"], duration: "5 min", status: "new", tips: ["Present both sides", "Use 'On the one hand... on the other'", "Support with examples"] },
  { id: "8", part: "part3", title: "Education Systems", question: "Do you think the education system in your country prepares students well for the future?", followUps: ["Should university education be free?", "What skills should schools teach that they currently don't?"], duration: "5 min", status: "scored", lastScore: 6.0, tips: ["Compare with other countries", "Suggest improvements", "Use conditional structures"] },
  { id: "9", part: "part3", title: "Environment", question: "What do you think individuals can do to help protect the environment?", followUps: ["Is it the government's responsibility or individuals'?", "Will technology solve environmental problems?"], duration: "5 min", status: "new", tips: ["Use modal verbs for suggestions", "Give concrete examples", "Discuss responsibility"] },
];

interface PhonemeIssue { phoneme: string; word: string; tip: string; score: number; }

const mockTranscript = "I think the education system in my country has both strengths and weaknesses. While there is a strong emphasis on theoretical knowledge, practical skills are often overlooked. Furthermore, the curriculum should be updated to reflect the changing demands of the global workforce.";

const modelAnswer = "In my view, the education system in my country possesses both considerable strengths and notable shortcomings. On one hand, there is a commendable emphasis on building a solid theoretical foundation across academic subjects. However, I would argue that practical, real-world skills tend to be somewhat neglected in the current curriculum. Moreover, I firmly believe the syllabus ought to be periodically revised to align with the evolving demands of an increasingly globalised workforce.";

const phonemeIssues: PhonemeIssue[] = [
  { phoneme: "θ (th)", word: "think", tip: "Place tongue between teeth and blow air gently.", score: 62 },
  { phoneme: "ɜː (ur)", word: "furthermore", tip: "Round your lips slightly — 'fur-thuh-more'.", score: 71 },
  { phoneme: "ʃ (sh)", word: "should", tip: "Push lips forward for a clearer 'sh' sound.", score: 78 },
  { phoneme: "ɪ (short i)", word: "system", tip: "Keep it short — don't stretch to 'ee'.", score: 85 },
  { phoneme: "ɒ (short o)", word: "knowledge", tip: "Excellent pronunciation! Clear rounded vowel.", score: 94 },
];

const feedbackSections = [
  { label: "Fluency & Coherence", score: 6.5, feedback: "Good flow. Reduce fillers and link ideas with 'moreover', 'consequently'." },
  { label: "Pronunciation", score: 6.0, feedback: "Work on 'th' sounds and word stress. Intonation is natural." },
  { label: "Lexical Resource", score: 7.0, feedback: "Great vocabulary range. Add more idiomatic expressions." },
  { label: "Grammar Range", score: 6.5, feedback: "Good passive voice usage. Try 'Had it not been for...' structures." },
];

const fluencyStats = {
  wpm: 142,
  avgWpm: 150,
  totalPauses: 6,
  longPauses: 2,
  fillerWords: 3,
  fillers: ["um", "uh", "like"],
};

const vocabStats = {
  totalWords: 52,
  uniqueWords: 38,
  academicWords: 8,
  academicList: ["theoretical", "emphasis", "practical", "curriculum", "updated", "demands", "global", "workforce"],
  lexicalDensity: 73,
};

const grammarErrors: { original: string; correction: string; type: string; severity: "error" | "suggestion" }[] = [
  { original: "practical skills are often overlooked", correction: "practical skills are frequently overlooked", type: "Vocabulary upgrade", severity: "suggestion" },
  { original: "the curriculum should be updated", correction: "the curriculum ought to be updated", type: "Modal variety", severity: "suggestion" },
  { original: "changing demands", correction: "evolving demands", type: "Collocation", severity: "suggestion" },
];

const modeCards: { id: PracticeMode; icon: typeof Mic; emoji: string; title: string; subtitle: string; duration: string; gradient: string }[] = [
  { id: "ai-interview", icon: Mic, emoji: "🤖", title: "AI Interview", subtitle: "Full simulation with AI examiner", duration: "~14 min", gradient: "from-[hsl(var(--purple))] to-[hsl(271,91%,45%)]" },
  { id: "quickfire", icon: Zap, emoji: "🎯", title: "Part 1 Quick Fire", subtitle: "5-min warm-up questions", duration: "5 min", gradient: "from-[hsl(var(--accent))] to-[hsl(24,94%,42%)]" },
  { id: "cuecard", icon: BookOpen, emoji: "📝", title: "Cue Card Practice", subtitle: "2-minute monologue training", duration: "3 min", gradient: "from-[hsl(var(--success))] to-[hsl(160,84%,28%)]" },
];

/* ─── Voice Wave ─── */
const VoiceWave = ({ active, speaking }: { active: boolean; speaking?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const barsRef = useRef<number[]>(Array(32).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    const barCount = 32;
    const barWidth = w / barCount - 2;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < barCount; i++) {
        const target = active
          ? (speaking
            ? (Math.sin(Date.now() / 200 + i * 0.5) * 0.3 + 0.5) * h * (0.3 + Math.random() * 0.4)
            : Math.random() * h * 0.7)
          : h * 0.05;
        barsRef.current[i] += (target - barsRef.current[i]) * 0.15;
        const barH = Math.max(3, barsRef.current[i]);
        const x = i * (barWidth + 2);
        const y = (h - barH) / 2;
        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        if (speaking) {
          gradient.addColorStop(0, "hsl(271, 91%, 65%)");
          gradient.addColorStop(1, "hsl(271, 91%, 45%)");
        } else {
          gradient.addColorStop(0, "hsl(24, 94%, 60%)");
          gradient.addColorStop(1, "hsl(24, 94%, 45%)");
        }
        ctx.fillStyle = active ? gradient : "hsl(215, 16%, 80%)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, speaking]);

  return <canvas ref={canvasRef} width={320} height={80} className="w-full max-w-xs h-16" />;
};

/* ─── AI Interview Session ─── */
type InterviewStage = "listening" | "recording" | "analyzing" | "review";

const AIInterviewSession = ({ topic, mode, onBack }: { topic: SpeakingTopic; mode: PracticeMode; onBack: () => void }) => {
  const [stage, setStage] = useState<InterviewStage>("listening");
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const maxTime = topic.part === "part2" ? 120 : 60;
  const [timer, setTimer] = useState(maxTime);
  const [currentPart, setCurrentPart] = useState(1);
  const totalParts = mode === "ai-interview" ? 3 : 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = mode === "quickfire" ? 5 : (topic.followUps ? topic.followUps.length + 1 : 1);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const config = partConfig[topic.part];

  const pronunciationScore = Math.round(phonemeIssues.reduce((a, b) => a + b.score, 0) / phonemeIssues.length);
  const overallBand = (feedbackSections.reduce((a, b) => a + b.score, 0) / feedbackSections.length).toFixed(1);

  useEffect(() => {
    const t = setTimeout(() => { setAiSpeaking(false); setStage("recording"); }, 3000);
    return () => clearTimeout(t);
  }, []);

  const startRecording = () => {
    setRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(timerRef.current); setRecording(false); return 0; } return t - 1; });
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    setStage("analyzing");
    setTimeout(() => setStage("review"), 2500);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const progressPct = maxTime > 0 ? ((maxTime - timer) / maxTime) * 100 : 0;

  /* ─── Review Screen ─── */
  const [reviewTab, setReviewTab] = useState<"overview" | "fluency" | "vocab" | "grammar" | "compare">("overview");

  if (stage === "review") {
    const reviewTabs = [
      { id: "overview" as const, label: "Overview", icon: BarChart3 },
      { id: "fluency" as const, label: "Fluency", icon: Timer },
      { id: "vocab" as const, label: "Vocabulary", icon: BookA },
      { id: "grammar" as const, label: "Grammar", icon: PenTool },
      { id: "compare" as const, label: "Compare", icon: Copy },
    ];

    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto pb-28 md:pb-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{topic.title} — Results</h1>
            <p className="text-xs text-muted-foreground">{config.label} • {config.subtitle}</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-[hsl(var(--purple))]">{overallBand}</span>
            <p className="text-[10px] text-muted-foreground">Overall</p>
          </div>
        </div>

        {/* Review Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {reviewTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all press shrink-0 ${
                  reviewTab === tab.id
                    ? "bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))] shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── Overview Tab ─── */}
        {reviewTab === "overview" && (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 space-y-4">
              {/* Transcript */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Your Transcript</span>
                  <button className="text-xs font-medium text-[hsl(var(--purple))] flex items-center gap-1 press">
                    <Play className="w-3 h-3" /> Playback
                  </button>
                </div>
                <p className="p-5 text-sm leading-relaxed text-foreground">{mockTranscript}</p>
              </div>

              {/* Band Scores */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-bold text-foreground mb-4">Band Score Breakdown</h3>
                <div className="space-y-4">
                  {feedbackSections.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{s.label}</span>
                        <span className={`font-bold ${s.score >= 7 ? "text-success" : s.score >= 6.5 ? "text-warning" : "text-destructive"}`}>{s.score}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s.score / 9) * 100}%`, backgroundColor: s.score >= 7 ? "hsl(var(--success))" : s.score >= 6.5 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{s.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1 bg-[hsl(var(--purple))] hover:bg-[hsl(var(--purple)/0.9)]" onClick={onBack}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Practice Again
                </Button>
                <Button variant="outline" size="lg" onClick={onBack}>New Topic</Button>
              </div>
            </div>

            {/* Pronunciation Panel */}
            <div className="w-full lg:w-96 shrink-0 space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-2">Pronunciation Score</p>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={pronunciationScore >= 80 ? "hsl(var(--success))" : pronunciationScore >= 65 ? "hsl(var(--warning))" : "hsl(var(--destructive))"} strokeWidth="7" strokeDasharray={`${(pronunciationScore / 100) * 263.9} 263.9`} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-foreground">{pronunciationScore}</span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="font-bold text-sm text-foreground">Phoneme Feedback</h3>
                </div>
                <div className="divide-y divide-border">
                  {phonemeIssues.map((p, i) => (
                    <div key={i} className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${p.score >= 90 ? "bg-success/10 text-success" : p.score >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{p.phoneme}</span>
                        <span className="text-xs text-foreground">in "<span className="font-bold">{p.word}</span>"</span>
                        <span className={`text-xs font-bold ml-auto ${p.score >= 90 ? "text-success" : p.score >= 75 ? "text-warning" : "text-destructive"}`}>{p.score}</span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden mb-1.5">
                        <div className={`h-full rounded-full ${p.score >= 90 ? "bg-success" : p.score >= 75 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${p.score}%` }} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">💡 {p.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Fluency Tab ─── */}
        {reviewTab === "fluency" && (
          <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{fluencyStats.wpm}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Words/min</p>
                <div className="flex items-center justify-center gap-1 mt-1.5">
                  {fluencyStats.wpm >= fluencyStats.avgWpm ? (
                    <ArrowUpRight className="w-3 h-3 text-success" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-warning" />
                  )}
                  <span className={`text-[10px] font-semibold ${fluencyStats.wpm >= fluencyStats.avgWpm ? "text-success" : "text-warning"}`}>
                    vs {fluencyStats.avgWpm} avg
                  </span>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{fluencyStats.totalPauses}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Pauses</p>
                <p className="text-[10px] text-warning font-semibold mt-1.5">{fluencyStats.longPauses} long ({">"}2s)</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{fluencyStats.fillerWords}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Fillers</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{fluencyStats.fillers.join(", ")}</p>
              </div>
            </div>

            {/* Pause analysis */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm text-foreground mb-3">Speech Flow Timeline</h3>
              <div className="flex items-center gap-1 h-10">
                {[0.8, 0.6, 1, 0.9, 0.3, 0.7, 0.85, 0.1, 0.95, 0.7, 0.6, 0.8, 0.9, 0.2, 0.7, 0.85, 0.9, 0.75, 0.6, 0.8].map((v, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all ${v < 0.3 ? "bg-warning" : "bg-[hsl(var(--purple))]"}`}
                    style={{ height: `${v * 100}%`, opacity: Math.max(0.3, v) }}
                    title={v < 0.3 ? "Pause detected" : `Speaking (${Math.round(v * 100)}% intensity)`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                <span>0:00</span>
                <span className="text-warning font-semibold">■ Pauses</span>
                <span>{fmt(maxTime - timer)}</span>
              </div>
            </div>

            <div className="bg-[hsl(var(--purple)/0.04)] rounded-xl p-4 border border-[hsl(var(--purple)/0.1)]">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[hsl(var(--purple))] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Fluency Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">Your WPM is slightly below average. Try linking more ideas with connectors like "moreover" and "in addition" to maintain flow. Aim for 150-170 WPM for Band 7.0.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Vocabulary Tab ─── */}
        {reviewTab === "vocab" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{vocabStats.totalWords}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Total Words</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{vocabStats.uniqueWords}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Unique Words</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-[hsl(var(--purple))]">{vocabStats.academicWords}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Academic Words</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{vocabStats.lexicalDensity}%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Lexical Density</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm text-foreground mb-3">Academic Words Used</h3>
              <div className="flex flex-wrap gap-2">
                {vocabStats.academicList.map((w) => (
                  <span key={w} className="text-xs font-medium bg-[hsl(var(--purple)/0.1)] text-[hsl(var(--purple))] px-3 py-1.5 rounded-full">
                    {w}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                Band 7.0 target: 10+ academic words. You used <span className="font-bold text-foreground">{vocabStats.academicWords}</span> — try adding "consequently", "predominantly", "inherently".
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm text-foreground mb-3">Suggested Upgrades</h3>
              <div className="space-y-2.5">
                {[
                  { from: "good", to: "commendable / beneficial" },
                  { from: "bad", to: "detrimental / adverse" },
                  { from: "important", to: "pivotal / paramount" },
                ].map((u) => (
                  <div key={u.from} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground line-through">{u.from}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="font-semibold text-[hsl(var(--purple))]">{u.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Grammar Tab ─── */}
        {reviewTab === "grammar" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-destructive">{grammarErrors.filter(e => e.severity === "error").length}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Errors</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-warning">{grammarErrors.filter(e => e.severity === "suggestion").length}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Suggestions</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-extrabold text-success">4</p>
                <p className="text-[10px] text-muted-foreground mt-1">Complex Structures</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">Corrections & Suggestions</h3>
              </div>
              <div className="divide-y divide-border">
                {grammarErrors.map((err, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        err.severity === "error" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                      }`}>
                        {err.type}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <div className="flex-1 bg-destructive/5 rounded-lg px-3 py-2 border border-destructive/10">
                        <p className="text-[10px] font-bold text-muted-foreground mb-0.5">YOUR VERSION</p>
                        <p className="text-foreground">{err.original}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 shrink-0" />
                      <div className="flex-1 bg-success/5 rounded-lg px-3 py-2 border border-success/10">
                        <p className="text-[10px] font-bold text-muted-foreground mb-0.5">IMPROVED</p>
                        <p className="text-foreground">{err.correction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Compare Tab ─── */}
        {reviewTab === "compare" && (
          <div className="space-y-4">
            <div className="bg-[hsl(var(--purple)/0.04)] rounded-xl p-4 border border-[hsl(var(--purple)/0.15)]">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-[hsl(var(--purple))]" />
                <span className="text-xs font-bold text-foreground">Band 7.0 Model Answer</span>
                <span className="text-[10px] font-semibold bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))] px-2 py-0.5 rounded-full ml-auto">Target Band</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{modelAnswer.split(" ").length} words (ideal for 7.0)</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Your Response</span>
                    <span className="text-xs font-bold text-[hsl(var(--purple))]">{overallBand}</span>
                  </div>
                </div>
                <p className="p-4 text-xs leading-relaxed text-foreground">{mockTranscript}</p>
              </div>
              <div className="bg-card rounded-xl border-2 border-[hsl(var(--purple)/0.2)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[hsl(var(--purple)/0.15)] bg-[hsl(var(--purple)/0.04)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">🎯 Model Answer</span>
                    <span className="text-xs font-bold text-success">7.0</span>
                  </div>
                </div>
                <p className="p-4 text-xs leading-relaxed text-foreground">{modelAnswer}</p>
              </div>
            </div>

            {/* Key differences */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-bold text-sm text-foreground mb-3">Key Differences to Reach 7.0</h3>
              <div className="space-y-3">
                {[
                  { area: "Cohesive Devices", yours: '"While", "Furthermore"', model: '"On one hand", "However", "Moreover", "I firmly believe"', icon: "🔗" },
                  { area: "Vocabulary Range", yours: '"strengths", "weaknesses", "updated"', model: '"commendable", "shortcomings", "periodically revised"', icon: "📚" },
                  { area: "Complex Grammar", yours: "Simple passive constructions", model: '"I would argue that…", "ought to be"', icon: "📐" },
                ].map((diff) => (
                  <div key={diff.area} className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-xs font-bold text-foreground mb-2">{diff.icon} {diff.area}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground mb-0.5">YOU</p>
                        <p className="text-muted-foreground">{diff.yours}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[hsl(var(--purple))] mb-0.5">BAND 7.0</p>
                        <p className="text-foreground">{diff.model}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── Interview Interface ─── */
  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto pb-28 md:pb-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[hsl(var(--purple))]" />
            <h1 className="text-base font-bold text-foreground truncate">
              {mode === "ai-interview" ? "Speaking Test in Progress" : mode === "quickfire" ? "Quick Fire — Part 1" : "Cue Card Practice"}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mode === "ai-interview" ? `Part ${currentPart} of ${totalParts}` : config.label} • {fmt(timer)} remaining
          </p>
        </div>
        {stage === "recording" && (
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${recording ? "bg-destructive/10 border border-destructive/30" : timer <= 30 ? "bg-warning/10 border border-warning/30 animate-pulse" : "bg-card border border-border"}`}>
            {recording && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            <Timer className={`w-3.5 h-3.5 ${recording ? "text-destructive" : timer <= 30 ? "text-warning" : "text-muted-foreground"}`} />
            <span className={`text-xs font-semibold tabular-nums ${recording ? "text-destructive" : timer <= 30 ? "text-warning" : "text-foreground"}`}>{fmt(timer)}</span>
          </div>
        )}
      </div>

      {/* Question progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < currentQuestion ? "bg-[hsl(var(--purple))]" :
              i === currentQuestion ? "bg-[hsl(var(--purple))] ring-4 ring-[hsl(var(--purple)/0.2)] scale-125" :
              "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="space-y-5">
        {/* AI Examiner Card */}
        <div className="bg-gradient-to-br from-[hsl(var(--purple)/0.06)] to-[hsl(var(--purple)/0.02)] rounded-2xl border border-[hsl(var(--purple)/0.15)] overflow-hidden">
          {/* Examiner header */}
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--purple))] to-[hsl(271,91%,45%)] flex items-center justify-center shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              {aiSpeaking && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-card">
                  <Volume2 className="w-3 h-3 text-success-foreground animate-pulse" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">AI Examiner</p>
              <p className="text-xs text-muted-foreground">
                {aiSpeaking ? "Speaking..." : "Waiting for your response"}
              </p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${aiSpeaking ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
              {aiSpeaking ? "● LIVE" : "● READY"}
            </span>
          </div>

          {/* Question bubble */}
          <div className="px-5 pb-5">
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{topic.question}</p>
              {topic.followUps && currentQuestion > 0 && currentQuestion <= topic.followUps.length && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] font-bold text-[hsl(var(--purple))] uppercase mb-1">Follow-up</p>
                  <p className="text-sm text-foreground">{topic.followUps[currentQuestion - 1]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Voice wave */}
          <div className="px-5 pb-5 flex justify-center">
            <VoiceWave active={aiSpeaking || recording} speaking={aiSpeaking} />
          </div>
        </div>

        {/* Your Response Section */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Your Response</p>
            {recording && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--purple))] rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums font-semibold text-foreground">{recordingTime}s</span>
              </div>
            )}
          </div>

          {/* Mic button area */}
          <div className="flex flex-col items-center gap-4 py-4">
            {stage === "listening" && aiSpeaking && (
              <p className="text-sm text-muted-foreground animate-pulse flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Listen to the examiner...
              </p>
            )}
            {stage === "recording" && !recording && (
              <p className="text-sm text-muted-foreground">Tap the mic to start your answer</p>
            )}
            {stage === "analyzing" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--purple)/0.1)] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-7 h-7 text-[hsl(var(--purple))]" />
                </div>
                <p className="text-sm font-medium text-[hsl(var(--purple))]">Analyzing your response...</p>
              </div>
            )}

            {stage === "recording" && !recording && (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))] flex items-center justify-center shadow-xl hover:scale-105 transition-transform pulse-glow"
              >
                <Mic className="w-8 h-8" />
              </button>
            )}
            {recording && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-bold text-destructive">Recording — {fmt(timer)}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  <Square className="w-7 h-7" />
                </button>
                <p className="text-xs text-muted-foreground">Tap to stop recording</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        {topic.tips && topic.tips.length > 0 && (
          <div className="bg-[hsl(var(--purple)/0.04)] rounded-xl p-4 border border-[hsl(var(--purple)/0.1)]">
            <div className="flex items-center gap-2 mb-2.5">
              <Lightbulb className="w-4 h-4 text-[hsl(var(--purple))]" />
              <span className="text-xs font-bold text-foreground">Tips for this question</span>
            </div>
            <ul className="space-y-1.5">
              {topic.tips.map((tip, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-[hsl(var(--purple))] mt-0.5 shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Main: Mode Selector + Topic Browser ─── */
const SpeakingPractice = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [activeTopic, setActiveTopic] = useState<SpeakingTopic | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "part1" | "part2" | "part3">("all");

  const handleModeSelect = (mode: PracticeMode) => {
    if (mode === "ai-interview") {
      setSelectedMode(mode);
      setActiveTopic(topics[0]);
    } else if (mode === "quickfire") {
      setSelectedMode(mode);
      setActiveTopic(topics.find(t => t.part === "part1") || topics[0]);
    } else {
      setSelectedMode(mode);
      setActiveTopic(topics.find(t => t.part === "part2") || topics[3]);
    }
  };

  if (activeTopic && selectedMode) {
    return <AIInterviewSession topic={activeTopic} mode={selectedMode} onBack={() => { setActiveTopic(null); setSelectedMode(null); }} />;
  }

  const filtered = activeTab === "all" ? topics : topics.filter((t) => t.part === activeTab);
  const tabs = [
    { id: "all" as const, label: "All Topics" },
    { id: "part1" as const, label: "Part 1" },
    { id: "part2" as const, label: "Part 2" },
    { id: "part3" as const, label: "Part 3" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-8 text-foreground">Speaking Practice</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI Partner • 24/7 Practice</p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center gap-3 bg-[hsl(var(--purple)/0.05)] rounded-xl p-4 border border-[hsl(var(--purple)/0.15)]">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--purple))] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[hsl(var(--purple-foreground))]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Focus: Part 2 — Cue Cards</p>
          <p className="text-xs text-muted-foreground mt-0.5">Practice fluency & timing for long turn answers</p>
        </div>
        <Button size="sm" className="h-8 text-xs shrink-0 bg-[hsl(var(--purple))] hover:bg-[hsl(var(--purple)/0.9)]" onClick={() => handleModeSelect("cuecard")}>
          Start
        </Button>
      </div>

      {/* ─── 3 Practice Mode Cards ─── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Choose Practice Mode</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {modeCards.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => handleModeSelect(m.id)}
                className="relative bg-card rounded-2xl border border-border p-5 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group overflow-hidden"
              >
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${m.gradient}`} />
                <div className="flex flex-col items-center text-center gap-3 pt-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{m.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {m.duration}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all press focus-ring shrink-0 ${
              activeTab === tab.id
                ? "bg-[hsl(var(--purple))] text-[hsl(var(--purple-foreground))] shadow-sm"
                : "bg-card text-muted-foreground hover:bg-secondary border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Part Info Cards */}
      {activeTab === "all" && (
        <div className="grid grid-cols-3 gap-3">
          {(["part1", "part2", "part3"] as const).map((part) => {
            const cfg = partConfig[part];
            const Icon = cfg.icon;
            const count = topics.filter((t) => t.part === part).length;
            return (
              <button
                key={part}
                onClick={() => setActiveTab(part)}
                className="bg-card rounded-xl border border-border p-3.5 text-left hover:shadow-card transition-all press focus-ring group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${cfg.lightBg}`}>
                  <Icon className={`w-4 h-4 ${cfg.text}`} />
                </div>
                <p className="text-xs font-semibold text-foreground">{cfg.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{count} topics • {cfg.duration}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Topics List */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {activeTab === "all" ? "All Topics" : partConfig[activeTab].label + " — " + partConfig[activeTab].subtitle} ({filtered.length})
        </h2>
        <div className="space-y-3">
          {filtered.map((topic) => {
            const cfg = partConfig[topic.part];
            return (
              <button
                key={topic.id}
                onClick={() => { setSelectedMode("ai-interview"); setActiveTopic(topic); }}
                className="w-full bg-card rounded-xl border border-border p-4 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    topic.status === "scored" ? "bg-success/10" : cfg.lightBg
                  }`}>
                    {topic.status === "scored" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Mic className={`w-5 h-5 ${cfg.text}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{topic.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.lightBg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{topic.question.split("\n")[0]}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.duration}</span>
                      {topic.status === "scored" && (
                        <span className="text-xs font-bold text-[hsl(var(--purple))]">Band {topic.lastScore}</span>
                      )}
                      {topic.status === "practiced" && (
                        <span className="text-[10px] font-semibold bg-warning/10 text-warning px-2 py-0.5 rounded-full">Practiced</span>
                      )}
                      {topic.status === "new" && (
                        <span className={`text-xs font-semibold ${cfg.text} flex items-center gap-1 group-hover:underline underline-offset-2`}>
                          Start <ChevronRight className="w-3 h-3" />
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

      {/* Recent Scores */}
      {topics.filter((t) => t.status === "scored").length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Recent Scores</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {topics.filter((t) => t.status === "scored").map((topic) => (
              <button
                key={topic.id}
                onClick={() => { setSelectedMode("ai-interview"); setActiveTopic(topic); }}
                className="shrink-0 bg-card rounded-xl border border-border p-4 w-[160px] text-left hover:shadow-card transition-all press focus-ring"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${partConfig[topic.part].lightBg} ${partConfig[topic.part].text}`}>
                    {partConfig[topic.part].label}
                  </span>
                  <span className="text-lg font-extrabold text-[hsl(var(--purple))]">{topic.lastScore}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{topic.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingPractice;
