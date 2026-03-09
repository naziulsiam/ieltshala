import { useState, useCallback, useEffect } from "react";

export type UserTier = "free" | "premium";

interface PremiumState {
    tier: UserTier;
    dailyWordsUsed: number;
    dailyResetDate: string; // YYYY-MM-DD in BD time
}

const STORAGE_KEY = "ieltshala-premium-state";
const FREE_DAILY_LIMIT = 15;
const FREE_WORD_CAP = 500;
const FREE_CATEGORIES = ["education", "environment", "work"];
const FREE_MODES = ["flashcard"];

function getBDDate(): string {
    // Bangladesh is UTC+6
    const now = new Date();
    const bdTime = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return bdTime.toISOString().split("T")[0];
}

function loadPremiumState(): PremiumState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Reset counter if new BD day
            if (parsed.dailyResetDate !== getBDDate()) {
                parsed.dailyWordsUsed = 0;
                parsed.dailyResetDate = getBDDate();
            }
            return parsed;
        }
    } catch { /* ignore */ }
    return { tier: "free", dailyWordsUsed: 0, dailyResetDate: getBDDate() };
}

function savePremiumState(state: PremiumState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
}

export function usePremium() {
    const [state, setState] = useState<PremiumState>(loadPremiumState);

    useEffect(() => { savePremiumState(state); }, [state]);

    const isPremium = state.tier === "premium";
    const dailyRemaining = Math.max(0, FREE_DAILY_LIMIT - state.dailyWordsUsed);
    const hasHitDailyLimit = !isPremium && state.dailyWordsUsed >= FREE_DAILY_LIMIT;

    const consumeWord = useCallback(() => {
        if (isPremium) return true;
        if (state.dailyWordsUsed >= FREE_DAILY_LIMIT) return false;
        setState(s => ({ ...s, dailyWordsUsed: s.dailyWordsUsed + 1 }));
        return true;
    }, [isPremium, state.dailyWordsUsed]);

    const isCategoryLocked = useCallback((categoryId: string) => {
        if (isPremium) return false;
        return !FREE_CATEGORIES.includes(categoryId);
    }, [isPremium]);

    const isModeLocked = useCallback((modeId: string) => {
        if (isPremium) return false;
        return !FREE_MODES.includes(modeId);
    }, [isPremium]);

    const isFeatureLocked = useCallback((feature: "slowAudio" | "repeatAudio" | "record" | "review" | "spacedRepetition" | "search") => {
        if (isPremium) return false;
        // Free users get standard audio and basic search only
        return ["slowAudio", "repeatAudio", "record", "review", "spacedRepetition"].includes(feature);
    }, [isPremium]);

    const upgradeToPremium = useCallback(() => {
        setState(s => ({ ...s, tier: "premium" }));
    }, []);

    // For demo/testing: toggle tier
    const toggleTier = useCallback(() => {
        setState(s => ({ ...s, tier: s.tier === "free" ? "premium" : "free" }));
    }, []);

    return {
        tier: state.tier,
        isPremium,
        dailyWordsUsed: state.dailyWordsUsed,
        dailyLimit: FREE_DAILY_LIMIT,
        dailyRemaining,
        hasHitDailyLimit,
        freeWordCap: FREE_WORD_CAP,
        freeCategories: FREE_CATEGORIES,
        freeModes: FREE_MODES,
        consumeWord,
        isCategoryLocked,
        isModeLocked,
        isFeatureLocked,
        upgradeToPremium,
        toggleTier,
    };
}
