import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface MockTest {
  id: string;
  title: string;
  type: 'listening-mini' | 'reading-mini' | 'writing-mini' | 'full-academic';
  skill: 'Listening' | 'Reading' | 'Writing' | 'All';
  duration_min: number;
  questions: MockQuestion[];
  is_premium: boolean;
}

export interface MockQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface MockTestResult {
  id: string;
  mock_test_id: string;
  answers: number[];
  overall_band: number | null;
  listening_band: number | null;
  reading_band: number | null;
  writing_band: number | null;
  speaking_band: number | null;
  score_percent: number | null;
  correct_count: number | null;
  wrong_count: number | null;
  time_spent_seconds: number | null;
  completed_at: string;
  mock_test?: MockTest;
}

export function useMockTests() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('is_premium', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mock tests');
    } finally {
      setLoading(false);
    }
  };

  return { tests, loading, error, refetch: fetchTests };
}

export function useMockTestResults() {
  const { user } = useAuth();
  const [results, setResults] = useState<MockTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_mock_test_results')
        .select(`
          *,
          mock_test:mock_test_id (*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const submitResult = async (
    mockTestId: string,
    answers: number[],
    questions: MockQuestion[],
    timeSpent: number
  ) => {
    if (!user) return;
    try {
      // Calculate score
      let correct = 0;
      answers.forEach((ans, i) => {
        if (questions[i] && ans === questions[i].correct) {
          correct++;
        }
      });
      const total = questions.length;
      const wrong = total - correct;
      const scorePercent = Math.round((correct / total) * 100);

      // Convert to band
      const bandMap: [number, number][] = [[0.9, 8.5], [0.8, 7.5], [0.7, 7], [0.6, 6.5], [0.5, 6], [0, 5.5]];
      const overallBand = bandMap.find(([threshold]) => scorePercent / 100 >= threshold)?.[1] || 5.5;

      const { data, error } = await supabase
        .from('user_mock_test_results')
        .insert({
          user_id: user.id,
          mock_test_id: mockTestId,
          answers,
          overall_band: overallBand,
          score_percent: scorePercent,
          correct_count: correct,
          wrong_count: wrong,
          time_spent_seconds: timeSpent,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'mock_test',
        duration_min: Math.round(timeSpent / 60),
        details: { mock_test_id: mockTestId, score: scorePercent, band: overallBand }
      });

      await fetchResults();
      return data;
    } catch (err) {
      console.error('Failed to submit result:', err);
    }
  };

  return {
    results,
    loading,
    error,
    refetch: fetchResults,
    submitResult,
  };
}

export function useMockStats() {
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
      
      const mockStats = data?.find((s: any) => s.skill === 'mock');
      setStats(mockStats || { tests_completed: 0, avg_band: null, total_time_min: 0 });
    } catch (err) {
      console.error('Failed to fetch mock stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}
