import { categories } from "@/data/vocabularyData";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface CategoryDetailProps {
    categoryId: string;
    onBack: () => void;
    onSelectSubCategory: (sub: string) => void;
}

const CategoryDetail = ({ categoryId, onBack, onSelectSubCategory }: CategoryDetailProps) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;

    return (
        <div className="space-y-4 animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors press">
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
            </button>

            <div className="flex items-center gap-3">
                <span className="text-3xl">{category.emoji}</span>
                <div>
                    <h2 className="text-lg font-bold">{category.name}</h2>
                    <p className="text-xs text-muted-foreground">{category.totalWords} words · {category.subCategories.length} sub-topics</p>
                </div>
            </div>

            <div className="space-y-2">
                {category.subCategories.map((sub, i) => {
                    const prog = Math.round(Math.random() * 70 + 15);
                    return (
                        <button
                            key={sub.name}
                            onClick={() => onSelectSubCategory(sub.name)}
                            className="w-full bg-card rounded-xl p-4 shadow-card card-interactive flex items-center gap-4 focus-ring animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="flex-1 text-left">
                                <p className="text-sm font-semibold">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">{sub.wordCount} words</p>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2 max-w-[200px]">
                                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${prog}%` }} />
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryDetail;
