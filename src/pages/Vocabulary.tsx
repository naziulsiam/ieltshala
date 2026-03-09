import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { allWords, getWordsByCategory, getWordsBySubCategory } from "@/data/vocabularyData";
import { allFullWords } from "@/data/words";
import { useVocabulary } from "@/hooks/useVocabulary";
import { usePremium } from "@/hooks/usePremium";
import VocabularyHeader from "@/components/vocabulary/VocabularyHeader";
import VocabularyTabs from "@/components/vocabulary/VocabularyTabs";
import WordCard from "@/components/vocabulary/WordCard";
import WordOfTheDay from "@/components/vocabulary/WordOfTheDay";
import CategoryGrid from "@/components/vocabulary/CategoryGrid";
import CategoryDetail from "@/components/vocabulary/CategoryDetail";
import WordLists from "@/components/vocabulary/WordLists";
import LearningModes from "@/components/vocabulary/LearningModes";
import ProgressDashboard from "@/components/vocabulary/ProgressDashboard";
import SearchBar from "@/components/vocabulary/SearchBar";
import SpacedRepetition from "@/components/vocabulary/SpacedRepetition";
import UpgradeModal from "@/components/vocabulary/UpgradeModal";
import DailyChallenge from "@/components/vocabulary/DailyChallenge";

// Lazy-load game modes for code splitting
import FlashcardMode from "@/components/vocabulary/modes/FlashcardMode";
import ListenLearnMode from "@/components/vocabulary/modes/ListenLearnMode";
import FillBlankMode from "@/components/vocabulary/modes/FillBlankMode";
import MatchMasterMode from "@/components/vocabulary/modes/MatchMasterMode";
import SpellingBeeMode from "@/components/vocabulary/modes/SpellingBeeMode";
import SpeedReviewMode from "@/components/vocabulary/modes/SpeedReviewMode";

import type { VocabWord } from "@/data/vocabularyData";
import type { FullWord } from "@/data/words/types";
import type { Difficulty } from "@/hooks/useVocabulary";
import { Lock, Crown } from "lucide-react";

// Helper to shuffle words for game modes
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Vocabulary = () => {
  const v = useVocabulary();
  const premium = usePremium();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeVariant, setUpgradeVariant] = useState<"limit-reached" | "feature-locked">("limit-reached");
  const [lockedFeatureName, setLockedFeatureName] = useState("");

  // Active game mode session state
  const [activeGameMode, setActiveGameMode] = useState<string | null>(null);
  const [gameModeWords, setGameModeWords] = useState<FullWord[]>([]);

  const openUpgradeModal = useCallback((variant: "limit-reached" | "feature-locked", feature = "") => {
    setUpgradeVariant(variant);
    setLockedFeatureName(feature);
    setShowUpgradeModal(true);
  }, []);

  // Determine word set based on active tab and filters
  const words = useMemo<VocabWord[]>(() => {
    switch (v.activeTab) {
      case "learn":
        return allWords;
      case "review":
        return v.reviewDue.length > 0 ? v.reviewDue : allWords.slice(0, 10);
      case "bookmarked":
        return v.bookmarkedWords;
      case "topics":
        if (v.selectedSubCategory && v.selectedCategory) {
          return getWordsBySubCategory(v.selectedCategory, v.selectedSubCategory);
        }
        if (v.selectedCategory) {
          return getWordsByCategory(v.selectedCategory);
        }
        return [];
      case "lists":
        return v.selectedList ? allWords : [];
      case "search":
        if (v.searchQuery.length >= 2) {
          const q = v.searchQuery.toLowerCase();
          return allWords.filter(
            w => w.word.toLowerCase().includes(q) ||
              w.definition.toLowerCase().includes(q) ||
              w.bengali.includes(q) ||
              w.bengaliTranslit.toLowerCase().includes(q) ||
              w.synonyms.some(s => s.toLowerCase().includes(q))
          );
        }
        return [];
      default:
        return allWords;
    }
  }, [v.activeTab, v.selectedCategory, v.selectedSubCategory, v.selectedList, v.searchQuery, v.reviewDue, v.bookmarkedWords]);

  const currentWord = words.length > 0 ? words[v.currentIndex % words.length] : null;

  // Wrap rating to consume daily word and trigger limit modal
  const handleRate = useCallback((wordId: string, difficulty: Difficulty) => {
    if (!premium.isPremium) {
      const canProceed = premium.consumeWord();
      if (!canProceed) {
        openUpgradeModal("limit-reached");
        return;
      }
    }
    v.rateDifficulty(wordId, difficulty);
  }, [premium, v, openUpgradeModal]);

  const handleSearchSelectWord = (word: VocabWord) => {
    const idx = words.findIndex(w => w.id === word.id);
    if (idx >= 0) v.setCurrentIndex(idx);
  };

  const handleLockedFeatureClick = useCallback((feature: string) => {
    openUpgradeModal("feature-locked", feature);
  }, [openUpgradeModal]);

  const handleTabChange = useCallback((tab: typeof v.activeTab) => {
    if (tab === "review" && premium.isFeatureLocked("review")) {
      openUpgradeModal("feature-locked", "Review Mode");
      return;
    }
    v.setTab(tab);
  }, [v, premium, openUpgradeModal]);

  // Launch a game mode session
  const handleStartMode = useCallback((modeId: string) => {
    // For free users, only flashcard is allowed
    if (!premium.isPremium && modeId !== "flashcard") {
      openUpgradeModal("feature-locked", "Learning Modes");
      return;
    }

    // Select words for the session from the expanded word library
    const sessionWords = shuffle(allFullWords).slice(0, modeId === "flashcard" ? 15 : 10);
    setGameModeWords(sessionWords);
    setActiveGameMode(modeId);
  }, [premium, openUpgradeModal]);

  // Exit game mode session
  const handleExitMode = useCallback(() => {
    setActiveGameMode(null);
    setGameModeWords([]);
  }, []);

  // Render active game mode
  const renderGameMode = () => {
    if (!activeGameMode || gameModeWords.length === 0) return null;

    switch (activeGameMode) {
      case "flashcard":
        return <FlashcardMode words={gameModeWords} onExit={handleExitMode} />;
      case "listen":
        return <ListenLearnMode words={gameModeWords} allWords={allFullWords} onExit={handleExitMode} />;
      case "fillin":
        return <FillBlankMode words={gameModeWords} allWords={allFullWords} onExit={handleExitMode} />;
      case "match":
        return <MatchMasterMode words={gameModeWords} onExit={handleExitMode} />;
      case "spelling":
        return <SpellingBeeMode words={gameModeWords} onExit={handleExitMode} />;
      case "speed":
        return <SpeedReviewMode words={gameModeWords} onExit={handleExitMode} />;
      default:
        return null;
    }
  };

  // Common WordCard render with premium props
  const renderWordCard = () => {
    if (!currentWord) return null;

    if (premium.hasHitDailyLimit) {
      return (
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-warning/20 mx-auto flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-extrabold">Great job today!</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You've studied all <span className="font-bold text-accent">{premium.dailyLimit}</span> words for today.
            Come back tomorrow or upgrade for unlimited learning.
          </p>
          <div className="bg-secondary/50 rounded-xl p-4 space-y-2 text-left max-w-xs mx-auto">
            <p className="text-xs font-bold text-muted-foreground">With Premium you get:</p>
            <ul className="space-y-1.5">
              {["Unlimited words per day", "Full 3000+ word library", "All 6 learning modes", "Spaced repetition review"].map(b => (
                <li key={b} className="text-xs text-foreground/80 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => openUpgradeModal("limit-reached")}
            className="bg-accent text-accent-foreground px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all press flex items-center gap-2 mx-auto"
          >
            <Crown className="w-4 h-4" />
            Unlock Unlimited — ৳499/mo
          </button>
          <p className="text-xs text-muted-foreground">
            or come back in {getHoursUntilMidnightBD()} hours
          </p>
        </div>
      );
    }

    return (
      <WordCard
        word={currentWord}
        index={v.currentIndex % words.length}
        total={words.length}
        isBookmarked={v.bookmarks.has(currentWord.id)}
        showBengali={v.showBengali}
        note={v.notes[currentWord.id]}
        onNext={() => v.nextWord(words)}
        onPrev={() => v.prevWord(words)}
        onRate={handleRate}
        onToggleBookmark={v.toggleBookmark}
        onSetNote={v.setNote}
        onToggleBengali={v.toggleBengali}
        isPremium={premium.isPremium}
        onLockedFeatureClick={handleLockedFeatureClick}
      />
    );
  };

  // If a game mode is active, render it full-screen
  if (activeGameMode) {
    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto pb-28 md:pb-8">
        {renderGameMode()}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-8">
      {/* Header with stats and daily goal */}
      <VocabularyHeader
        totalLearned={v.totalLearned}
        streak={v.streak}
        dailyProgress={v.dailyProgress}
        dailyGoal={v.dailyGoal}
        onContinue={() => v.setTab("learn")}
        isPremium={premium.isPremium}
        dailyWordsUsed={premium.dailyWordsUsed}
        dailyLimit={premium.dailyLimit}
        dailyRemaining={premium.dailyRemaining}
        hasHitDailyLimit={premium.hasHitDailyLimit}
        onUpgradeClick={() => openUpgradeModal("limit-reached")}
      />

      {/* Tab Navigation */}
      <VocabularyTabs
        activeTab={v.activeTab}
        onTabChange={handleTabChange}
        reviewCount={v.reviewDue.length}
        bookmarkCount={v.bookmarkedWords.length}
      />

      {/* Tab Content */}
      {v.activeTab === "learn" && (
        <div className="space-y-6">
          <WordOfTheDay onAddToList={() => { }} />

          {/* Daily Challenge */}
          <DailyChallenge
            isPremium={premium.isPremium}
            onStartChallenge={() => handleStartMode("speed")}
            onUpgrade={() => openUpgradeModal("feature-locked", "Daily Challenge")}
          />

          {renderWordCard()}

          <LearningModes
            activeMode={v.activeLearningMode}
            onSelectMode={v.setLearningMode}
            onStartMode={handleStartMode}
            isModeLocked={premium.isModeLocked}
            onUpgradeClick={() => openUpgradeModal("feature-locked", "Learning Modes")}
          />

          <ProgressDashboard
            totalLearned={v.totalLearned}
            accuracy={v.masteryStats.accuracy}
            streak={v.streak}
            mastered={v.masteryStats.mastered}
            learning={v.masteryStats.learning}
            newWords={v.masteryStats.newWords}
          />
        </div>
      )}

      {v.activeTab === "review" && (
        <div className="space-y-6">
          {premium.isFeatureLocked("review") ? (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center space-y-4 animate-fade-in-up">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold">Review Mode is Premium</h3>
              <p className="text-sm text-muted-foreground">Upgrade to access spaced repetition review</p>
              <button
                onClick={() => openUpgradeModal("feature-locked", "Review Mode")}
                className="bg-accent text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg press flex items-center gap-2 mx-auto"
              >
                <Crown className="w-4 h-4" /> Upgrade to Premium
              </button>
            </div>
          ) : (
            <>
              <SpacedRepetition reviewDue={v.reviewDue} onStartReview={() => { }} />
              {renderWordCard()}
            </>
          )}
        </div>
      )}

      {v.activeTab === "bookmarked" && (
        <div className="space-y-6">
          {words.length > 0 ? renderWordCard() : (
            <div className="bg-card rounded-2xl p-8 shadow-card text-center animate-fade-in-up">
              <p className="text-4xl mb-3">⭐</p>
              <p className="text-base font-semibold">No bookmarked words yet</p>
              <p className="text-sm text-muted-foreground mt-1">Tap the bookmark button on any word card to save it here</p>
            </div>
          )}
        </div>
      )}

      {v.activeTab === "topics" && (
        <div className="space-y-6">
          {!v.selectedCategory ? (
            <CategoryGrid
              onSelectCategory={v.selectCategory}
              isCategoryLocked={premium.isCategoryLocked}
              onUpgradeClick={() => openUpgradeModal("feature-locked", "All Categories")}
            />
          ) : !v.selectedSubCategory ? (
            <CategoryDetail
              categoryId={v.selectedCategory}
              onBack={() => v.selectCategory(null)}
              onSelectSubCategory={v.selectSubCategory}
            />
          ) : (
            <div className="space-y-4">
              <button onClick={() => v.selectSubCategory(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors press">
                ← Back
              </button>
              {renderWordCard()}
            </div>
          )}
        </div>
      )}

      {v.activeTab === "lists" && (
        <div className="space-y-6">
          {!v.selectedList ? (
            <WordLists onSelectList={v.selectList} />
          ) : (
            <div className="space-y-4">
              <button onClick={() => v.selectList(null)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors press">
                ← Back to Word Lists
              </button>
              {renderWordCard()}
            </div>
          )}
        </div>
      )}

      {v.activeTab === "search" && (
        <div className="space-y-6">
          <SearchBar query={v.searchQuery} onQueryChange={v.setSearchQuery} onSelectWord={handleSearchSelectWord} />
          {words.length > 0 && renderWordCard()}
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => { premium.upgradeToPremium(); setShowUpgradeModal(false); }}
        dailyUsed={premium.dailyWordsUsed}
        dailyLimit={premium.dailyLimit}
        variant={upgradeVariant}
        featureName={lockedFeatureName}
      />

      {/* Floating upgrade banner for free users */}
      {!premium.isPremium && (
        <div className="fixed bottom-[72px] md:bottom-0 left-0 right-0 z-40 md:left-[240px]">
          <div className="bg-gradient-to-r from-primary/95 to-accent/95 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Crown className="w-4 h-4" />
              <span className="text-xs font-semibold">Unlock unlimited vocabulary</span>
            </div>
            <button
              onClick={() => openUpgradeModal("feature-locked", "Premium")}
              className="bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/90 press flex items-center gap-1"
            >
              ৳499/mo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getHoursUntilMidnightBD(): number {
  const now = new Date();
  const bdHour = (now.getUTCHours() + 6) % 24;
  return 24 - bdHour;
}

export default Vocabulary;
