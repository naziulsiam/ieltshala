import { useState, useMemo } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";
import { searchWords, type VocabWord } from "@/data/vocabularyData";

interface SearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
    onSelectWord: (word: VocabWord) => void;
}

const recentSearches = ["environment", "paradigm", "mitigate", "ubiquitous"];
const trendingWords = ["sustainability", "algorithm", "resilient", "unprecedented"];

const SearchBar = ({ query, onQueryChange, onSelectWord }: SearchBarProps) => {
    const [focused, setFocused] = useState(false);
    const results = useMemo(() => query.length >= 2 ? searchWords(query) : [], [query]);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">🔍 Search Words</h2>

            {/* Search input */}
            <div className={`relative bg-card rounded-xl shadow-card transition-all ${focused ? "ring-2 ring-primary/30" : ""}`}>
                <div className="flex items-center gap-2 px-4 py-3">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 200)}
                        placeholder="Search word, definition, or Bengali..."
                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                    {query && (
                        <button onClick={() => onQueryChange("")} className="text-xs text-muted-foreground hover:text-foreground press">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            {results.length > 0 ? (
                <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">{results.length} results found</p>
                    {results.slice(0, 20).map((word) => (
                        <button
                            key={word.id}
                            onClick={() => onSelectWord(word)}
                            className="w-full bg-card rounded-xl p-3.5 shadow-card card-interactive flex items-center gap-3 focus-ring text-left"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {word.word[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{word.word}</p>
                                <p className="text-xs text-muted-foreground truncate">{word.definition}</p>
                            </div>
                            <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded-full text-muted-foreground shrink-0">
                                {word.level}
                            </span>
                        </button>
                    ))}
                </div>
            ) : query.length >= 2 ? (
                <div className="bg-card rounded-xl p-6 shadow-card text-center">
                    <p className="text-3xl mb-2">🔎</p>
                    <p className="text-sm font-semibold text-muted-foreground">No words found for "{query}"</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different spelling or search in Bengali</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Recent searches */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <p className="text-xs font-semibold text-muted-foreground">Recent Searches</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map(s => (
                                <button key={s} onClick={() => onQueryChange(s)} className="text-xs bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 text-foreground font-medium press">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trending */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <TrendingUp className="w-3.5 h-3.5 text-accent" />
                            <p className="text-xs font-semibold text-muted-foreground">Trending This Week</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {trendingWords.map(s => (
                                <button key={s} onClick={() => onQueryChange(s)} className="text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-full hover:bg-accent/15 font-medium press">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
