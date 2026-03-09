import { useState, useCallback } from "react";
import { Lightbulb, Trophy, RotateCcw } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { generateFillBlank } from "@/data/words/generator";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    allWords: FullWord[];
    onExit: () => void;
}

const FillBlankMode = ({ words, allWords, onExit }: Props) => {
    const [questions] = useState(() =>
        words.slice(0, 10).map(w => generateFillBlank(w, allWords))
    );
    const [qi, setQi] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = questions[qi];

    const handleSelect = (opt: string) => {
        if (selected) return;
        setSelected(opt);
        const correct = opt === q.answer;
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            if (qi + 1 >= questions.length) setDone(true);
            else { setQi(i => i + 1); setSelected(null); setShowHint(false); }
        }, 1200);
    };

    if (done) {
        const pct = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-extrabold">Fill in the Blank Complete!</h3>
                <div className="text-5xl font-black text-accent">{pct}%</div>
                <p className="text-sm text-muted-foreground">{score}/{questions.length} correct</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { setQi(0); setScore(0); setSelected(null); setShowHint(false); setDone(false); }}>
                        <RotateCcw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                    <Button variant="coral" onClick={onExit}>Done</Button>
                </div>
            </div>
        );
    }

    if (!q) return null;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <button onClick={onExit} className="text-sm font-semibold text-primary press">← Back</button>
                <span className="text-xs font-semibold text-muted-foreground">{qi + 1}/{questions.length}</span>
                <span className="text-xs font-bold text-success">Score: {score}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>

            {/* Sentence with blank */}
            <div className="bg-card rounded-2xl shadow-elevated p-6 space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground mb-2">✏️ Fill in the blank:</h3>
                <p className="text-base font-medium text-foreground leading-relaxed">
                    {q.sentence.split("______").map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span className={`inline-block min-w-[80px] px-3 py-1 mx-1 border-b-2 text-center font-bold ${selected === null ? "border-primary text-transparent bg-primary/5" :
                                        selected === q.answer ? "border-success text-success bg-success/5" :
                                            "border-destructive text-destructive bg-destructive/5"
                                    }`}>
                                    {selected || "?"}
                                </span>
                            )}
                        </span>
                    ))}
                </p>

                {/* Hint */}
                {!showHint && !selected && (
                    <button
                        onClick={() => setShowHint(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 press"
                    >
                        <Lightbulb className="w-3.5 h-3.5" /> Show Hint
                    </button>
                )}
                {showHint && (
                    <div className="bg-accent/5 rounded-xl px-3 py-2 animate-fade-in-up">
                        <p className="text-xs text-accent font-semibold">💡 {q.hint}</p>
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                    let cls = "bg-card shadow-card text-foreground border border-border hover:border-primary/30";
                    if (selected) {
                        if (opt === q.answer) cls = "bg-success/10 text-success border-success ring-2 ring-success/30";
                        else if (opt === selected) cls = "bg-destructive/10 text-destructive border-destructive ring-2 ring-destructive/30";
                        else cls = "bg-card/50 text-muted-foreground border-border opacity-50";
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={selected !== null}
                            className={`p-3 rounded-xl text-sm font-semibold transition-all press text-center ${cls}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FillBlankMode;
