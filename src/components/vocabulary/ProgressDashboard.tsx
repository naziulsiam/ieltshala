interface ProgressDashboardProps {
    totalLearned: number;
    accuracy: number;
    streak: number;
    mastered: number;
    learning: number;
    newWords: number;
}

const ProgressDashboard = ({ totalLearned, accuracy, streak, mastered, learning, newWords }: ProgressDashboardProps) => {
    const total = mastered + learning + newWords || 1;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">📊 Your Vocabulary Journey</h2>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-xl p-4 shadow-card text-center animate-fade-in-up">
                    <p className="text-2xl font-extrabold text-primary">{totalLearned.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1">Words Learned</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-card text-center animate-fade-in-up delay-100">
                    <p className="text-2xl font-extrabold text-success">{accuracy}%</p>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1">Accuracy Rate</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-card text-center animate-fade-in-up delay-200">
                    <p className="text-2xl font-extrabold text-accent">{streak}</p>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-1">Day Streak 🔥</p>
                </div>
            </div>

            {/* Mastery bars */}
            <div className="bg-card rounded-xl p-5 shadow-card space-y-3">
                <p className="text-sm font-semibold">Mastery Levels</p>
                <div className="space-y-2.5">
                    <MasteryBar label="Mastered" count={mastered} total={total} color="bg-primary" emoji="🔵" />
                    <MasteryBar label="Learning" count={learning} total={total} color="bg-warning" emoji="🟡" />
                    <MasteryBar label="New" count={newWords} total={total} color="bg-destructive/60" emoji="🔴" />
                </div>
            </div>

            {/* Weak areas */}
            <div className="bg-card rounded-xl p-5 shadow-card space-y-3">
                <p className="text-sm font-semibold">Weak Areas</p>
                <div className="space-y-2">
                    <WeakArea label="Technology vocabulary" percent={45} />
                    <WeakArea label="Abstract nouns" percent={52} />
                    <WeakArea label="Collocations" percent={38} />
                </div>
            </div>
        </div>
    );
};

const MasteryBar = ({ label, count, total, color, emoji }: { label: string; count: number; total: number; color: string; emoji: string }) => (
    <div>
        <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium flex items-center gap-1">{emoji} {label}</span>
            <span className="text-muted-foreground">{count}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${(count / total) * 100}%` }} />
        </div>
    </div>
);

const WeakArea = ({ label, percent }: { label: string; percent: number }) => (
    <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium truncate">{label}</span>
                <span className="text-muted-foreground shrink-0">{percent}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning/70 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
        </div>
    </div>
);

export default ProgressDashboard;
