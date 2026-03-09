import { useState, useCallback, useEffect, useRef } from "react";
import { Volume2, ArrowLeft, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    onExit: () => void;
}

const FlashcardMode = ({ words, onExit }: Props) => {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [stats, setStats] = useState({ known: 0, learning: 0 });
    const [done, setDone] = useState(false);
    const touchStartX = useRef(0);
    const word = words[index];

    // Auto-play audio on front
    useEffect(() => {
        if (!flipped && word) {
            try {
                const u = new SpeechSynthesisUtterance(word.word);
                u.lang = "en-GB"; u.rate = 0.85;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(u);
            } catch { }
        }
    }, [index, flipped, word]);

    const advance = useCallback((known: boolean) => {
        setStats(s => known ? { ...s, known: s.known + 1 } : { ...s, learning: s.learning + 1 });
        setFlipped(false);
        if (index + 1 >= words.length) setDone(true);
        else setIndex(i => i + 1);
    }, [index, words.length]);

    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 60) advance(diff < 0); // swipe right = know, left = learning
    };

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === " ") setFlipped(f => !f);
            if (e.key === "ArrowRight") advance(true);
            if (e.key === "ArrowLeft") advance(false);
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [advance]);

    if (done) {
        const pct = Math.round((stats.known / words.length) * 100);
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-extrabold">Session Complete!</h3>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className="bg-success/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-success">{stats.known}</p>
                        <p className="text-xs text-success/70">Known ✓</p>
                    </div>
                    <div className="bg-warning/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-warning">{stats.learning}</p>
                        <p className="text-xs text-warning/70">Learning</p>
                    </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-sm text-muted-foreground">{pct}% accuracy</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { setIndex(0); setFlipped(false); setStats({ known: 0, learning: 0 }); setDone(false); }}>
                        <RotateCcw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                    <Button variant="coral" onClick={onExit}>Done</Button>
                </div>
            </div>
        );
    }

    if (!word) return null;

    return (
        <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between">
                <button onClick={onExit} className="text-sm font-semibold text-primary press">← Back</button>
                <span className="text-xs font-semibold text-muted-foreground">{index + 1}/{words.length}</span>
                <div className="flex gap-2 text-xs font-semibold">
                    <span className="text-success">✓ {stats.known}</span>
                    <span className="text-warning">~ {stats.learning}</span>
                </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((index) / words.length) * 100}%` }} />
            </div>

            {/* Card */}
            <div
                className="cursor-pointer perspective-1000"
                onClick={() => setFlipped(f => !f)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div className={`relative w-full min-h-[320px] transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-card rounded-2xl shadow-elevated p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${word.level === "C2" ? "bg-destructive/10 text-destructive" : word.level === "C1" ? "bg-purple/10 text-purple" : "bg-primary/10 text-primary"}`}>
                            {word.level} · {word.partOfSpeech}
                        </span>
                        <h2 className="text-4xl font-extrabold tracking-tight">{word.word}</h2>
                        <p className="text-sm text-muted-foreground font-mono">{word.phonetic}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); const u = new SpeechSynthesisUtterance(word.word); u.lang = "en-GB"; u.rate = 0.85; window.speechSynthesis.speak(u); }}
                            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold press"
                        >
                            <Volume2 className="w-4 h-4" /> Listen
                        </button>
                        <p className="text-xs text-muted-foreground animate-pulse">Tap to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card rounded-2xl shadow-elevated p-6 flex flex-col justify-center space-y-3 overflow-y-auto">
                        <p className="text-base font-medium text-foreground">{word.definition}</p>
                        <div className="border-t pt-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Example:</p>
                            <p className="text-sm text-foreground/80 italic">"{word.examples[0]}"</p>
                        </div>
                        <div className="bg-accent/5 rounded-xl p-3">
                            <p className="text-lg font-bold text-accent">{word.bengali}</p>
                            <p className="text-xs text-muted-foreground">({word.bengaliTranslit})</p>
                        </div>
                        {word.synonyms.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {word.synonyms.slice(0, 4).map(s => (
                                    <span key={s} className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Swipe buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    className="h-14 press border-warning/30 hover:bg-warning/10"
                    onClick={() => advance(false)}
                >
                    <ArrowLeft className="w-5 h-5 mr-2 text-warning" />
                    <span className="font-semibold text-warning">Still Learning</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-14 press border-success/30 hover:bg-success/10"
                    onClick={() => advance(true)}
                >
                    <span className="font-semibold text-success">I Know This</span>
                    <ArrowRight className="w-5 h-5 ml-2 text-success" />
                </Button>
            </div>
        </div>
    );
};

export default FlashcardMode;
