import { useState, useCallback, useRef, useEffect } from "react";
import { Volume2, Snail, Repeat, Pause, Lock } from "lucide-react";
import LockedOverlay from "./LockedOverlay";

interface AudioPlayerProps {
    word: string;
    phonetic: string;
    isPremium?: boolean;
    onLockedFeatureClick?: (feature: string) => void;
}

const AudioPlayer = ({ word, phonetic, isPremium = true, onLockedFeatureClick }: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSlow, setIsSlow] = useState(false);
    const [repeatCount, setRepeatCount] = useState(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const barsRef = useRef<HTMLDivElement>(null);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setRepeatCount(0);
    }, []);

    useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

    const speak = useCallback((slow = false, repeats = 1) => {
        window.speechSynthesis.cancel();
        let count = 0;

        const doSpeak = () => {
            const u = new SpeechSynthesisUtterance(word);
            u.lang = "en-GB";
            u.rate = slow ? 0.55 : 0.85;
            u.pitch = 1;

            const voices = window.speechSynthesis.getVoices();
            const brit = voices.find(v => v.lang === "en-GB") || voices.find(v => v.lang.startsWith("en"));
            if (brit) u.voice = brit;

            u.onstart = () => setIsPlaying(true);
            u.onend = () => {
                count++;
                if (count < repeats) {
                    setTimeout(doSpeak, 600);
                } else {
                    setIsPlaying(false);
                    setRepeatCount(0);
                }
            };
            u.onerror = () => { setIsPlaying(false); setRepeatCount(0); };
            utteranceRef.current = u;
            window.speechSynthesis.speak(u);
        };

        setRepeatCount(repeats);
        doSpeak();
    }, [word]);

    const syllables = word.replace(/([aeiou]+)/gi, "-$1").replace(/^-/, "").split("-").filter(Boolean);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                {/* Listen button (always available) */}
                <button
                    onClick={() => isPlaying ? stop() : speak(false, 1)}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary px-4 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring"
                >
                    {isPlaying && !isSlow ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isPlaying && !isSlow ? "Stop" : "Listen"}
                </button>

                {/* Slow button (locked for free) */}
                <div className="relative">
                    <button
                        onClick={() => {
                            if (!isPremium) { onLockedFeatureClick?.("Slow Audio"); return; }
                            setIsSlow(true); speak(true, 1);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring ${isPremium
                                ? "bg-accent/10 hover:bg-accent/15 text-accent"
                                : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                            }`}
                    >
                        <Snail className="w-4 h-4" />
                        Slow
                        {!isPremium && <Lock className="w-3 h-3 ml-0.5" />}
                    </button>
                </div>

                {/* Repeat (locked for free) */}
                <div className="relative">
                    <button
                        onClick={() => {
                            if (!isPremium) { onLockedFeatureClick?.("Repeat Audio"); return; }
                            speak(false, 3);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring ${isPremium
                                ? "bg-success/10 hover:bg-success/15 text-success"
                                : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                            }`}
                    >
                        <Repeat className="w-4 h-4" />
                        ×3
                        {!isPremium && <Lock className="w-3 h-3 ml-0.5" />}
                    </button>
                </div>
            </div>

            {/* Visual waveform */}
            {isPlaying && (
                <div ref={barsRef} className="flex items-center justify-center gap-[3px] h-8 px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-[3px] bg-primary/60 rounded-full"
                            style={{
                                animation: `waveform 0.8s ease-in-out ${i * 0.05}s infinite alternate`,
                                height: `${8 + Math.random() * 20}px`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Syllable breakdown (shown when slow is active) */}
            {isPlaying && isSlow && syllables.length > 1 && (
                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Syllable breakdown:</p>
                    <p className="text-sm font-semibold tracking-wider">
                        {syllables.map((s, i) => (
                            <span key={i}>
                                <span className="text-primary">{s}</span>
                                {i < syllables.length - 1 && <span className="text-muted-foreground mx-0.5">·</span>}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {/* Phonetic */}
            <p className="text-center text-sm text-muted-foreground font-mono">{phonetic}</p>
        </div>
    );
};

export default AudioPlayer;
