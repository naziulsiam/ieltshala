import { learningModes } from "@/data/vocabularyData";
import { Lock, Crown } from "lucide-react";

interface LearningModesProps {
    activeMode: string | null;
    onSelectMode: (modeId: string | null) => void;
    onStartMode: (modeId: string) => void;
    isModeLocked?: (modeId: string) => boolean;
    onUpgradeClick?: () => void;
}

const LearningModes = ({ activeMode, onSelectMode, onStartMode, isModeLocked, onUpgradeClick }: LearningModesProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">🎮 Learning Modes</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {learningModes.map((mode, i) => {
                    const locked = isModeLocked?.(mode.id) ?? false;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => locked ? onUpgradeClick?.() : onStartMode(mode.id)}
                            className={`relative bg-card rounded-xl p-4 shadow-card text-left focus-ring animate-fade-in-up ${locked ? "opacity-50 grayscale-[30%]" : "card-interactive"
                                }`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            {locked && (
                                <div className="absolute top-2 right-2 z-10">
                                    <span className="flex items-center gap-0.5 text-[9px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                        <Lock className="w-2.5 h-2.5" /> PRO
                                    </span>
                                </div>
                            )}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mode.color} mb-3`}>
                                <span className="text-xl">{mode.icon}</span>
                            </div>
                            <p className="text-sm font-semibold mb-0.5">{mode.name}</p>
                            <p className="text-[11px] text-muted-foreground leading-snug">{mode.description}</p>
                            {locked && (
                                <p className="text-[10px] font-semibold text-accent mt-2 flex items-center gap-1">
                                    <Crown className="w-3 h-3" /> Upgrade to unlock
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LearningModes;
