import { useState, useCallback, useEffect, useRef } from "react";
import { Volume2, Trophy, RotateCcw, Delete } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

const SpellingBeeMode = ({ words, onExit }: Props) => {
    const [wordList] = useState(() => shuffle(words).slice(0, 10));
    const [wi, setWi] = useState(0);
    const [input, setInput] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const word = wordList[wi];

    // Auto-play audio
    const playWord = useCallback(() => {
        if (!word) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(word.word);
        u.lang = "en-GB"; u.rate = 0.85;
        window.speechSynthesis.speak(u);
    }, [word]);

    useEffect(() => { playWord(); }, [wi, playWord]);
    useEffect(() => { inputRef.current?.focus(); }, [wi]);

    const handleSubmit = () => {
        if (submitted || !word || !input.trim()) return;
        setSubmitted(true);
        const correct = input.trim().toLowerCase() === word.word.toLowerCase();
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            if (wi + 1 >= wordList.length) setDone(true);
            else { setWi(i => i + 1); setInput(""); setSubmitted(false); }
        }, 1500);
    };

    const getLetterColors = () => {
        if (!submitted || !word) return [];
        const target = word.word.toLowerCase();
        const typed = input.toLowerCase();
        return typed.split("").map((c, i) => {
            if (i < target.length && c === target[i]) return "success";
            return "destructive";
        });
    };

    if (done) {
        const pct = Math.round((score / wordList.length) * 100);
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-extrabold">Spelling Bee Complete!</h3>
                <div className="text-5xl font-black text-accent">{pct}%</div>
                <p className="text-sm text-muted-foreground">{score}/{wordList.length} correct</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { setWi(0); setScore(0); setInput(""); setSubmitted(false); setDone(false); }}>
                        <RotateCcw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                    <Button variant="coral" onClick={onExit}>Done</Button>
                </div>
            </div>
        );
    }

    if (!word) return null;
    const colors = getLetterColors();
    const isCorrect = submitted && input.trim().toLowerCase() === word.word.toLowerCase();

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <button onClick={onExit} className="text-sm font-semibold text-primary press">← Back</button>
                <span className="text-xs font-semibold text-muted-foreground">{wi + 1}/{wordList.length}</span>
                <span className="text-xs font-bold text-success">Score: {score}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(wi / wordList.length) * 100}%` }} /></div>

            <div className="bg-card rounded-2xl shadow-elevated p-6 text-center space-y-4">
                <h3 className="text-lg font-bold text-muted-foreground">🐝 Spell the word you hear</h3>

                <button
                    onClick={playWord}
                    className="w-16 h-16 rounded-full bg-primary/10 hover:bg-primary/15 flex items-center justify-center mx-auto press"
                >
                    <Volume2 className="w-7 h-7 text-primary" />
                </button>

                {/* Hint */}
                <p className="text-xs text-accent font-semibold bg-accent/5 rounded-full px-4 py-1.5 inline-block">
                    💡 {word.word.length} letters, starts with "{word.word[0].toUpperCase()}"
                </p>
            </div>

            {/* Letter boxes */}
            <div className="flex justify-center gap-1 flex-wrap">
                {Array.from({ length: word.word.length }).map((_, i) => {
                    const typed = input[i] || "";
                    const color = submitted ? (colors[i] === "success" ? "border-success bg-success/10 text-success" : colors[i] === "destructive" ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-card") : typed ? "border-primary bg-primary/5 text-primary" : "border-border bg-card";
                    return (
                        <div
                            key={i}
                            className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all ${color}`}
                        >
                            {typed.toUpperCase()}
                        </div>
                    );
                })}
            </div>

            {/* Correction */}
            {submitted && !isCorrect && (
                <div className="text-center animate-fade-in-up">
                    <p className="text-xs text-destructive font-semibold">Correct spelling:</p>
                    <p className="text-lg font-bold text-foreground">{word.word}</p>
                </div>
            )}
            {submitted && isCorrect && (
                <p className="text-center text-success font-bold animate-fade-in-up">✓ Correct!</p>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => !submitted && setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Type the word..."
                    className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled={submitted}
                    maxLength={word.word.length + 5}
                />
                {!submitted ? (
                    <Button variant="coral" onClick={handleSubmit} disabled={!input.trim()}>
                        Check
                    </Button>
                ) : (
                    <Button variant="outline" disabled className="opacity-50">
                        {isCorrect ? "✓" : "✗"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SpellingBeeMode;
