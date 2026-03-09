import { useState, useEffect, useCallback } from "react";
import { Trophy, RotateCcw, Timer } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

const MatchMasterMode = ({ words, onExit }: Props) => {
    const [pairs] = useState(() => {
        const selected = shuffle(words).slice(0, 6);
        return selected.map(w => ({ id: w.id, word: w.word, definition: w.definition }));
    });
    const [shuffledDefs] = useState(() => shuffle(pairs.map((p, i) => ({ idx: i, def: p.definition }))));
    const [selectedWord, setSelectedWord] = useState<number | null>(null);
    const [selectedDef, setSelectedDef] = useState<number | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [wrongPair, setWrongPair] = useState<{ w: number; d: number } | null>(null);
    const [timer, setTimer] = useState(60);
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);

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

    // Check match
    useEffect(() => {
        if (selectedWord !== null && selectedDef !== null) {
            const defData = shuffledDefs[selectedDef];
            if (defData.idx === selectedWord) {
                // Correct match
                setMatched(m => new Set([...m, selectedWord]));
                setScore(s => s + 10 + Math.max(0, timer)); // bonus for speed
                setSelectedWord(null);
                setSelectedDef(null);
                if (matched.size + 1 >= pairs.length) {
                    setTimeout(() => setDone(true), 400);
                }
            } else {
                // Wrong
                setWrongPair({ w: selectedWord, d: selectedDef });
                setTimeout(() => {
                    setWrongPair(null);
                    setSelectedWord(null);
                    setSelectedDef(null);
                }, 600);
            }
        }
    }, [selectedWord, selectedDef, pairs.length, matched.size, shuffledDefs, timer]);

    if (done) {
        const matchedAll = matched.size >= pairs.length;
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <Trophy className={`w-16 h-16 mx-auto ${matchedAll ? "text-accent" : "text-muted-foreground"}`} />
                <h3 className="text-2xl font-extrabold">{matchedAll ? "All Matched!" : "Time's Up!"}</h3>
                <div className="text-4xl font-black text-accent">{score}</div>
                <p className="text-sm text-muted-foreground">{matched.size}/{pairs.length} matched · {timer}s remaining</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RotateCcw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                    <Button variant="coral" onClick={onExit}>Done</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <button onClick={onExit} className="text-sm font-semibold text-primary press">← Back</button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timer < 15 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-secondary text-foreground"}`}>
                    <Timer className="w-3.5 h-3.5" /> {timer}s
                </div>
                <span className="text-xs font-bold text-success">Score: {score}</span>
            </div>

            <h3 className="text-sm font-bold text-muted-foreground text-center">🧩 Match words with their definitions</h3>

            <div className="grid grid-cols-2 gap-3">
                {/* Words column */}
                <div className="space-y-2">
                    {pairs.map((p, i) => {
                        const isMatched = matched.has(i);
                        const isSelected = selectedWord === i;
                        const isWrong = wrongPair?.w === i;
                        return (
                            <button
                                key={`w-${i}`}
                                onClick={() => !isMatched && setSelectedWord(i)}
                                disabled={isMatched}
                                className={`w-full p-3 rounded-xl text-sm font-semibold text-left transition-all press ${isMatched ? "bg-success/10 text-success/50 border border-success/20 line-through" :
                                        isWrong ? "bg-destructive/10 text-destructive border border-destructive ring-2 ring-destructive/30" :
                                            isSelected ? "bg-primary/10 text-primary border border-primary ring-2 ring-primary/30" :
                                                "bg-card shadow-card border border-border hover:border-primary/30"
                                    }`}
                            >
                                {p.word}
                            </button>
                        );
                    })}
                </div>

                {/* Definitions column */}
                <div className="space-y-2">
                    {shuffledDefs.map((d, i) => {
                        const isMatched = matched.has(d.idx);
                        const isSelected = selectedDef === i;
                        const isWrong = wrongPair?.d === i;
                        return (
                            <button
                                key={`d-${i}`}
                                onClick={() => !isMatched && setSelectedDef(i)}
                                disabled={isMatched}
                                className={`w-full p-3 rounded-xl text-xs font-medium text-left transition-all press leading-snug ${isMatched ? "bg-success/10 text-success/50 border border-success/20" :
                                        isWrong ? "bg-destructive/10 text-destructive border border-destructive ring-2 ring-destructive/30" :
                                            isSelected ? "bg-accent/10 text-accent border border-accent ring-2 ring-accent/30" :
                                                "bg-card shadow-card border border-border hover:border-accent/30"
                                    }`}
                            >
                                {d.def.length > 60 ? d.def.slice(0, 57) + "..." : d.def}
                            </button>
                        );
                    })}
                </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">{matched.size}/{pairs.length} matched</p>
        </div>
    );
};

export default MatchMasterMode;
