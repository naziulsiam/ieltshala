import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/supabase';

type UserStats = Database['public']['Tables']['user_stats']['Row'];

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      setStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateStats = async (updates: Partial<UserStats>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error: updateError } = await supabase
        .from('user_stats')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setStats(data);
      return data;
    } catch (err) {
      console.error('Error updating stats:', err);
      throw err;
    }
  };

  const recordWordLearned = async (wordId: string) => {
    if (!user || !stats) return;

    const today = new Date().toISOString().split('T')[0];
    const dailyLearned = stats.daily_learned || [];
    
    // Check if it's a new day
    if (stats.daily_date !== today) {
      // Reset daily progress
      await updateStats({
        daily_date: today,
        daily_learned: [wordId],
        last_study_date: new Date().toISOString(),
      });
    } else if (!dailyLearned.includes(wordId)) {
      // Add to today's learned words
      await updateStats({
        daily_learned: [...dailyLearned, wordId],
        last_study_date: new Date().toISOString(),
      });
    }
  };

  const updateStreak = async () => {
    if (!user || !stats) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If already studied today, do nothing
    if (stats.last_study_date?.startsWith(today)) return;

    // Calculate new streak
    let newStreak = stats.streak || 0;
    if (stats.last_study_date?.startsWith(yesterdayStr)) {
      newStreak += 1; // Continue streak
    } else {
      newStreak = 1; // Reset streak
    }

    await updateStats({
      streak: newStreak,
      last_study_date: new Date().toISOString(),
    });
  };

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
    updateStats,
    recordWordLearned,
    updateStreak,
  };
}
