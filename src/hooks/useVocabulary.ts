import { useState, useCallback, useEffect } from "react";
import { allWords, type VocabWord } from "@/data/vocabularyData";

export type TabId = "learn" | "review" | "bookmarked" | "topics" | "lists" | "search";
export type Difficulty = "easy" | "learning" | "hard";

interface WordProgress {
    difficulty: Difficulty;
    nextReview: number; // timestamp
    interval: number; // days
    easeFactor: number;
    reviewCount: number;
}

interface VocabularyState {
    activeTab: TabId;
    currentIndex: number;
    bookmarks: Set<string>;
    notes: Record<string, string>;
    progress: Record<string, WordProgress>;
    dailyLearned: string[];
    dailyDate: string;
    streak: number;
    lastStudyDate: string;
    selectedCategory: string | null;
    selectedSubCategory: string | null;
    selectedList: string | null;
    searchQuery: string;
    activeLearningMode: string | null;
    showBengali: boolean;
}

const STORAGE_KEY = "ieltshala-vocab-state";

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

function loadState(): Partial<VocabularyState> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed.bookmarks) parsed.bookmarks = new Set(parsed.bookmarks);
        return parsed;
    } catch { return {}; }
}

function saveState(state: VocabularyState) {
    try {
        const toSave = {
            ...state,
            bookmarks: Array.from(state.bookmarks),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* quota exceeded */ }
}

const defaultState: VocabularyState = {
    activeTab: "learn",
    currentIndex: 0,
    bookmarks: new Set(),
    notes: {},
    progress: {},
    dailyLearned: [],
    dailyDate: getToday(),
    streak: 12,
    lastStudyDate: getToday(),
    selectedCategory: null,
    selectedSubCategory: null,
    selectedList: null,
    searchQuery: "",
    activeLearningMode: null,
    showBengali: true,
};

export function useVocabulary() {
    const [state, setState] = useState<VocabularyState>(() => {
        const saved = loadState();
        const merged = { ...defaultState, ...saved };
        // reset daily if new day
        if (merged.dailyDate !== getToday()) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().split("T")[0];
            merged.streak = merged.lastStudyDate === yStr ? merged.streak + 1 : 1;
            merged.dailyLearned = [];
            merged.dailyDate = getToday();
            merged.lastStudyDate = getToday();
        }
        return merged;
    });

    useEffect(() => { saveState(state); }, [state]);

    const setTab = useCallback((tab: TabId) => {
        setState(s => ({ ...s, activeTab: tab, selectedCategory: null, selectedSubCategory: null, selectedList: null, searchQuery: "" }));
    }, []);

    const setCurrentIndex = useCallback((index: number) => {
        setState(s => ({ ...s, currentIndex: index }));
    }, []);

    const nextWord = useCallback((words: VocabWord[]) => {
        setState(s => ({ ...s, currentIndex: (s.currentIndex + 1) % words.length }));
    }, []);

    const prevWord = useCallback((words: VocabWord[]) => {
        setState(s => ({ ...s, currentIndex: (s.currentIndex - 1 + words.length) % words.length }));
    }, []);

    const toggleBookmark = useCallback((wordId: string) => {
        setState(s => {
            const bm = new Set(s.bookmarks);
            bm.has(wordId) ? bm.delete(wordId) : bm.add(wordId);
            return { ...s, bookmarks: bm };
        });
    }, []);

    const setNote = useCallback((wordId: string, note: string) => {
        setState(s => ({ ...s, notes: { ...s.notes, [wordId]: note } }));
    }, []);

    const rateDifficulty = useCallback((wordId: string, difficulty: Difficulty) => {
        setState(s => {
            const prev = s.progress[wordId] || { difficulty: "hard", nextReview: 0, interval: 1, easeFactor: 2.5, reviewCount: 0 };
            let { interval, easeFactor } = prev;
            if (difficulty === "easy") {
                interval = Math.max(1, Math.round(interval * easeFactor));
                easeFactor = Math.min(3.0, easeFactor + 0.15);
            } else if (difficulty === "learning") {
                interval = Math.max(1, Math.round(interval * 1.2));
            } else {
                interval = 1;
                easeFactor = Math.max(1.3, easeFactor - 0.2);
            }
            const nextReview = Date.now() + interval * 86400000;
            const dailyLearned = s.dailyLearned.includes(wordId) ? s.dailyLearned : [...s.dailyLearned, wordId];
            return {
                ...s,
                progress: { ...s.progress, [wordId]: { difficulty, nextReview, interval, easeFactor, reviewCount: prev.reviewCount + 1 } },
                dailyLearned,
                lastStudyDate: getToday(),
            };
        });
    }, []);

    const selectCategory = useCallback((catId: string | null) => {
        setState(s => ({ ...s, selectedCategory: catId, selectedSubCategory: null, currentIndex: 0 }));
    }, []);

    const selectSubCategory = useCallback((sub: string | null) => {
        setState(s => ({ ...s, selectedSubCategory: sub, currentIndex: 0 }));
    }, []);

    const selectList = useCallback((listId: string | null) => {
        setState(s => ({ ...s, selectedList: listId, currentIndex: 0 }));
    }, []);

    const setSearchQuery = useCallback((q: string) => {
        setState(s => ({ ...s, searchQuery: q, currentIndex: 0 }));
    }, []);

    const setLearningMode = useCallback((mode: string | null) => {
        setState(s => ({ ...s, activeLearningMode: mode }));
    }, []);

    const toggleBengali = useCallback(() => {
        setState(s => ({ ...s, showBengali: !s.showBengali }));
    }, []);

    // Computed values
    const totalLearned = Object.keys(state.progress).length;
    const dailyGoal = 15;
    const dailyProgress = state.dailyLearned.length;

    const reviewDue = allWords.filter(w => {
        const p = state.progress[w.id];
        return p && p.nextReview <= Date.now();
    });

    const bookmarkedWords = allWords.filter(w => state.bookmarks.has(w.id));

    const masteryStats = {
        mastered: Object.values(state.progress).filter(p => p.reviewCount >= 5 && p.difficulty === "easy").length,
        learning: Object.values(state.progress).filter(p => p.reviewCount < 5 || p.difficulty !== "easy").length,
        newWords: allWords.length - Object.keys(state.progress).length,
        accuracy: Object.values(state.progress).length > 0
            ? Math.round((Object.values(state.progress).filter(p => p.difficulty === "easy").length / Object.values(state.progress).length) * 100)
            : 0,
    };

    return {
        ...state,
        setTab, setCurrentIndex, nextWord, prevWord,
        toggleBookmark, setNote, rateDifficulty,
        selectCategory, selectSubCategory, selectList,
        setSearchQuery, setLearningMode, toggleBengali,
        totalLearned, dailyGoal, dailyProgress,
        reviewDue, bookmarkedWords, masteryStats,
    };
}
