import { useState, useEffect } from "react";
import { Trophy, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyChallengeProps {
    isPremium: boolean;
    onStartChallenge: () => void;
    onUpgrade: () => void;
}

const DailyChallenge = ({ isPremium, onStartChallenge, onUpgrade }: DailyChallengeProps) => {
    const [challengeState, setChallengeState] = useState(() => {
        try {
            const raw = localStorage.getItem("ieltshala-daily-challenge");
            if (raw) {
                const parsed = JSON.parse(raw);
                const today = new Date().toISOString().split("T")[0];
                if (parsed.date === today) return parsed;
            }
        } catch { }
        return { date: new Date().toISOString().split("T")[0], completed: false, wordsCompleted: 0, target: 20, badgesEarned: 0 };
    });

    useEffect(() => {
        try { localStorage.setItem("ieltshala-daily-challenge", JSON.stringify(challengeState)); } catch { }
    }, [challengeState]);

    const badges = [
        { name: "First Steps", emoji: "🌱", desc: "Complete 1 challenge", required: 1 },
        { name: "On Fire", emoji: "🔥", desc: "3-day streak", required: 3 },
        { name: "Vocabulary Hero", emoji: "🦸", desc: "7-day streak", required: 7 },
        { name: "Master Scholar", emoji: "🎓", desc: "30-day streak", required: 30 },
    ];

    const progressPct = Math.round((challengeState.wordsCompleted / challengeState.target) * 100);

    return (
        <div className="bg-gradient-to-br from-accent/5 via-warning/5 to-accent/5 rounded-2xl p-5 shadow-card border border-accent/10 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-warning flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Daily Challenge</h3>
                        <p className="text-[11px] text-muted-foreground">Master 20 words in Speed mode</p>
                    </div>
                </div>
                {challengeState.completed && (
                    <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">✓ Done!</span>
                )}
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">{challengeState.wordsCompleted}/{challengeState.target} words</span>
                    <span className="font-bold text-accent">{progressPct}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent to-warning rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                    />
                </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {badges.map((b, i) => (
                    <div
                        key={i}
                        className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-center ${challengeState.badgesEarned > i ? "bg-accent/10" : "bg-secondary/50 opacity-40"
                            }`}
                    >
                        <span className="text-lg">{b.emoji}</span>
                        <span className="text-[9px] font-bold text-foreground/80">{b.name}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            {!challengeState.completed ? (
                isPremium ? (
                    <Button variant="coral" className="w-full press" onClick={onStartChallenge}>
                        <Zap className="w-4 h-4 mr-1" /> Start Speed Challenge →
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full press" onClick={onUpgrade}>
                        <Crown className="w-4 h-4 mr-1" /> Unlock Daily Challenges — Premium
                    </Button>
                )
            ) : (
                <div className="text-center">
                    <p className="text-xs text-success font-semibold">🎉 Challenge completed! Come back tomorrow.</p>
                </div>
            )}

            {/* Reward */}
            {challengeState.completed && (
                <div className="bg-accent/5 rounded-xl p-3 text-center animate-fade-in-up">
                    <Trophy className="w-6 h-6 text-accent mx-auto mb-1" />
                    <p className="text-xs font-bold text-accent">Badge Earned: Speed Demon ⚡</p>
                </div>
            )}
        </div>
    );
};

export default DailyChallenge;
