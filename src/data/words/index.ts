import type { FullWord } from "./types";
import { educationWords } from "./education";
import { environmentWords } from "./environment";
import { technologyWords } from "./technology";
import { healthWords } from "./health";
import { workWords } from "./work";
import { travelWords } from "./travel";
import { governmentWords } from "./government";
import { artsWords } from "./arts";
import { urbanLifeWords } from "./urbanlife";
import { familyWords } from "./family";
import { abstractWords } from "./abstract";
import { scienceWords } from "./science";

// Full aggregated word library
export const allFullWords: FullWord[] = [
    ...educationWords,
    ...environmentWords,
    ...technologyWords,
    ...healthWords,
    ...workWords,
    ...travelWords,
    ...governmentWords,
    ...artsWords,
    ...urbanLifeWords,
    ...familyWords,
    ...abstractWords,
    ...scienceWords,
];

// Category metadata
export const categoryMeta: { id: string; name: string; emoji: string; words: FullWord[] }[] = [
    { id: "education", name: "Education", emoji: "🎓", words: educationWords },
    { id: "environment", name: "Environment", emoji: "🌍", words: environmentWords },
    { id: "technology", name: "Technology", emoji: "💻", words: technologyWords },
    { id: "health", name: "Health", emoji: "🏥", words: healthWords },
    { id: "work", name: "Work", emoji: "💼", words: workWords },
    { id: "travel", name: "Travel", emoji: "✈️", words: travelWords },
    { id: "government", name: "Government", emoji: "🏛️", words: governmentWords },
    { id: "arts", name: "Arts", emoji: "🎨", words: artsWords },
    { id: "urbanlife", name: "Urban Life", emoji: "🏙️", words: urbanLifeWords },
    { id: "family", name: "Family", emoji: "👨‍👩‍👧‍👦", words: familyWords },
    { id: "abstract", name: "Abstract", emoji: "🧠", words: abstractWords },
    { id: "science", name: "Science", emoji: "🔬", words: scienceWords },
];

// Special lists
export const awlWords = allFullWords.filter(w =>
    ["C1", "C2"].includes(w.level) && ["education", "science", "abstract"].includes(w.category)
);

export const band6Words = allFullWords.filter(w => w.level === "B1" || w.level === "B2");
export const band7Words = allFullWords.filter(w => w.level === "B2" || w.level === "C1");
export const band8Words = allFullWords.filter(w => w.level === "C1" || w.level === "C2");

export const essayVocab = allFullWords.filter(w =>
    ["education", "environment", "government", "abstract"].includes(w.category)
);

export const collocationList = allFullWords.filter(w => w.collocations.length >= 3);

// Free tier: 500 words from 3 categories
export const freeWords = allFullWords.filter(w =>
    ["education", "environment", "work"].includes(w.category)
).slice(0, 500);

// Helper functions
export function getWordsByCategory(cat: string): FullWord[] {
    return allFullWords.filter(w => w.category === cat);
}

export function getWordsBySubCategory(cat: string, sub: string): FullWord[] {
    return allFullWords.filter(w => w.category === cat && w.subCategory === sub);
}

export function getWordOfTheDay(): FullWord {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return allFullWords[dayOfYear % allFullWords.length];
}

export function searchWords(query: string): FullWord[] {
    const q = query.toLowerCase();
    return allFullWords.filter(
        w => w.word.toLowerCase().includes(q) ||
            w.definition.toLowerCase().includes(q) ||
            w.bengali.includes(q) ||
            w.bengaliTranslit.toLowerCase().includes(q) ||
            w.synonyms.some(s => s.toLowerCase().includes(q))
    );
}

// Re-export types
export type { FullWord } from "./types";
export * from "./generator";
