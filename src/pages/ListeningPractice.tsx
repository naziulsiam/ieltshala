import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Headphones, Play, Pause, Clock, CheckCircle2,
  ChevronRight, RotateCcw, FileText, Map, Users, MessageSquare,
  Type, Sparkles, SkipBack, SkipForward, Bookmark, Volume2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ListItemSkeleton } from "@/components/ui/skeleton-loaders";
import QuestionTypeBrowser from "@/components/QuestionTypeBrowser";
import NextRecommendation from "@/components/NextRecommendation";
import { useListeningTests, useUserListeningProgress, useListeningStats, type ListeningTest } from "@/hooks/useListening";
import { supabase } from "@/lib/supabase";
import { generateSpeech } from "@/services/tts";

/* ─── Question Types ─── */
const questionTypes = [
  { id: "form", icon: FileText, label: "Form Completion", count: 12, avgScore: "7.0", difficulty: 2, description: "Fill in gaps in a form using details from the audio.", avgTime: "~1.5 min", commonMistakes: ["Misspelling proper nouns", "Writing more words than allowed", "Missing number details (dates, prices)"] },
  { id: "map", icon: Map, label: "Map / Diagram", count: 8, avgScore: "6.2", difficulty: 3, description: "Label locations on a map or diagram based on spoken directions.", avgTime: "~2 min", commonMistakes: ["Confusing left/right orientation", "Missing directional language cues", "Not following the speaker's route order"] },
  { id: "matching", icon: Users, label: "Matching", count: 9, avgScore: "6.8", difficulty: 3, description: "Match a list of items to options from a set of possible answers.", avgTime: "~1.5 min", commonMistakes: ["Using an option more than once when not allowed", "Rushing and missing synonyms", "Not reading all options before listening"] },
  { id: "mcq", icon: MessageSquare, label: "Multiple Choice", count: 8, avgScore: "5.5", difficulty: 4, description: "Choose the correct answer from 3 options based on the recording.", avgTime: "~2.5 min", commonMistakes: ["Choosing an answer that uses exact words from audio (paraphrase trap)", "Not distinguishing between speakers' opinions", "Selecting partially correct distractors"] },
  { id: "short", icon: Type, label: "Short Answer", count: 5, avgScore: "6.5", difficulty: 3, description: "Write short answers (1-3 words) to questions about the audio.", avgTime: "~2 min", commonMistakes: ["Exceeding the word limit", "Not using the exact form heard", "Missing plural/singular distinctions"] },
];

const difficultyDot: Record<string, string> = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-destructive",
};

/* ─── Player ─── */
const TestPlayer = ({ 
  test, 
  onClose,
  savedProgress,
  onSubmit 
}: { 
  test: ListeningTest; 
  onClose: () => void;
  savedProgress?: any;
  onSubmit: (answers: Record<number, string>, timeSpent: number) => void;
}) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [bookmarks, setBookmarks] = useState<number[]>(savedProgress?.bookmarks || []);
  const [answers, setAnswers] = useState<Record<number, string>>(savedProgress?.answers || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(test.audio_url);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const totalTime = test.duration_min * 60;

  const questions = test.questions || [];
  const totalQ = questions.length;
  const answered = Object.keys(answers).filter(k => answers[parseInt(k)]).length;

  // Generate audio if not exists
  useEffect(() => {
    if (!audioUrl && test.transcript) {
      generateAudio();
    }
  }, [audioUrl, test.transcript]);

  const generateAudio = async () => {
    if (!test.transcript) return;
    setGeneratingAudio(true);
    try {
      const script = test.transcript.substring(0, 4000); // Limit length
      const audioUrl = await generateSpeech(script, {
        voice: 'en-US-Neural2-D',
        speed: speed
      });
      if (audioUrl) {
        setAudioUrl(audioUrl);
      }
    } catch (err) {
      console.error('Failed to generate audio:', err);
    } finally {
      setGeneratingAudio(false);
    }
  };

  // Fake playback timer
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => setCurrentTime((t) => Math.min(t + 1, totalTime)), 1000);
    return () => clearInterval(iv);
  }, [playing, totalTime]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = (currentTime / totalTime) * 100;

  // Generate waveform bars
  const bars = Array.from({ length: 60 }, (_, i) => {
    const h = 12 + Math.sin(i * 0.4) * 10 + Math.random() * 8;
    const active = (i / 60) * 100 <= pct;
    return { h, active };
  });

  const speeds = [0.75, 1.0, 1.25, 1.5];

  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentTime) 
        ? prev.filter(t => t !== currentTime)
        : [...prev, currentTime]
    );
  };

  const updateAnswer = (qNum: number, value: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const timeSpent = currentTime;
    await onSubmit(answers, timeSpent);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{test.title}</p>
          <p className="text-xs text-muted-foreground">{test.section}</p>
        </div>
        <button
          onClick={toggleBookmark}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${bookmarks.length > 0 ? "text-accent fill-accent" : "text-muted-foreground"}`} />
        </button>
      </div>

      {/* Audio Player */}
      <div className="bg-card border-b border-border px-4 py-5 space-y-4">
        {/* Waveform */}
        <div className="flex items-center gap-[2px] h-12 justify-center">
          {bars.map((bar, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-colors duration-150 ${bar.active ? "bg-primary" : "bg-secondary"}`}
              style={{ height: `${bar.h}px` }}
            />
          ))}
        </div>

        {/* Time */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(totalTime)}</span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.round(x * totalTime));
          }}
        >
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setCurrentTime((t) => Math.max(0, t - 10))} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <SkipBack className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            disabled={generatingAudio}
            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-elevated press disabled:opacity-50"
          >
            {generatingAudio ? (
              <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
            ) : playing ? (
              <Pause className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
            )}
          </button>
          <button onClick={() => setCurrentTime((t) => Math.min(totalTime, t + 10))} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <SkipForward className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Speed + Volume */}
        <div className="flex items-center justify-center gap-2">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                speed === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}x
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {bookmarks.map((ts, i) => (
              <button
                key={i}
                onClick={() => setCurrentTime(ts)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold shrink-0"
              >
                <Bookmark className="w-3 h-3" /> {fmt(ts)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Questions 1–{totalQ}</h3>
          <span className="text-xs text-muted-foreground">{answered}/{totalQ} answered</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete the form below. Write <span className="font-semibold text-foreground">NO MORE THAN TWO WORDS</span> for each answer.
        </p>
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          {questions.filter((q) => q.type !== "header").map((q) => (
            <div key={q.num} className="space-y-1.5">
              <label className="text-sm text-foreground font-medium">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold mr-2">
                  {q.num}
                </span>
                {q.question}
              </label>
              <input
                type="text"
                value={answers[q.num] || ''}
                onChange={(e) => updateAnswer(q.num, e.target.value)}
                placeholder="Type your answer..."
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit bar */}
      <div className="border-t border-border bg-card px-4 py-3 pb-safe">
        <Button 
          className="w-full h-12 text-sm" 
          disabled={answered < totalQ || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            `Submit Answers (${answered}/${totalQ})`
          )}
        </Button>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const ListeningPractice = () => {
  const navigate = useNavigate();
  const { tests, loading: testsLoading, refetch: refetchTests } = useListeningTests();
  const { progress, loading: progressLoading, getTestStatus, startTest, submitAnswers } = useUserListeningProgress();
  const { stats } = useListeningStats();
  const [activeType, setActiveType] = useState("all");
  const [activeTest, setActiveTest] = useState<ListeningTest | null>(null);
  const [generating, setGenerating] = useState(false);

  const loading = testsLoading || progressLoading;

  const filtered = activeType === "" || activeType === "all" 
    ? tests 
    : tests.filter((t) => t.type === activeType);

  const handleStartTest = async (test: ListeningTest) => {
    await startTest(test.id);
    setActiveTest(test);
  };

  const handleSubmit = async (answers: Record<number, string>, timeSpent: number) => {
    if (!activeTest) return;
    
    // Build correct answers map
    const correctAnswers: Record<number, string> = {};
    activeTest.questions.forEach((q) => {
      if (q.answer) correctAnswers[q.num] = q.answer;
    });
    
    await submitAnswers(activeTest.id, answers, correctAnswers, timeSpent);
    setActiveTest(null);
    window.location.reload();
  };

  const generateNewTest = async () => {
    setGenerating(true);
    try {
      // Generate using AI service
      const { groqService } = await import('@/services/groq');
      const test = await groqService.generateListeningTest({
        section: activeType === 'form' || activeType === 'map' ? 1 : 
                 activeType === 'matching' ? 2 : 
                 activeType === 'mcq' ? 3 : 1,
        difficulty: 'medium'
      });

      // Save to database
      const { data, error } = await supabase
        .from('listening_tests')
        .insert({
          title: test.title,
          section: `Section ${test.section}: ${test.type}`,
          type: test.type.toLowerCase(),
          difficulty: 'medium',
          duration_min: 30,
          questions_count: test.questions.length,
          transcript: test.transcript,
          questions: test.questions,
          ai_generated: true,
          ai_model: 'llama-3.3-70b'
        })
        .select()
        .single();

      if (error) throw error;
      await refetchTests();
    } catch (err) {
      console.error('Failed to generate test:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (activeTest) {
    const savedProgress = getTestStatus(activeTest.id);
    return (
      <TestPlayer 
        test={activeTest} 
        onClose={() => setActiveTest(null)}
        savedProgress={savedProgress}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-8 text-foreground">Listening Practice</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tests.length} tests • {stats?.tests_completed || 0} completed
          </p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 border border-primary/15">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Focus: Multiple Choice (Section 3)</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {stats?.avg_band ? `Your avg: Band ${stats.avg_band} — ` : ''}
            Practice identifying speaker opinions
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs shrink-0" onClick={() => setActiveType("mcq")}>Start</Button>
      </div>

      {/* Question Type Browser */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">By Question Type</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 text-xs"
            onClick={generateNewTest}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            Generate New
          </Button>
        </div>
        <QuestionTypeBrowser
          types={questionTypes}
          activeType={activeType}
          onSelectType={(id) => setActiveType(id || "all")}
          themeColor="primary"
          columns={3}
        />
      </div>

      {/* Next Recommendation */}
      <NextRecommendation
        title="Multiple Choice — Section 3"
        subtitle="Your weakest area. Practice paraphrasing skills."
        route="/practice/listening"
        themeColor="primary"
      />

      {/* Test List */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {activeType === "all" || activeType === "" ? "All Tests" : questionTypes.find((q) => q.id === activeType)?.label} ({filtered.length})
        </h2>
        <div className="space-y-3">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <ListItemSkeleton />
                </div>
              ))
            : filtered.map((test) => {
                const savedProgress = getTestStatus(test.id);
                const status = savedProgress?.status || 'new';
                
                return (
                  <button
                    key={test.id}
                    onClick={() => handleStartTest(test)}
                    className="w-full bg-card rounded-xl border border-border p-4 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Play icon */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        status === "completed"
                          ? "bg-success/10"
                          : status === "in-progress"
                          ? "bg-primary/10"
                          : "bg-secondary group-hover:bg-primary/10"
                      }`}>
                        {status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Play className={`w-5 h-5 ${status === "in-progress" ? "text-primary" : "text-muted-foreground group-hover:text-primary"} transition-colors`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{test.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{test.section}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            difficultyDot[test.difficulty] === "bg-success"
                              ? "bg-success/10 text-success"
                              : difficultyDot[test.difficulty] === "bg-warning"
                              ? "bg-warning/10 text-warning"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration_min} min</span>
                          <span>{test.questions_count} questions</span>
                          {test.ai_generated && (
                            <span className="bg-primary/10 text-primary px-1.5 rounded">AI</span>
                          )}
                        </div>

                        {/* Progress */}
                        {status === 'completed' && savedProgress?.band_score && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary">
                              Band {savedProgress.band_score}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({savedProgress.correct_count}/{test.questions_count} correct)
                            </span>
                          </div>
                        )}

                        {/* Action */}
                        <div className="mt-3 flex items-center gap-2">
                          {status === "in-progress" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                              <Play className="w-3 h-3" /> Continue
                            </span>
                          ) : status === "completed" ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline underline-offset-2">
                              Start Test <ChevronRight className="w-3 h-3" />
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

export default ListeningPractice;
