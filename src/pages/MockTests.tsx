import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Lock, Trophy, Star, ChevronRight, Timer, ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockDef {
  id: string;
  title: string;
  skill: string;
  time: string;
  durationMin: number;
  questions: { q: string; options: string[]; correct: number }[];
}

const shortMocks: MockDef[] = [
  {
    id: "listening-mini", title: "Listening Mini Mock", skill: "Listening", time: "30 min", durationMin: 30,
    questions: [
      { q: "The lecture is mainly about ___.", options: ["marine ecosystems", "climate change impacts on coral reefs", "ocean conservation policies", "history of marine biology"], correct: 1 },
      { q: "According to the speaker, the biggest threat to coral reefs is ___.", options: ["overfishing", "water pollution", "rising ocean temperatures", "coastal development"], correct: 2 },
      { q: "What percentage of marine species depend on coral reefs?", options: ["10%", "25%", "50%", "75%"], correct: 1 },
      { q: "The speaker mentions that coral bleaching occurs when ___.", options: ["water temperature drops", "algae leave the coral", "fish populations decline", "currents change direction"], correct: 1 },
      { q: "Which solution does the speaker consider most effective?", options: ["Marine protected areas", "Reducing carbon emissions", "Artificial reef construction", "Public awareness campaigns"], correct: 1 },
    ],
  },
  {
    id: "reading-mini", title: "Reading Mini Mock", skill: "Reading", time: "45 min", durationMin: 45,
    questions: [
      { q: "The passage states that urban farming originated in ___.", options: ["North America", "Ancient Mesopotamia", "Modern Japan", "Colonial Europe"], correct: 1 },
      { q: "According to the text, vertical farming uses ___ less water than traditional farming.", options: ["50%", "70%", "90%", "95%"], correct: 2 },
      { q: "The main benefit of hydroponics is ___.", options: ["Lower cost", "No soil requirement", "Faster growth only", "Better taste"], correct: 1 },
      { q: "Which statement is TRUE according to the passage?", options: ["Urban farms can only grow vegetables", "Technology has no role in modern farming", "Rooftop gardens reduce building energy costs", "Urban farming is declining globally"], correct: 2 },
      { q: "The author's tone toward urban farming is best described as ___.", options: ["Critical", "Cautiously optimistic", "Indifferent", "Overwhelmingly negative"], correct: 1 },
    ],
  },
  {
    id: "writing-mini", title: "Writing Task 2 Mock", skill: "Writing", time: "40 min", durationMin: 40,
    questions: [
      { q: "A strong Task 2 introduction should include ___.", options: ["A personal anecdote", "A paraphrase of the question and thesis statement", "A list of all arguments", "The conclusion"], correct: 1 },
      { q: "Which cohesive device connects contrasting ideas?", options: ["Furthermore", "However", "In addition", "Moreover"], correct: 1 },
      { q: "The recommended minimum word count for Task 2 is ___.", options: ["200 words", "250 words", "300 words", "350 words"], correct: 1 },
      { q: "For a Band 7+ essay, paragraphs should ___.", options: ["Be very short (2 sentences)", "Each develop one clear main idea", "Include many quotations", "Avoid any examples"], correct: 1 },
      { q: "'Less developed countries' is an example of ___.", options: ["Informal language", "Band 5 vocabulary", "Formal academic register", "Slang"], correct: 2 },
    ],
  },
];

const fullMocks: MockDef[] = [
  {
    id: "full-1", title: "Full Academic Mock #1", skill: "All", time: "2h 45min", durationMin: 165,
    questions: [
      { q: "Section 1: What time does the library close on weekdays?", options: ["5:00 PM", "7:30 PM", "9:00 PM", "10:00 PM"], correct: 2 },
      { q: "Section 2: The speaker recommends starting revision ___ weeks before exams.", options: ["2", "4", "6", "8"], correct: 2 },
      { q: "Section 3: Which research method is described as most reliable?", options: ["Surveys", "Interviews", "Controlled experiments", "Case studies"], correct: 2 },
      { q: "Reading: The passage suggests that AI will most impact ___.", options: ["Agriculture", "Healthcare", "Transportation", "Education"], correct: 1 },
      { q: "Reading: According to the text, 'paradigm shift' refers to ___.", options: ["A small change", "A fundamental change in approach", "A political revolution", "A scientific error"], correct: 1 },
      { q: "Reading: The author implies that critics of technology are ___.", options: ["Completely wrong", "Raising valid concerns", "Uninformed", "Financially motivated"], correct: 1 },
      { q: "Writing knowledge: An opinion essay should ___.", options: ["Only present one side", "Present both sides then give opinion", "Avoid personal opinions entirely", "Only use statistics"], correct: 1 },
      { q: "Speaking knowledge: Fluency is demonstrated by ___.", options: ["Speaking very fast", "Speaking without long pauses", "Using complex grammar", "Memorizing answers"], correct: 1 },
    ],
  },
];

const lockedFullMocks = [
  { title: "Full Academic Mock #2", time: "2h 45min" },
  { title: "Full General Training Mock", time: "2h 45min" },
];

interface HistoryEntry {
  id: string;
  title: string;
  date: string;
  overall: string;
  l: string; r: string; w: string; s: string;
  answers: number[];
  mockId: string;
}

const defaultHistory: HistoryEntry[] = [
  { id: "h1", title: "Listening Mini Mock", date: "Mar 5, 2026", overall: "7.0", l: "7.0", r: "-", w: "-", s: "-", answers: [1, 2, 1, 1, 0], mockId: "listening-mini" },
  { id: "h2", title: "Full Academic Mock #1", date: "Mar 1, 2026", overall: "6.5", l: "7.0", r: "6.5", w: "6.0", s: "6.5", answers: [2, 2, 2, 1, 1, 1, 0, 1], mockId: "full-1" },
];

type View = "home" | "test" | "results" | "review";

const MockTests = () => {
  const [view, setView] = useState<View>("home");
  const [activeMock, setActiveMock] = useState<MockDef | null>(null);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [history] = useState<HistoryEntry[]>(defaultHistory);
  const [reviewEntry, setReviewEntry] = useState<HistoryEntry | null>(null);

  // Timer countdown
  useEffect(() => {
    if (view !== "test" || !activeMock) return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, activeMock]);

  const startMock = useCallback((mock: MockDef) => {
    setActiveMock(mock);
    setQi(0);
    setAnswers(new Array(mock.questions.length).fill(null));
    setTimer(mock.durationMin * 60);
    setScore(0);
    setView("test");
  }, []);

  const selectAnswer = (optIdx: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[qi] = optIdx;
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    if (!activeMock) return;
    const correct = activeMock.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0
    );
    const pct = correct / activeMock.questions.length;
    // Convert to band: 90%+=8.5, 80%+=7.5, 70%+=7.0, 60%+=6.5, 50%+=6.0, below=5.5
    const bandMap = [[0.9, 8.5], [0.8, 7.5], [0.7, 7.0], [0.6, 6.5], [0.5, 6.0], [0, 5.5]] as const;
    const band = bandMap.find(([threshold]) => pct >= threshold)?.[1] ?? 5.5;
    setScore(band);
    setView("results");
  }, [activeMock, answers]);

  const openReview = (entry: HistoryEntry) => {
    const mock = [...shortMocks, ...fullMocks].find(m => m.id === entry.mockId);
    if (mock) {
      setActiveMock(mock);
      setAnswers(entry.answers);
      setReviewEntry(entry);
      setView("review");
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ─── TEST PLAYER ───
  if (view === "test" && activeMock) {
    const q = activeMock.questions[qi];
    const timerPct = (timer / (activeMock.durationMin * 60)) * 100;
    const answered = answers.filter(a => a !== null).length;

    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-5 pb-28 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setView("home")} className="text-sm font-semibold text-primary press">← Exit</button>
          <h2 className="text-sm font-bold text-foreground">{activeMock.title}</h2>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timer < 60 ? "bg-destructive/10 text-destructive animate-pulse" :
              timer < 300 ? "bg-warning/10 text-warning" :
                "bg-secondary text-foreground"
            }`}>
            <Timer className="w-3.5 h-3.5" /> {formatTime(timer)}
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${timer < 60 ? "bg-destructive" : "bg-accent"}`} style={{ width: `${timerPct}%` }} />
        </div>

        {/* Question indicators */}
        <div className="flex items-center gap-1.5 justify-center flex-wrap">
          {activeMock.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setQi(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold press transition-all ${i === qi ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                  answers[i] !== null ? "bg-success/10 text-success border border-success/20" :
                    "bg-secondary text-muted-foreground"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        <div className="bg-card rounded-2xl shadow-elevated p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Question {qi + 1}/{activeMock.questions.length}</span>
            <span className="text-xs font-semibold text-accent">{answered}/{activeMock.questions.length} answered</span>
          </div>
          <p className="text-base font-semibold text-foreground">{q.q}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all press border ${answers[qi] === i
                    ? "bg-primary/10 text-primary border-primary ring-2 ring-primary/20"
                    : "bg-card border-border hover:border-primary/30 hover:bg-secondary/30"
                  }`}
              >
                <span className="mr-2 text-muted-foreground font-semibold">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={qi === 0}
            onClick={() => setQi(i => i - 1)}
            className="press"
          >
            ← Previous
          </Button>
          {qi < activeMock.questions.length - 1 ? (
            <Button variant="coral" onClick={() => setQi(i => i + 1)} className="press">
              Next →
            </Button>
          ) : (
            <Button
              variant="coral"
              onClick={handleSubmit}
              className="press"
            >
              Submit Test
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (view === "results" && activeMock) {
    const correct = activeMock.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0
    );
    const pct = Math.round((correct / activeMock.questions.length) * 100);

    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto pb-28 md:pb-8">
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
          <Trophy className="w-16 h-16 text-accent mx-auto" />
          <h2 className="text-2xl font-extrabold">{activeMock.title}</h2>
          <p className="text-sm text-muted-foreground">Test Complete!</p>

          <div className="w-28 h-28 rounded-full border-4 border-accent flex items-center justify-center mx-auto">
            <div>
              <span className="text-3xl font-black text-accent">{score}</span>
              <p className="text-[10px] text-muted-foreground font-semibold">/9 Band</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="bg-success/10 rounded-xl p-3">
              <p className="text-xl font-bold text-success">{correct}</p>
              <p className="text-[10px] text-success/70">Correct</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3">
              <p className="text-xl font-bold text-destructive">{activeMock.questions.length - correct}</p>
              <p className="text-[10px] text-destructive/70">Wrong</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3">
              <p className="text-xl font-bold text-accent">{pct}%</p>
              <p className="text-[10px] text-accent/70">Accuracy</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setReviewEntry(null);
              setView("review");
            }} className="press">
              <CheckCircle className="w-4 h-4 mr-1" /> Review Answers
            </Button>
            <Button variant="coral" onClick={() => setView("home")} className="press">
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW MODE ───
  if (view === "review" && activeMock) {
    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-5 pb-28 md:pb-8">
        <div className="flex items-center justify-between">
          <button onClick={() => setView("home")} className="text-sm font-semibold text-primary press">← Back to Mock Tests</button>
          <h2 className="text-sm font-bold text-foreground">Review: {activeMock.title}</h2>
        </div>

        <div className="space-y-4">
          {activeMock.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={i} className="bg-card rounded-xl shadow-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Question {i + 1}</span>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-success"><CheckCircle className="w-3.5 h-3.5" /> Correct</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-destructive"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground">{q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => {
                    let cls = "bg-card border-border";
                    if (j === q.correct) cls = "bg-success/10 border-success text-success";
                    else if (j === userAnswer && !isCorrect) cls = "bg-destructive/10 border-destructive text-destructive line-through";
                    return (
                      <div key={j} className={`p-3 rounded-lg border text-sm font-medium ${cls}`}>
                        <span className="mr-2 font-semibold">{String.fromCharCode(65 + j)}.</span>
                        {opt}
                        {j === q.correct && <span className="ml-2 text-xs font-bold">✓ Correct</span>}
                        {j === userAnswer && !isCorrect && <span className="ml-2 text-xs font-bold">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => startMock(activeMock)} className="press">
            <RotateCcw className="w-4 h-4 mr-1" /> Retake
          </Button>
          <Button variant="coral" onClick={() => setView("home")} className="press">
            Done
          </Button>
        </div>
      </div>
    );
  }

  // ─── HOME ───
  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-8">
      <div>
        <h1 className="text-2xl font-bold leading-8">Mock Tests</h1>
        <p className="text-sm text-muted-foreground mt-1">Simulate the real IELTS exam experience.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Short Practice */}
        <div className="bg-card rounded-xl p-5 shadow-card border">
          <h2 className="text-base font-semibold mb-1">Short Practice</h2>
          <p className="text-xs text-muted-foreground mb-4">20–45 minutes, single skill</p>
          <div className="space-y-2">
            {shortMocks.map((m) => (
              <button
                key={m.id}
                onClick={() => startMock(m)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors press focus-ring text-left"
              >
                <Trophy className="w-4 h-4 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground">{m.skill} • {m.time}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold bg-accent text-accent-foreground px-3 py-1.5 rounded-lg min-h-[32px] flex items-center">Start</span>
              </button>
            ))}
          </div>
        </div>

        {/* Full Mock */}
        <div className="bg-card rounded-xl p-5 shadow-card border-2 border-primary/20">
          <h2 className="text-base font-semibold mb-1">Full Mock Test</h2>
          <p className="text-xs text-muted-foreground mb-4">2 hours 45 minutes, complete simulation</p>
          <div className="space-y-2">
            {fullMocks.map((m) => (
              <button
                key={m.id}
                onClick={() => startMock(m)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors press focus-ring text-left"
              >
                <Trophy className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground">{m.time}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg min-h-[32px] flex items-center">Start</span>
              </button>
            ))}
            {lockedFullMocks.map((m) => (
              <div key={m.title} className="w-full flex items-center gap-3 p-3 rounded-lg opacity-60 text-left">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground">{m.time}</p>
                </div>
                <span className="text-[10px] font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">Premium</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test History */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-base font-semibold">Test History</h2>
          <span className="text-xs text-muted-foreground">{history.length} tests taken</span>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">Test</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">Date</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">Overall</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">L</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">R</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">W</th>
                <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">S</th>
                <th className="text-right px-5 py-2.5 font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{h.title}</td>
                  <td className="px-3 py-3 text-muted-foreground text-xs">{h.date}</td>
                  <td className="px-3 py-3 text-center font-bold text-accent">{h.overall}</td>
                  <td className="px-3 py-3 text-center text-xs">{h.l}</td>
                  <td className="px-3 py-3 text-center text-xs">{h.r}</td>
                  <td className="px-3 py-3 text-center text-xs">{h.w}</td>
                  <td className="px-3 py-3 text-center text-xs">{h.s}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openReview(h)}
                      className="text-xs font-semibold text-primary hover:underline press"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden divide-y">
          {history.map((h) => (
            <button
              key={h.id}
              onClick={() => openReview(h)}
              className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors press text-left"
            >
              <Star className="w-4 h-4 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-[11px] text-muted-foreground">{h.date}</p>
              </div>
              <span className="text-lg font-bold text-accent">{h.overall}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTests;
