import type { TabId } from "@/hooks/useVocabulary";
import { BookOpen, RotateCcw, Star, Layers, List, Search } from "lucide-react";

interface VocabularyTabsProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    reviewCount: number;
    bookmarkCount: number;
}

const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
    { id: "learn", label: "Learn New", icon: BookOpen },
    { id: "review", label: "Review", icon: RotateCcw },
    { id: "bookmarked", label: "Bookmarked", icon: Star },
    { id: "topics", label: "By Topic", icon: Layers },
    { id: "lists", label: "Word Lists", icon: List },
    { id: "search", label: "Search", icon: Search },
];

const VocabularyTabs = ({ activeTab, onTabChange, reviewCount, bookmarkCount }: VocabularyTabsProps) => {
    return (
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex items-center gap-2 min-w-max pb-1">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const badge =
                        tab.id === "review" && reviewCount > 0 ? reviewCount :
                            tab.id === "bookmarked" && bookmarkCount > 0 ? bookmarkCount :
                                null;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all press focus-ring whitespace-nowrap ${isActive
                                    ? "bg-accent text-accent-foreground shadow-lg"
                                    : "bg-card text-muted-foreground hover:bg-secondary shadow-card"
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                            {badge && (
                                <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-accent/10 text-accent"
                                    }`}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VocabularyTabs;
