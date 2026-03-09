import type { VocabWord } from "@/data/vocabularyData";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, Sparkles } from "lucide-react";

interface SpacedRepetitionProps {
    reviewDue: VocabWord[];
    onStartReview: () => void;
}

const SpacedRepetition = ({ reviewDue, onStartReview }: SpacedRepetitionProps) => {
    const overdue = reviewDue.filter(() => Math.random() > 0.5); // Simulated
    const dueToday = reviewDue.filter((_, i) => i < Math.ceil(reviewDue.length * 0.5));
    const newYesterday = reviewDue.slice(-3);
    const estimatedMins = Math.max(5, Math.round(reviewDue.length * 0.5));

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">🔁 Spaced Repetition</h2>

            <div className="bg-card rounded-2xl shadow-elevated p-5 space-y-4 animate-fade-in-up">
                {/* Main count */}
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-accent">{reviewDue.length}</span>
                    </div>
                    <div>
                        <p className="text-base font-bold">Words Due for Review</p>
                        <p className="text-xs text-muted-foreground">Based on your learning curve</p>
                    </div>
                </div>

                {/* Breakdown */}
                {reviewDue.length > 0 ? (
                    <div className="space-y-2">
                        {overdue.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                                <span className="text-destructive font-medium">{overdue.length} words (overdue)</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3.5 h-3.5 text-warning" />
                            <span className="text-foreground/80">{dueToday.length} words (due today)</span>
                        </div>
                        {newYesterday.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-foreground/80">{newYesterday.length} words (new from yesterday)</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-success/10 rounded-xl p-4 text-center">
                        <p className="text-2xl mb-1">🎉</p>
                        <p className="text-sm font-semibold text-success">All caught up!</p>
                        <p className="text-xs text-muted-foreground">No words due for review right now</p>
                    </div>
                )}

                {reviewDue.length > 0 && (
                    <>
                        <p className="text-xs text-muted-foreground text-center">
                            Takes ~{estimatedMins} minutes
                        </p>
                        <Button variant="coral" size="lg" className="w-full press" onClick={onStartReview}>
                            Start Review Session →
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SpacedRepetition;
