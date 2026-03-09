import { wordLists } from "@/data/vocabularyData";
import { ChevronRight } from "lucide-react";

interface WordListsProps {
    onSelectList: (listId: string) => void;
}

const sections = [
    { title: "🎓 Academic Word List", ids: ["awl"] },
    { title: "🎯 Band Score Targets", ids: ["band6", "band7", "band8"] },
    { title: "✍️ Task 2 Essay Vocabulary", ids: ["essay-opinion", "essay-cause", "essay-compare", "essay-problem"] },
    { title: "🔄 Common Synonyms", ids: ["syn-good", "syn-bad", "syn-important", "syn-change"] },
    { title: "🔗 Collocation Master Lists", ids: ["col-verb-noun", "col-adj-noun", "col-adv-adj"] },
];

const WordLists = ({ onSelectList }: WordListsProps) => {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">📋 IELTS Word Lists</h2>
            {sections.map((section, si) => (
                <div key={section.title} className="space-y-2 animate-fade-in-up" style={{ animationDelay: `${si * 0.08}s` }}>
                    <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
                    <div className="space-y-1.5">
                        {section.ids.map(id => {
                            const list = wordLists.find(l => l.id === id);
                            if (!list) return null;
                            return (
                                <button
                                    key={id}
                                    onClick={() => onSelectList(id)}
                                    className="w-full bg-card rounded-xl p-3.5 shadow-card card-interactive flex items-center gap-3 focus-ring"
                                >
                                    <span className="text-xl">{list.icon}</span>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-semibold truncate">{list.name}</p>
                                        <p className="text-xs text-muted-foreground">{list.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            {list.wordCount}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WordLists;
