import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Lock, Trophy, Star, ChevronRight, Timer, ArrowLeft, CheckCircle, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMockTests, useMockTestResults, type MockTest, type MockQuestion } from "@/hooks/useMockTests";
import { useProfile } from "@/hooks/useProfile";

const lockedFullMocks = [
  { title: "Full Academic Mock #2", time: "2h 45min" },
  { title: "Full General Training Mock", time: "2h 45min" },
];

type View = "home" | "test" | "results" | "review";

const MockTests = () => {
  const navigate = useNavigate();
  const { tests, loading: testsLoading } = useMockTests();
  const { results, loading: resultsLoading, submitResult } = useMockTestResults();
  const { profile } = useProfile();
  
  const [view, setView] = useState<View>("home");
  const [activeMock, setActiveMock] = useState<MockTest | null>(null);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewEntry, setReviewEntry] = useState<any>(null);

  // Separate tests by type
  const shortMocks = tests.filter(t => t.type !== 'full-academic');
  const fullMocks = tests.filter(t => t.type === 'full-academic');

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

  const startMock = useCallback((mock: MockTest) => {
    setActiveMock(mock);
    setQi(0);
    setAnswers(new Array(mock.questions.length).fill(null));
    setTimer(mock.duration_min * 60);
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

  const handleSubmit = useCallback(async () => {
    if (!activeMock) return;
    setSubmitting(true);
    
    const timeSpent = activeMock.duration_min * 60 - timer;
    const result = await submitResult(
      activeMock.id,
      answers.map(a => a ?? -1),
      activeMock.questions,
      timeSpent
    );
    
    if (result) {
      setScore(result.overall_band || 0);
    }
    setSubmitting(false);
    setView("results");
  }, [activeMock, answers, timer, submitResult]);

  const openReview = (entry: any) => {
    const mock = tests.find(m => m.id === entry.mock_test_id);
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

  const loading = testsLoading || resultsLoading;

  // ─── TEST PLAYER ───
  if (view === "test" && activeMock) {
    const q = activeMock.questions[qi];
    const timerPct = (timer / (activeMock.duration_min * 60)) * 100;
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
                className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-150 press border ${answers[qi] === i
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
              disabled={submitting}
              className="press"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Test"
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (view === "results" && activeMock && reviewEntry) {
    const correct = reviewEntry.correct_count || 0;
    const total = activeMock.questions.length;
    const pct = reviewEntry.score_percent || 0;

    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto pb-28 md:pb-8">
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
          <Trophy className="w-16 h-16 text-accent mx-auto" />
          <h2 className="text-2xl font-extrabold">{activeMock.title}</h2>
          <p className="text-sm text-muted-foreground">Test Complete!</p>

          <div className="w-28 h-28 rounded-full border-4 border-accent flex items-center justify-center mx-auto">
            <div>
              <span className="text-3xl font-black text-accent">{reviewEntry.overall_band}</span>
              <p className="text-[10px] text-muted-foreground font-semibold">/9 Band</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="bg-success/10 rounded-xl p-3">
              <p className="text-xl font-bold text-success">{correct}</p>
              <p className="text-[10px] text-success/70">Correct</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3">
              <p className="text-xl font-bold text-destructive">{reviewEntry.wrong_count || 0}</p>
              <p className="text-[10px] text-destructive/70">Wrong</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-3">
              <p className="text-xl font-bold text-accent">{pct}%</p>
              <p className="text-[10px] text-accent/70">Accuracy</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
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
                      <p className="text-[11px] text-muted-foreground">{m.skill} • {m.duration_min} min</p>
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
                      <p className="text-[11px] text-muted-foreground">{m.duration_min} min</p>
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
          {results.length > 0 && (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-base font-semibold">Test History</h2>
                <span className="text-xs text-muted-foreground">{results.length} tests taken</span>
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/30">
                      <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">Test</th>
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">Date</th>
                      <th className="text-center px-3 py-2.5 font-medium text-muted-foreground text-xs">Overall</th>
                      <th className="text-right px-5 py-2.5 font-medium text-muted-foreground text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3 font-medium">{r.mock_test?.title || 'Unknown Test'}</td>
                        <td className="px-3 py-3 text-muted-foreground text-xs">
                          {new Date(r.completed_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-accent">{r.overall_band}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => openReview(r)}
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
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openReview(r)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors press text-left"
                  >
                    <Star className="w-4 h-4 text-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.mock_test?.title || 'Unknown Test'}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(r.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-accent">{r.overall_band}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MockTests;
