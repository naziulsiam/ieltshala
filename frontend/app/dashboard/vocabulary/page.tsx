'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface VocabularyWord {
  _id: string;
  word: string;
  meaning: string;
  banglaMeaning: string;
  example?: string;
  partOfSpeech?: string;
  difficulty?: string;
  category?: string;
}

export default function VocabularyPage() {
  const router = useRouter();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all');

  useEffect(() => {
    fetchVocabulary();
    loadLearnedWords();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/vocabulary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setWords(data.words);
      } else {
        toast.error('Failed to load vocabulary');
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      toast.error('Error loading vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const loadLearnedWords = () => {
    const stored = localStorage.getItem('learnedWords');
    if (stored) {
      setLearnedWords(new Set(JSON.parse(stored)));
    }
  };

  const saveLearnedWords = (newSet: Set<string>) => {
    localStorage.setItem('learnedWords', JSON.stringify([...newSet]));
  };

  const markAsLearned = () => {
    if (filteredWords.length === 0) return;
    const currentWord = filteredWords[currentIndex];
    const newLearned = new Set(learnedWords);
    newLearned.add(currentWord._id);
    setLearnedWords(newLearned);
    saveLearnedWords(newLearned);
    toast.success('Word marked as learned!');
    handleNext();
  };

  const markAsUnlearned = () => {
    if (filteredWords.length === 0) return;
    const currentWord = filteredWords[currentIndex];
    const newLearned = new Set(learnedWords);
    newLearned.delete(currentWord._id);
    setLearnedWords(newLearned);
    saveLearnedWords(newLearned);
    toast.success('Word marked as unlearned');
  };

  const handleNext = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevious = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const filteredWords = words.filter((word) => {
    if (filter === 'learned') return learnedWords.has(word._id);
    if (filter === 'unlearned') return !learnedWords.has(word._id);
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (words.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📚 Vocabulary Builder</h1>
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No vocabulary words yet</h3>
              <p className="text-gray-600">
                Words will appear here once they are added to the system
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (filteredWords.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📚 Vocabulary Builder</h1>
          
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
            >
              All Words ({words.length})
            </Button>
            <Button
              onClick={() => setFilter('unlearned')}
              variant={filter === 'unlearned' ? 'default' : 'outline'}
            >
              To Learn ({words.filter(w => !learnedWords.has(w._id)).length})
            </Button>
            <Button
              onClick={() => setFilter('learned')}
              variant={filter === 'learned' ? 'default' : 'outline'}
            >
              Learned ({learnedWords.size})
            </Button>
          </div>

          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">No words in this category</h3>
              <p className="text-gray-600">
                Try switching to a different filter
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentWord = filteredWords[currentIndex];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📚 Vocabulary Builder</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{words.length}</div>
              <div className="text-blue-100 text-sm">Total Words</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{learnedWords.size}</div>
              <div className="text-green-100 text-sm">Learned</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{words.length - learnedWords.size}</div>
              <div className="text-orange-100 text-sm">To Learn</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
          >
            All Words
          </Button>
          <Button
            onClick={() => setFilter('unlearned')}
            variant={filter === 'unlearned' ? 'default' : 'outline'}
          >
            To Learn
          </Button>
          <Button
            onClick={() => setFilter('learned')}
            variant={filter === 'learned' ? 'default' : 'outline'}
          >
            Learned
          </Button>
        </div>

        {/* Flashcard */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 mb-2">
                Word {currentIndex + 1} of {filteredWords.length}
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                {currentWord.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentWord.difficulty}
                  </span>
                )}
                {currentWord.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {currentWord.category}
                  </span>
                )}
                {learnedWords.has(currentWord._id) && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    ✓ Learned
                  </span>
                )}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-4">{currentWord.word}</h2>
              {currentWord.partOfSpeech && (
                <p className="text-gray-500 italic mb-4">({currentWord.partOfSpeech})</p>
              )}
            </div>

            {showMeaning ? (
              <div className="space-y-4">
                <div className="p-6 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-emerald-900 mb-2">Meaning:</h3>
                  <p className="text-gray-800">{currentWord.meaning}</p>
                </div>

                {currentWord.banglaMeaning && (
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">বাংলা অর্থ:</h3>
                    <p className="text-gray-800">{currentWord.banglaMeaning}</p>
                  </div>
                )}

                {currentWord.example && (
                  <div className="p-6 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Example:</h3>
                    <p className="text-gray-800 italic">"{currentWord.example}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Button onClick={() => setShowMeaning(true)} size="lg">
                  Show Meaning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={handlePrevious} variant="outline">
            ← Previous
          </Button>

          <div className="flex gap-2">
            {learnedWords.has(currentWord._id) ? (
              <Button onClick={markAsUnlearned} variant="outline">
                Mark as Unlearned
              </Button>
            ) : (
              <Button onClick={markAsLearned} variant="default">
                ✓ Mark as Learned
              </Button>
            )}
          </div>

          <Button onClick={handleNext} variant="outline">
            Next →
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all"
            style={{ width: `${(learnedWords.size / words.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {Math.round((learnedWords.size / words.length) * 100)}% Complete
        </p>
      </div>
    </DashboardLayout>
  );
}
