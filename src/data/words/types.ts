// Extended word type used across the vocabulary system
export interface FullWord {
    id: string;
    word: string;
    phonetic: string;
    partOfSpeech: string;
    level: string; // CEFR: A2, B1, B2, C1, C2
    definition: string;
    examples: string[];
    bengali: string;
    bengaliTranslit: string;
    synonyms: string[];
    antonyms: string[];
    collocations: string[];
    category: string;
    subCategory: string;
}

// Compact format for efficient storage — converted to FullWord at runtime
// [word, phonetic, POS, CEFR, definition, bengali, bengaliTranslit, synonyms[], antonyms[], collocations[], examples[], subCategory]
export type CompactWord = [
    string, string, string, string, string,
    string, string,
    string[], string[], string[],
    string[], string
];

export function expandWords(compact: CompactWord[], category: string): FullWord[] {
    return compact.map((c, i) => ({
        id: `${category}-${i}`,
        word: c[0],
        phonetic: c[1],
        partOfSpeech: c[2],
        level: c[3],
        definition: c[4],
        bengali: c[5],
        bengaliTranslit: c[6],
        synonyms: c[7],
        antonyms: c[8],
        collocations: c[9],
        examples: c[10],
        category,
        subCategory: c[11],
    }));
}

// Question types generated from word data
export interface MCQuestion {
    type: "mcq";
    prompt: string;
    options: string[];
    correctIndex: number;
    wordId: string;
}

export interface TFQuestion {
    type: "tf";
    statement: string;
    correct: boolean;
    wordId: string;
}

export interface FillBlankQuestion {
    type: "fillblank";
    sentence: string;
    answer: string;
    options: string[];
    hint: string;
    wordId: string;
}

export interface AudioQuestion {
    type: "audio";
    word: string;
    options: string[];
    correctIndex: number;
    wordId: string;
}

export interface MatchPair {
    word: string;
    definition: string;
    wordId: string;
}

export interface SpellingQuestion {
    type: "spelling";
    word: string;
    hint: string;
    wordId: string;
}

export type GameQuestion = MCQuestion | TFQuestion | FillBlankQuestion | AudioQuestion | SpellingQuestion;
