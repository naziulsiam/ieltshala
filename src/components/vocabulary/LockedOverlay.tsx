import { Lock, Crown } from "lucide-react";

interface LockedOverlayProps {
    onUpgrade: () => void;
    message?: string;
    compact?: boolean;
}

const LockedOverlay = ({ onUpgrade, message = "Upgrade to unlock", compact = false }: LockedOverlayProps) => {
    if (compact) {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
                PRO
            </span>
        );
    }

    return (
        <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/80 backdrop-blur-[2px] rounded-xl cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{message}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    Upgrade
                </span>
            </div>
        </div>
    );
};

export default LockedOverlay;
