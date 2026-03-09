import { useState, useEffect, useCallback } from "react";
import { Zap, Trophy, RotateCcw, Timer, SkipForward, Check } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

const SpeedReviewMode = ({ words, onExit }: Props) => {
    const [wordList] = useState(() => shuffle(words));
    const [wi, setWi] = useState(0);
    const [timer, setTimer] = useState(60);
    const [known, setKnown] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [done, setDone] = useState(false);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [flash, setFlash] = useState<"know" | "skip" | null>(null);

    // Timer
    useEffect(() => {
        if (done) return;
        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) { setDone(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [done]);

    const advance = useCallback((isKnown: boolean) => {
        if (done) return;
        if (isKnown) {
            setKnown(k => k + 1);
            setStreak(s => { const ns = s + 1; setMaxStreak(m => Math.max(m, ns)); return ns; });
            setFlash("know");
        } else {
            setSkipped(s => s + 1);
            setStreak(0);
            setFlash("skip");
        }
        setTimeout(() => setFlash(null), 200);
        if (wi + 1 >= wordList.length) setDone(true);
        else setWi(i => i + 1);
    }, [done, wi, wordList.length]);

    // Keyboard shortcuts
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") advance(true);
            if (e.key === "ArrowLeft" || e.key === "s") advance(false);
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [advance]);

    const word = wordList[wi];

    if (done || !word) {
        const total = known + skipped;
        const pct = total > 0 ? Math.round((known / total) * 100) : 0;
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-warning mx-auto flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold">Speed Review Complete!</h3>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    <div className="bg-success/10 rounded-xl p-3">
                        <p className="text-2xl font-bold text-success">{known}</p>
                        <p className="text-[10px] text-success/70">Known</p>
                    </div>
                    <div className="bg-warning/10 rounded-xl p-3">
                        <p className="text-2xl font-bold text-warning">{skipped}</p>
                        <p className="text-[10px] text-warning/70">Skipped</p>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-3">
                        <p className="text-2xl font-bold text-accent">{maxStreak}</p>
                        <p className="text-[10px] text-accent/70">Best Streak</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{pct}% recognition rate</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RotateCcw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                    <Button variant="coral" onClick={onExit}>Done</Button>
                </div>
            </div>
        );
    }

    const timerPct = Math.round((timer / 60) * 100);

    return (
        <div className={`space-y-5 transition-all ${flash === "know" ? "bg-success/5 rounded-2xl" : flash === "skip" ? "bg-warning/5 rounded-2xl" : ""}`}>
            {/* Timer bar */}
            <div className="flex items-center justify-between">
                <button onClick={onExit} className="text-sm font-semibold text-primary press">← Exit</button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timer < 10 ? "bg-destructive/10 text-destructive animate-pulse" :
                        timer < 30 ? "bg-warning/10 text-warning" :
                            "bg-secondary text-foreground"
                    }`}>
                    <Timer className="w-3.5 h-3.5" /> {timer}s
                </div>
                <span className="text-xs font-bold text-success">{known} words</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${timer < 10 ? "bg-destructive" : "bg-accent"}`}
                    style={{ width: `${timerPct}%` }}
                />
            </div>

            {/* Streak */}
            {streak > 2 && (
                <div className="text-center animate-fade-in-up">
                    <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">
                        🔥 {streak} streak!
                    </span>
                </div>
            )}

            {/* Word card */}
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${word.level === "C2" ? "bg-destructive/10 text-destructive" : word.level === "C1" ? "bg-purple/10 text-purple" : "bg-primary/10 text-primary"}`}>
                    {word.level}
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight">{word.word}</h2>
                <p className="text-sm text-muted-foreground font-mono">{word.phonetic}</p>
                <p className="text-xs text-muted-foreground/60">{word.partOfSpeech}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    className="h-16 press border-warning/30 hover:bg-warning/10 text-lg"
                    onClick={() => advance(false)}
                >
                    <SkipForward className="w-5 h-5 mr-2 text-warning" />
                    <span className="font-bold text-warning">Skip</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-16 press border-success/30 hover:bg-success/10 text-lg"
                    onClick={() => advance(true)}
                >
                    <Check className="w-5 h-5 mr-2 text-success" />
                    <span className="font-bold text-success">Know</span>
                </Button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">⌨️ Space/→ = Know · S/← = Skip</p>
        </div>
    );
};

export default SpeedReviewMode;
