import type { FullWord, MCQuestion, TFQuestion, FillBlankQuestion, AudioQuestion, MatchPair, SpellingQuestion, GameQuestion } from "./types";

// Shuffle array utility
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Pick N random items from array, excluding specific items
function pickRandom<T>(arr: T[], n: number, exclude: T[] = []): T[] {
    const pool = arr.filter(x => !exclude.includes(x));
    return shuffle(pool).slice(0, n);
}

// Generate MCQ: "What does [word] mean?"
export function generateDefinitionMCQ(word: FullWord, allWords: FullWord[]): MCQuestion {
    const distractors = pickRandom(
        allWords.filter(w => w.id !== word.id).map(w => w.definition),
        3,
        [word.definition]
    );
    const options = shuffle([word.definition, ...distractors]);
    return {
        type: "mcq",
        prompt: `What does "${word.word}" mean?`,
        options,
        correctIndex: options.indexOf(word.definition),
        wordId: word.id,
    };
}

// Generate MCQ: "Which word means [definition]?"
export function generateWordFromDefMCQ(word: FullWord, allWords: FullWord[]): MCQuestion {
    const distractors = pickRandom(
        allWords.filter(w => w.id !== word.id).map(w => w.word),
        3,
        [word.word]
    );
    const options = shuffle([word.word, ...distractors]);
    return {
        type: "mcq",
        prompt: `Which word means: "${word.definition}"?`,
        options,
        correctIndex: options.indexOf(word.word),
        wordId: word.id,
    };
}

// Generate MCQ: synonym-based
export function generateSynonymMCQ(word: FullWord, allWords: FullWord[]): MCQuestion {
    if (word.synonyms.length === 0) return generateDefinitionMCQ(word, allWords);
    const correct = word.synonyms[Math.floor(Math.random() * word.synonyms.length)];
    const distractors = pickRandom(
        allWords.flatMap(w => w.synonyms).filter(s => !word.synonyms.includes(s)),
        3
    );
    if (distractors.length < 3) return generateDefinitionMCQ(word, allWords);
    const options = shuffle([correct, ...distractors]);
    return {
        type: "mcq",
        prompt: `Which is a synonym of "${word.word}"?`,
        options,
        correctIndex: options.indexOf(correct),
        wordId: word.id,
    };
}

// Generate True/False
export function generateTF(word: FullWord, allWords: FullWord[]): TFQuestion {
    const isCorrect = Math.random() > 0.5;
    if (isCorrect) {
        return {
            type: "tf",
            statement: `"${word.word}" means: ${word.definition}`,
            correct: true,
            wordId: word.id,
        };
    }
    const wrongDef = pickRandom(allWords.filter(w => w.id !== word.id), 1)[0];
    return {
        type: "tf",
        statement: `"${word.word}" means: ${wrongDef?.definition || "unknown"}`,
        correct: false,
        wordId: word.id,
    };
}

// Generate Fill in the Blank
export function generateFillBlank(word: FullWord, allWords: FullWord[]): FillBlankQuestion {
    const example = word.examples[Math.floor(Math.random() * word.examples.length)] || `The concept of ${word.word} is important in academic writing.`;
    const regex = new RegExp(`\\b${word.word}\\b`, "gi");
    let sentence = example.replace(regex, "______");
    if (!sentence.includes("______")) {
        sentence = example.replace(word.word.toLowerCase(), "______");
    }
    if (!sentence.includes("______")) {
        sentence = `The ______ was evident in the research findings. (Meaning: ${word.definition})`;
    }
    const distractors = pickRandom(
        allWords.filter(w => w.id !== word.id && w.partOfSpeech === word.partOfSpeech).map(w => w.word),
        3,
        [word.word]
    );
    if (distractors.length < 3) {
        distractors.push(...pickRandom(allWords.filter(w => w.id !== word.id).map(w => w.word), 3 - distractors.length));
    }
    const options = shuffle([word.word, ...distractors.slice(0, 3)]);
    return {
        type: "fillblank",
        sentence,
        answer: word.word,
        options,
        hint: `${word.word.length} letters, starts with "${word.word[0]}"`,
        wordId: word.id,
    };
}

// Generate Audio Recognition
export function generateAudioQ(word: FullWord, allWords: FullWord[]): AudioQuestion {
    const distractors = pickRandom(
        allWords.filter(w => w.id !== word.id).map(w => w.word),
        3,
        [word.word]
    );
    const options = shuffle([word.word, ...distractors]);
    return {
        type: "audio",
        word: word.word,
        options,
        correctIndex: options.indexOf(word.word),
        wordId: word.id,
    };
}

// Generate Spelling question
export function generateSpelling(word: FullWord): SpellingQuestion {
    return {
        type: "spelling",
        word: word.word,
        hint: `${word.word.length} letters, starts with "${word.word[0].toUpperCase()}"`,
        wordId: word.id,
    };
}

// Generate Match Pairs (6 words + definitions)
export function generateMatchPairs(words: FullWord[]): MatchPair[] {
    const selected = shuffle(words).slice(0, 6);
    return selected.map(w => ({
        word: w.word,
        definition: w.definition,
        wordId: w.id,
    }));
}

// Generate a batch of mixed questions for a mode
export function generateQuestionBatch(
    words: FullWord[],
    allWords: FullWord[],
    mode: "flashcard" | "listen" | "fillin" | "match" | "spelling" | "speed",
    count: number = 10
): GameQuestion[] {
    const selected = shuffle(words).slice(0, count);

    switch (mode) {
        case "listen":
            return selected.map(w => generateAudioQ(w, allWords));
        case "fillin":
            return selected.map(w => generateFillBlank(w, allWords));
        case "spelling":
            return selected.map(w => generateSpelling(w));
        case "speed":
        case "flashcard":
            // For speed/flashcard, alternate between definition MCQ and synonym MCQ
            return selected.map((w, i) =>
                i % 2 === 0 ? generateDefinitionMCQ(w, allWords) : generateWordFromDefMCQ(w, allWords)
            );
        case "match":
            // Return MCQs for scoring, actual match pairs are generated separately
            return selected.map(w => generateDefinitionMCQ(w, allWords));
        default:
            return selected.map(w => generateDefinitionMCQ(w, allWords));
    }
}
