import { X, Crown, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    dailyUsed: number;
    dailyLimit: number;
    variant?: "limit-reached" | "feature-locked";
    featureName?: string;
}

const benefits = [
    { label: "Unlimited words per day", free: "15/day", premium: "Unlimited" },
    { label: "Full word library", free: "500 words", premium: "3000+ words" },
    { label: "All categories", free: "3 categories", premium: "12 categories" },
    { label: "Learning modes", free: "Flashcard only", premium: "All 6 modes" },
    { label: "Audio features", free: "Standard only", premium: "Slow + Record" },
    { label: "Spaced repetition", free: "—", premium: "✓ Full system" },
];

const UpgradeModal = ({ isOpen, onClose, onUpgrade, dailyUsed, dailyLimit, variant = "limit-reached", featureName }: UpgradeModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-card rounded-2xl shadow-modal max-w-md w-full p-6 space-y-5 animate-fade-in-up z-10 max-h-[90vh] overflow-y-auto">
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 press">
                    <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Header */}
                <div className="text-center pt-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-warning mx-auto flex items-center justify-center mb-3">
                        {variant === "limit-reached" ? (
                            <Zap className="w-8 h-8 text-white" />
                        ) : (
                            <Crown className="w-8 h-8 text-white" />
                        )}
                    </div>

                    {variant === "limit-reached" ? (
                        <>
                            <h3 className="text-xl font-extrabold text-foreground">You've reached your daily limit!</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                You've studied <span className="font-bold text-accent">{dailyUsed}/{dailyLimit}</span> words today
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-extrabold text-foreground">Unlock {featureName}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                This feature is available for Premium members
                            </p>
                        </>
                    )}
                </div>

                {/* Comparison table */}
                <div className="space-y-0 rounded-xl overflow-hidden border">
                    <div className="grid grid-cols-3 bg-secondary/50 px-3 py-2">
                        <span className="text-[11px] font-bold text-muted-foreground">Feature</span>
                        <span className="text-[11px] font-bold text-muted-foreground text-center">Free</span>
                        <span className="text-[11px] font-bold text-accent text-center">Premium</span>
                    </div>
                    {benefits.map((b, i) => (
                        <div key={i} className="grid grid-cols-3 px-3 py-2.5 border-t items-center">
                            <span className="text-xs font-medium text-foreground">{b.label}</span>
                            <span className="text-[11px] text-muted-foreground text-center">{b.free}</span>
                            <span className="text-[11px] font-semibold text-accent text-center flex items-center justify-center gap-1">
                                {b.premium.startsWith("✓") ? (
                                    <>
                                        <Check className="w-3 h-3 text-success" />
                                        <span className="text-success">{b.premium.slice(2)}</span>
                                    </>
                                ) : b.premium}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="space-y-3">
                    <Button
                        variant="coral"
                        size="lg"
                        className="w-full press text-base font-bold"
                        onClick={onUpgrade}
                    >
                        <Crown className="w-5 h-5 mr-2" />
                        Unlock Unlimited — ৳499/mo
                    </Button>

                    {/* Payment icons */}
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 bg-[#E2136E]/10 text-[#E2136E] px-2 py-1 rounded-full font-semibold text-[10px]">
                            <span className="w-3 h-3 rounded-full bg-[#E2136E] inline-block" />
                            bKash
                        </span>
                        <span className="flex items-center gap-1 bg-[#EF7F1A]/10 text-[#EF7F1A] px-2 py-1 rounded-full font-semibold text-[10px]">
                            <span className="w-3 h-3 rounded-full bg-[#EF7F1A] inline-block" />
                            Nagad
                        </span>
                        <span className="text-muted-foreground text-[10px]">Visa / Mastercard</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 press"
                    >
                        {variant === "limit-reached" ? "Continue Free (Come back tomorrow)" : "Maybe Later"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
