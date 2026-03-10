import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Passage {
  id: string;
  title: string;
  content: string;
  type: 'heading' | 'tfng' | 'summary' | 'mcq' | 'short' | 'diagram';
  difficulty: 'easy' | 'medium' | 'hard';
  topic_tag: string;
  word_count: number;
  duration_min: number;
  questions: Question[];
  ai_generated: boolean;
}

export interface Question {
  num: number;
  question: string;
  type?: string;
  answer?: string;
  options?: string[];
}

export interface UserReadingProgress {
  id: string;
  passage_id: string;
  status: 'new' | 'in-progress' | 'completed';
  answers: Record<number, string>;
  score: number | null;
  band_score: number | null;
  time_spent_seconds: number;
  highlights: string[];
  started_at: string | null;
  completed_at: string | null;
}

export function usePassages() {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPassages();
  }, []);

  const fetchPassages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reading_passages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPassages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch passages');
    } finally {
      setLoading(false);
    }
  };

  return { passages, loading, error, refetch: fetchPassages };
}

export function useUserReadingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_reading_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  const startPassage = async (passageId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          passage_id: passageId,
          status: 'in-progress',
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,passage_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
      await fetchProgress();
    } catch (err) {
      console.error('Failed to start passage:', err);
    }
  };

  const saveProgress = async (
    passageId: string,
    answers: Record<number, string>,
    highlights: string[],
    timeSpent: number
  ) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          passage_id: passageId,
          status: 'in-progress',
          answers,
          highlights,
          time_spent_seconds: timeSpent,
        }, {
          onConflict: 'user_id,passage_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const submitAnswers = async (
    passageId: string,
    answers: Record<number, string>,
    correctAnswers: Record<number, string>,
    timeSpent: number
  ) => {
    if (!user) return;
    try {
      // Calculate score
      let correct = 0;
      const total = Object.keys(correctAnswers).length;
      Object.entries(answers).forEach(([num, ans]) => {
        if (correctAnswers[parseInt(num)]?.toLowerCase() === ans.toLowerCase()) {
          correct++;
        }
      });
      const score = Math.round((correct / total) * 100);
      
      // Convert to band score
      const bandMap: [number, number][] = [[90, 9], [80, 8], [70, 7], [60, 6.5], [50, 6], [40, 5.5], [0, 5]];
      const bandScore = bandMap.find(([threshold]) => score >= threshold)?.[1] || 5;

      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          passage_id: passageId,
          status: 'completed',
          answers,
          score,
          band_score: bandScore,
          time_spent_seconds: timeSpent,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,passage_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
      
      // Log activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'reading',
        duration_min: Math.round(timeSpent / 60),
        details: { passage_id: passageId, score, band_score: bandScore }
      });

      await fetchProgress();
      return { score, bandScore };
    } catch (err) {
      console.error('Failed to submit answers:', err);
    }
  };

  const getPassageStatus = useCallback((passageId: string) => {
    return progress.find(p => p.passage_id === passageId);
  }, [progress]);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
    startPassage,
    saveProgress,
    submitAnswers,
    getPassageStatus,
  };
}

export function useReadingStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    tests_completed: number;
    avg_band: number | null;
    total_time_min: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .rpc('get_user_skill_stats', { p_user_id: user.id });

      if (error) throw error;
      
      const readingStats = data?.find((s: any) => s.skill === 'reading');
      setStats(readingStats || { tests_completed: 0, avg_band: null, total_time_min: 0 });
    } catch (err) {
      console.error('Failed to fetch reading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}
