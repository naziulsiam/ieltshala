import { useState, useCallback, useEffect } from "react";
import { Volume2, Trophy, RotateCcw } from "lucide-react";
import type { FullWord } from "@/data/words/types";
import { generateAudioQ } from "@/data/words/generator";
import { Button } from "@/components/ui/button";

interface Props {
    words: FullWord[];
    allWords: FullWord[];
    onExit: () => void;
}

const ListenLearnMode = ({ words, allWords, onExit }: Props) => {
    const [questions] = useState(() =>
        words.slice(0, 10).map(w => generateAudioQ(w, allWords))
    );
    const [qi, setQi] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [done, setDone] = useState(false);

    const q = questions[qi];

    // Auto-play audio for current word
    const playWord = useCallback(() => {
        if (!q) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(q.word);
        u.lang = "en-GB"; u.rate = 0.85;
        u.onstart = () => setIsPlaying(true);
        u.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(u);
    }, [q]);

    useEffect(() => { playWord(); }, [qi, playWord]);

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === q.correctIndex;
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            if (qi + 1 >= questions.length) setDone(true);
            else { setQi(i => i + 1); setSelected(null); }
        }, 1200);
    };

    if (done) {
        const pct = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-5 animate-fade-in-up">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h3 className="text-2xl font-extrabold">Listen & Learn Complete!</h3>
                <div className="text-5xl font-black text-accent">{pct}%</div>
                <p className="text-sm text-muted-foreground">{score}/{questions.length} correct</p>
                <div className="w-full bg-secondary rounded-full h-3"><div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} /></div>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => { setQi(0); setScore(0); setSelected(null); setDone(false); }}>
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

            {/* Audio display */}
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-4">
                <h3 className="text-lg font-bold text-muted-foreground">🎧 What word do you hear?</h3>

                <button
                    onClick={playWord}
                    className="w-20 h-20 rounded-full bg-primary/10 hover:bg-primary/15 flex items-center justify-center mx-auto press transition-all"
                >
                    <Volume2 className={`w-8 h-8 text-primary ${isPlaying ? "animate-pulse" : ""}`} />
                </button>

                {/* Waveform */}
                {isPlaying && (
                    <div className="flex items-center justify-center gap-[3px] h-8">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="w-[3px] bg-primary/60 rounded-full" style={{ animation: `waveform 0.8s ease-in-out ${i * 0.05}s infinite alternate`, height: `${8 + Math.random() * 20}px` }} />
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">Tap to replay</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt, i) => {
                    let cls = "bg-card shadow-card text-foreground border border-border hover:border-primary/30";
                    if (selected !== null) {
                        if (i === q.correctIndex) cls = "bg-success/10 text-success border-success shadow-card ring-2 ring-success/30";
                        else if (i === selected) cls = "bg-destructive/10 text-destructive border-destructive shadow-card ring-2 ring-destructive/30";
                        else cls = "bg-card/50 text-muted-foreground border-border opacity-50";
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            disabled={selected !== null}
                            className={`w-full p-4 rounded-xl text-left text-sm font-semibold transition-all press ${cls}`}
                        >
                            <span className="mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ListenLearnMode;
