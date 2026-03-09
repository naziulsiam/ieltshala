import { categories } from "@/data/vocabularyData";
import { ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import LockedOverlay from "./LockedOverlay";

interface CategoryGridProps {
    onSelectCategory: (catId: string) => void;
    progressMap?: Record<string, number>;
    isCategoryLocked?: (catId: string) => boolean;
    onUpgradeClick?: () => void;
}

const CategoryGrid = ({ onSelectCategory, progressMap = {}, isCategoryLocked, onUpgradeClick }: CategoryGridProps) => {
    const [showAll, setShowAll] = useState(false);
    const mainCats = categories.slice(0, 6);
    const extraCats = categories.slice(6);
    const displayCats = showAll ? categories : mainCats;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">📚 Vocabulary Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayCats.map((cat, i) => {
                    const locked = isCategoryLocked?.(cat.id) ?? false;
                    const prog = locked ? 0 : (progressMap[cat.id] || Math.round(Math.random() * 80 + 10));

                    return (
                        <button
                            key={cat.id}
                            onClick={() => locked ? onUpgradeClick?.() : onSelectCategory(cat.id)}
                            className={`relative bg-card rounded-xl p-4 shadow-card text-left focus-ring animate-fade-in-up ${locked ? "opacity-60 grayscale-[30%]" : "card-interactive"
                                }`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {locked && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/70 backdrop-blur-[1px] rounded-xl">
                                    <Lock className="w-5 h-5 text-muted-foreground mb-1" />
                                    <span className="text-[10px] font-bold text-muted-foreground">🔒 Premium</span>
                                    <span className="text-[9px] font-semibold text-accent mt-0.5">Upgrade to unlock</span>
                                </div>
                            )}
                            <span className="text-2xl mb-2 block">{cat.emoji}</span>
                            <p className="text-sm font-semibold truncate">{cat.name}</p>
                            <p className="text-[11px] text-muted-foreground mb-2">{cat.totalWords} words</p>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${prog}%` }} />
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                                <p className="text-[10px] text-muted-foreground">{locked ? "Locked" : `${prog}% learned`}</p>
                                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            </div>
                        </button>
                    );
                })}
            </div>
            {!showAll && extraCats.length > 0 && (
                <button
                    onClick={() => setShowAll(true)}
                    className="w-full text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors py-2 press"
                >
                    Show {extraCats.length} More Categories →
                </button>
            )}
        </div>
    );
};

export default CategoryGrid;
