import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface UserActivity {
  id: string;
  activity_type: 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary' | 'mock_test';
  duration_min: number;
  details: Record<string, any>;
  created_at: string;
}

export function useUserActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    activityType: UserActivity['activity_type'],
    durationMin: number,
    details?: Record<string, any>
  ) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        duration_min: durationMin,
        details: details || {},
      });

      if (error) throw error;
      await fetchActivities();
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
  };

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    logActivity,
  };
}

export function useWeeklyActivity() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<{ day: string; minutes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWeeklyData();
    }
  }, [user]);

  const fetchWeeklyData = async () => {
    if (!user) return;
    try {
      // Get activity data for the current week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
      weekStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('user_activities')
        .select('created_at, duration_min')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Aggregate by day
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayData = days.map(day => ({ day, minutes: 0 }));

      data?.forEach((activity: any) => {
        const date = new Date(activity.created_at);
        const dayIndex = (date.getDay() + 6) % 7; // Convert to 0=Mon
        if (dayIndex >= 0 && dayIndex < 7) {
          dayData[dayIndex].minutes += activity.duration_min || 0;
        }
      });

      setWeeklyData(dayData);
    } catch (err) {
      console.error('Failed to fetch weekly activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalHours = (weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 60).toFixed(1);
  const totalMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);

  return {
    weeklyData,
    totalHours,
    totalMinutes,
    loading,
    refetch: fetchWeeklyData,
  };
}

export function useStudyPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlan();
    }
  }, [user]);

  const fetchPlan = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      setPlan(data);
    } catch (err) {
      console.error('Failed to fetch study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: {
    title: string;
    target_band: number;
    current_band?: number;
    duration_weeks?: number;
    focus_areas?: string[];
  }) => {
    if (!user) return;
    try {
      // Deactivate existing plans
      await supabase
        .from('study_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Create new plan
      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          user_id: user.id,
          ...planData,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setPlan(data);
      return data;
    } catch (err) {
      console.error('Failed to create study plan:', err);
    }
  };

  return {
    plan,
    loading,
    refetch: fetchPlan,
    createPlan,
  };
}
