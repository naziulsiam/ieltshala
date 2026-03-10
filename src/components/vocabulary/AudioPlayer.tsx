import { useState, useCallback, useRef, useEffect } from "react";
import { Volume2, Snail, Repeat, Pause, Lock, Loader2 } from "lucide-react";
import LockedOverlay from "./LockedOverlay";
import { speakWithBrowser, getBestEnglishVoice, stopSpeaking, type TTSOptions } from "@/services/tts";

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
    const [loading, setLoading] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize best voice on mount
    useEffect(() => {
        const initVoice = () => {
            const bestVoice = getBestEnglishVoice();
            setVoice(bestVoice);
        };

        // Voices might not be loaded immediately
        if (window.speechSynthesis.getVoices().length > 0) {
            initVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = initVoice;
        }

        return () => {
            stopSpeaking();
            if (repeatTimerRef.current) {
                clearTimeout(repeatTimerRef.current);
            }
        };
    }, []);

    const stop = useCallback(() => {
        stopSpeaking();
        setIsPlaying(false);
        setIsSlow(false);
        setRepeatCount(0);
        setLoading(false);
        if (repeatTimerRef.current) {
            clearTimeout(repeatTimerRef.current);
            repeatTimerRef.current = null;
        }
    }, []);

    const speak = useCallback((slow = false, repeats = 1) => {
        stopSpeaking();
        setLoading(true);
        setIsSlow(slow);

        let count = 0;

        const doSpeak = () => {
            setLoading(false);
            setIsPlaying(true);
            setRepeatCount(repeats - count);

            speakWithBrowser(word, {
                voice: voice || undefined,
                rate: slow ? 0.6 : 0.85,
                pitch: 1,
                onStart: () => {
                    setLoading(false);
                    setIsPlaying(true);
                },
                onEnd: () => {
                    count++;
                    if (count < repeats) {
                        repeatTimerRef.current = setTimeout(doSpeak, 800);
                    } else {
                        setIsPlaying(false);
                        setRepeatCount(0);
                        setIsSlow(false);
                    }
                },
                onError: () => {
                    setIsPlaying(false);
                    setLoading(false);
                    setRepeatCount(0);
                },
            });
        };

        doSpeak();
    }, [word, voice]);

    const syllables = word.replace(/([aeiou]+)/gi, "-$1").replace(/^-/, "").split("-").filter(Boolean);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Listen button (always available) */}
                <button
                    onClick={() => isPlaying ? stop() : speak(false, 1)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary px-4 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isPlaying && !isSlow ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                    {loading ? "Loading..." : isPlaying && !isSlow ? "Stop" : "Listen"}
                </button>

                {/* Slow button (locked for free) */}
                <div className="relative">
                    <button
                        onClick={() => {
                            if (!isPremium) { onLockedFeatureClick?.("Slow Audio"); return; }
                            speak(true, 1);
                        }}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring disabled:opacity-50 ${isPremium
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
                        disabled={loading}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all press focus-ring disabled:opacity-50 ${isPremium
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
                <div className="flex items-center justify-center gap-[3px] h-8 px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-[3px] bg-primary/60 rounded-full animate-pulse"
                            style={{
                                height: `${8 + Math.sin(Date.now() / 200 + i) * 12}px`,
                                animationDelay: `${i * 0.05}s`,
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
