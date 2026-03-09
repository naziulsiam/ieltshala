import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, StickyNote, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "./AudioPlayer";
import type { VocabWord } from "@/data/vocabularyData";
import type { Difficulty } from "@/hooks/useVocabulary";

interface WordCardProps {
    word: VocabWord;
    index: number;
    total: number;
    isBookmarked: boolean;
    showBengali: boolean;
    note?: string;
    onNext: () => void;
    onPrev: () => void;
    onRate: (wordId: string, difficulty: Difficulty) => void;
    onToggleBookmark: (wordId: string) => void;
    onSetNote: (wordId: string, note: string) => void;
    onToggleBengali: () => void;
    isPremium?: boolean;
    onLockedFeatureClick?: (feature: string) => void;
}

const WordCard = ({
    word, index, total, isBookmarked, showBengali, note,
    onNext, onPrev, onRate, onToggleBookmark, onSetNote, onToggleBengali,
    isPremium = true, onLockedFeatureClick,
}: WordCardProps) => {
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState(note || "");
    const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
    const touchStartX = useRef(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setNoteText(note || ""); }, [note]);
    useEffect(() => {
        if (slideDir) {
            const timer = setTimeout(() => setSlideDir(null), 300);
            return () => clearTimeout(timer);
        }
    }, [slideDir]);

    const handleNext = useCallback(() => { setSlideDir("left"); onNext(); }, [onNext]);
    const handlePrev = useCallback(() => { setSlideDir("right"); onPrev(); }, [onPrev]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            else if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleNext, handlePrev]);

    // Touch swipe
    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 60) {
            diff > 0 ? handleNext() : handlePrev();
        }
    };

    const levelColor =
        word.level === "C2" ? "bg-destructive/10 text-destructive" :
            word.level === "C1" ? "bg-purple/10 text-purple" :
                "bg-primary/10 text-primary";

    return (
        <div className="space-y-4">
            {/* Navigation arrows + counter */}
            <div className="flex items-center justify-between">
                <button onClick={handlePrev} className="w-10 h-10 rounded-xl bg-card shadow-card flex items-center justify-center hover:bg-secondary transition-colors press focus-ring">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <span className="text-xs font-semibold text-muted-foreground">{index + 1} / {total}</span>
                <button onClick={handleNext} className="w-10 h-10 rounded-xl bg-card shadow-card flex items-center justify-center hover:bg-secondary transition-colors press focus-ring">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Main card */}
            <div
                ref={cardRef}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={`bg-card rounded-2xl shadow-elevated p-6 md:p-8 space-y-5 transition-all duration-300 ${slideDir === "left" ? "animate-fade-in-up" : slideDir === "right" ? "animate-fade-in-up" : ""
                    }`}
            >
                {/* Word header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${levelColor}`}>
                            {word.level}
                        </span>
                        <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                            {word.partOfSpeech}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        {word.word}
                    </h2>
                </div>

                {/* Audio */}
                <AudioPlayer word={word.word} phonetic={word.phonetic} isPremium={isPremium} onLockedFeatureClick={onLockedFeatureClick} />

                {/* Definition */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                    <p className="text-base font-medium text-foreground leading-relaxed">
                        "{word.definition}"
                    </p>
                    <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Example:</p>
                        <p className="text-sm text-foreground/80 italic">
                            "{word.example}"
                        </p>
                    </div>
                </div>

                {/* Bengali section */}
                <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-muted-foreground">Bengali Translation</p>
                        <button
                            onClick={onToggleBengali}
                            className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80 transition-colors press"
                        >
                            {showBengali ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showBengali ? "Hide" : "Show"}
                        </button>
                    </div>
                    {showBengali && (
                        <div className="bg-accent/5 rounded-xl p-3 animate-fade-in-up">
                            <p className="text-lg font-bold text-accent">{word.bengali}</p>
                            <p className="text-xs text-muted-foreground">({word.bengaliTranslit})</p>
                        </div>
                    )}
                </div>

                {/* Synonyms */}
                {word.synonyms.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Synonyms</p>
                        <div className="flex flex-wrap gap-1.5">
                            {word.synonyms.map(s => (
                                <span key={s} className="text-xs bg-primary/8 text-primary font-medium px-2.5 py-1 rounded-full border border-primary/10">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Collocations */}
                {word.collocations.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Collocations</p>
                        <div className="flex flex-col gap-1">
                            {word.collocations.map(c => (
                                <span key={c} className="text-sm text-foreground/80 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Did you know this word? */}
            <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">Did you know this word?</p>
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        variant="outline"
                        className="h-auto py-3 press border-success/30 hover:bg-success/10 hover:border-success/50"
                        onClick={() => { onRate(word.id, "easy"); handleNext(); }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-base">😊</span>
                            <span className="text-xs font-semibold text-success">Easy</span>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto py-3 press border-warning/30 hover:bg-warning/10 hover:border-warning/50"
                        onClick={() => { onRate(word.id, "learning"); handleNext(); }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-base">🤔</span>
                            <span className="text-xs font-semibold text-warning">Learning</span>
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto py-3 press border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                        onClick={() => { onRate(word.id, "hard"); handleNext(); }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-base">😰</span>
                            <span className="text-xs font-semibold text-destructive">Hard</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => onToggleBookmark(word.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all press focus-ring ${isBookmarked
                        ? "bg-warning/10 text-warning"
                        : "bg-card shadow-card text-muted-foreground hover:bg-secondary"
                        }`}
                >
                    <Star className={`w-4 h-4 ${isBookmarked ? "fill-warning" : ""}`} />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
                <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-card shadow-card text-muted-foreground hover:bg-secondary transition-all press focus-ring"
                >
                    <StickyNote className="w-4 h-4" />
                    {note ? "Edit Note" : "Add Note"}
                </button>
            </div>

            {/* Note input */}
            {showNoteInput && (
                <div className="bg-card rounded-xl p-4 shadow-card animate-fade-in-up space-y-2">
                    <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Write your note here..."
                        className="w-full bg-secondary rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>Cancel</Button>
                        <Button variant="coral" size="sm" onClick={() => { onSetNote(word.id, noteText); setShowNoteInput(false); }}>
                            Save Note
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordCard;
