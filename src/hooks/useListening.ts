import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ListeningTest {
  id: string;
  title: string;
  section: string;
  type: 'form' | 'map' | 'matching' | 'mcq' | 'short';
  difficulty: 'easy' | 'medium' | 'hard';
  duration_min: number;
  questions_count: number;
  audio_url: string | null;
  transcript: string | null;
  questions: ListeningQuestion[];
  ai_generated: boolean;
}

export interface ListeningQuestion {
  num: number;
  question: string;
  type: string;
  answer?: string;
  options?: string[];
}

export interface UserListeningProgress {
  id: string;
  test_id: string;
  status: 'new' | 'in-progress' | 'completed';
  answers: Record<number, string>;
  score: number | null;
  band_score: number | null;
  time_spent_seconds: number;
  bookmarks: number[];
  started_at: string | null;
  completed_at: string | null;
}

export function useListeningTests() {
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listening_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  return { tests, loading, error, refetch: fetchTests };
}

export function useUserListeningProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserListeningProgress[]>([]);
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
        .from('user_listening_progress')
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

  const startTest = async (testId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_listening_progress')
        .upsert({
          user_id: user.id,
          test_id: testId,
          status: 'in-progress',
          started_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,test_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
      await fetchProgress();
    } catch (err) {
      console.error('Failed to start test:', err);
    }
  };

  const saveProgress = async (
    testId: string,
    answers: Record<number, string>,
    bookmarks: number[],
    timeSpent: number
  ) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_listening_progress')
        .upsert({
          user_id: user.id,
          test_id: testId,
          status: 'in-progress',
          answers,
          bookmarks,
          time_spent_seconds: timeSpent,
        }, {
          onConflict: 'user_id,test_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const submitAnswers = async (
    testId: string,
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
        if (correctAnswers[parseInt(num)]?.toLowerCase().trim() === ans.toLowerCase().trim()) {
          correct++;
        }
      });
      const score = Math.round((correct / total) * 100);
      
      // Convert to band score (listening scoring)
      const bandMap: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [0, 0]];
      const bandScore = bandMap.find(([threshold]) => correct >= threshold)?.[1] || 0;

      const { error } = await supabase
        .from('user_listening_progress')
        .upsert({
          user_id: user.id,
          test_id: testId,
          status: 'completed',
          answers,
          score,
          band_score: bandScore,
          time_spent_seconds: timeSpent,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,test_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
      
      // Log activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'listening',
        duration_min: Math.round(timeSpent / 60),
        details: { test_id: testId, score, band_score: bandScore }
      });

      await fetchProgress();
      return { score, bandScore, correct, total };
    } catch (err) {
      console.error('Failed to submit answers:', err);
    }
  };

  const getTestStatus = useCallback((testId: string) => {
    return progress.find(p => p.test_id === testId);
  }, [progress]);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
    startTest,
    saveProgress,
    submitAnswers,
    getTestStatus,
  };
}

export function useListeningStats() {
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
      
      const listeningStats = data?.find((s: any) => s.skill === 'listening');
      setStats(listeningStats || { tests_completed: 0, avg_band: null, total_time_min: 0 });
    } catch (err) {
      console.error('Failed to fetch listening stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}
