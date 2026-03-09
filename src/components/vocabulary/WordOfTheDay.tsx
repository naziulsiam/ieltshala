import { getWordOfTheDay } from "@/data/vocabularyData";
import AudioPlayer from "./AudioPlayer";
import { Button } from "@/components/ui/button";

interface WordOfTheDayProps {
    onAddToList: () => void;
}

const WordOfTheDay = ({ onAddToList }: WordOfTheDayProps) => {
    const word = getWordOfTheDay();

    return (
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-purple/5 rounded-2xl p-5 shadow-card border border-accent/10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">☀️</span>
                <h3 className="text-sm font-bold text-foreground">Word of the Day</h3>
            </div>

            <div className="space-y-3">
                <div className="text-center">
                    <h4 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
                        {word.word}
                    </h4>
                    <span className="text-[10px] font-bold bg-purple/10 text-purple px-2.5 py-0.5 rounded-full">
                        {word.level} · {word.partOfSpeech}
                    </span>
                </div>

                <AudioPlayer word={word.word} phonetic={word.phonetic} />

                <p className="text-sm text-foreground/90 text-center leading-relaxed">
                    "{word.definition}"
                </p>

                <p className="text-xs text-muted-foreground italic text-center">
                    "{word.example}"
                </p>

                <Button variant="coral" size="sm" className="w-full press" onClick={onAddToList}>
                    Add to Today's List
                </Button>
            </div>
        </div>
    );
};

export default WordOfTheDay;
