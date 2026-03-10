import { Flame, Award, BookOpen, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VocabularyHeaderProps {
    totalLearned: number;
    streak: number;
    dailyProgress: number;
    dailyGoal: number;
    onContinue: () => void;
    // Premium props
    isPremium: boolean;
    dailyWordsUsed: number;
    dailyLimit: number;
    dailyRemaining: number;
    hasHitDailyLimit: boolean;
    onUpgradeClick: () => void;
}

const VocabularyHeader = ({
    totalLearned, streak, dailyProgress, dailyGoal, onContinue,
    isPremium, dailyWordsUsed, dailyLimit, dailyRemaining, hasHitDailyLimit, onUpgradeClick,
}: VocabularyHeaderProps) => {
    const progressPct = Math.min(100, Math.round((dailyProgress / dailyGoal) * 100));
    const masteryLabel = totalLearned >= 200 ? "Advanced Learner" : totalLearned >= 100 ? "Intermediate" : "Beginner";
    const masteryColor = totalLearned >= 200 ? "bg-accent/10 text-accent" : totalLearned >= 100 ? "bg-primary/10 text-primary" : "bg-success/10 text-success";

    // Free user daily word counter
    const freeProgressPct = Math.min(100, Math.round((dailyWordsUsed / dailyLimit) * 100));

    return (
        <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold leading-8 flex items-center gap-2">
                        📚 Vocabulary Master
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Master {isPremium ? "3000+" : "500"} academic words with audio pronunciation
                    </p>
                </div>
                {isPremium && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-gradient-to-r from-accent/10 to-warning/10 px-3 py-1.5 rounded-full border border-accent/20">
                        <Crown className="w-3.5 h-3.5" /> PREMIUM
                    </span>
                )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
                <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-card text-xs font-semibold shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary">{totalLearned}</span>
                    <span className="text-muted-foreground">/{isPremium ? "3000" : "500"}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 shadow-card text-xs font-semibold shrink-0">
                    <Flame className="w-3.5 h-3.5 text-accent" />
                    <span className="text-accent">{streak} days</span>
                    <span>🔥</span>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0 ${masteryColor}`}>
                    <Award className="w-3.5 h-3.5" />
                    {masteryLabel}
                </div>

                {/* Free user daily word counter badge */}
                {!isPremium && (
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0 whitespace-nowrap ${hasHitDailyLimit ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                        }`}>
                        {hasHitDailyLimit ? <Lock className="w-3 h-3" /> : <span className="text-xs">📖</span>}
                        Today: {dailyRemaining}/{dailyLimit} remaining
                    </div>
                )}
            </div>

            {/* Daily Goal Card */}
            <div className={`rounded-2xl p-5 shadow-card border ${hasHitDailyLimit
                ? "bg-gradient-to-r from-destructive/5 via-warning/5 to-destructive/5 border-destructive/10"
                : "bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/10"
                }`}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        {hasHitDailyLimit ? (
                            <>
                                <p className="text-sm font-bold text-foreground">
                                    🎉 Great job today!
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Come back tomorrow or upgrade for unlimited
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-foreground">
                                    Today's Goal: <span className="text-accent">{dailyGoal} words</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {dailyProgress >= dailyGoal ? "🎉 Goal completed!" : `${dailyGoal - dailyProgress} words remaining`}
                                </p>
                            </>
                        )}
                    </div>
                    {hasHitDailyLimit ? (
                        <Button variant="coral" size="sm" className="shrink-0 press" onClick={onUpgradeClick}>
                            <Crown className="w-3.5 h-3.5 mr-1" /> Upgrade
                        </Button>
                    ) : (
                        <Button variant="coral" size="sm" className="shrink-0 press" onClick={onContinue}>
                            {dailyProgress >= dailyGoal ? "Review More" : "Continue Learning →"}
                        </Button>
                    )}
                </div>

                {/* Progress bar */}
                {!isPremium ? (
                    <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${hasHitDailyLimit ? "bg-gradient-to-r from-destructive to-warning" : "bg-gradient-to-r from-primary to-accent"
                                }`}
                            style={{ width: `${freeProgressPct}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white drop-shadow-sm">
                                {dailyWordsUsed}/{dailyLimit} words today
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPct}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white drop-shadow-sm">
                                {dailyProgress}/{dailyGoal}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VocabularyHeader;
