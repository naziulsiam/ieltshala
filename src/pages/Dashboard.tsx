import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, Target, Clock, Headphones, PenTool, Mic, TrendingUp, ChevronRight, BookOpen, Sparkles, BookText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import AiSuggestionEngine from "@/components/AiSuggestionEngine";
import { HalaChat } from "@/components/HalaChat";
import { useProfile } from "@/hooks/useProfile";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/contexts/AuthContext";
import { useWeeklyActivity, useStudyPlan } from "@/hooks/useActivities";
import { useReadingStats } from "@/hooks/useReading";
import { useListeningStats } from "@/hooks/useListening";
import { useMockStats } from "@/hooks/useMockTests";
import { groqService } from "@/services/groq";
import { supabase } from "@/lib/supabase";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { stats, loading: statsLoading } = useUserStats();
  const { weeklyData, totalHours, loading: activityLoading } = useWeeklyActivity();
  const { stats: readingStats } = useReadingStats();
  const { stats: listeningStats } = useListeningStats();
  const { stats: mockStats } = useMockStats();
  const { plan: studyPlan, loading: planLoading, createPlan } = useStudyPlan();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [halaOpen, setHalaOpen] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [todayPlan, setTodayPlan] = useState<any[]>([]);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Generate today's plan based on user data
  useEffect(() => {
    if (!planLoading && studyPlan?.weekly_schedule) {
      const dayOfWeek = new Date().getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      const todaySchedule = studyPlan.weekly_schedule.find((s: any) => s.day === dayName);
      
      if (todaySchedule?.tasks) {
        const taskMap: Record<string, any> = {
          'reading': { icon: BookOpen, title: "Reading Practice", subtitle: "Academic Passage", to: "/practice/reading", color: "bg-success/10 text-success" },
          'listening': { icon: Headphones, title: "Listening Practice", subtitle: "Section 3-4", to: "/practice/listening", color: "bg-primary/10 text-primary" },
          'writing': { icon: PenTool, title: "Writing Task 2", subtitle: "Opinion Essay", to: "/practice/writing", color: "bg-accent/10 text-accent" },
          'speaking': { icon: Mic, title: "Speaking Practice", subtitle: "Part 2 Topic", to: "/practice/speaking", color: "bg-purple/10 text-purple" },
          'vocabulary': { icon: BookText, title: "Vocabulary Review", subtitle: "15 new words", to: "/vocabulary", color: "bg-success/10 text-success" },
          'mock': { icon: MessageCircle, title: "Mock Test", subtitle: "Full simulation", to: "/mock-tests", color: "bg-warning/10 text-warning" },
        };
        
        setTodayPlan(todaySchedule.tasks.slice(0, 3).map((t: string) => taskMap[t] || taskMap['reading']));
      }
    } else {
      // Default plan
      setTodayPlan([
        { icon: Headphones, title: "Listening Practice", subtitle: "Academic Section 3", time: "20 min", to: "/practice/listening", color: "bg-primary/10 text-primary" },
        { icon: PenTool, title: "Writing Task 2", subtitle: "Opinion Essay", time: "30 min", to: "/practice/writing", color: "bg-accent/10 text-accent" },
        { icon: BookOpen, title: "Vocabulary Review", subtitle: "15 new words", time: "10 min", to: "/vocabulary", color: "bg-success/10 text-success" },
      ]);
    }
  }, [studyPlan, planLoading]);

  const loading = initialLoading || profileLoading || statsLoading || activityLoading;

  // Calculate current band from actual stats
  const targetBand = profile?.target_band || 7.0;
  const currentBand = mockStats?.avg_band || readingStats?.avg_band || listeningStats?.avg_band || 6.0;
  const bandProgress = Math.min(100, (currentBand / targetBand) * 100);
  const bandsAway = Math.max(0, targetBand - currentBand).toFixed(1);

  // Weekly stats
  const dailyLearned = stats?.daily_learned?.length || 0;
  const dailyGoal = 15;
  const streak = stats?.streak || 0;

  // Generate AI study plan
  const generateStudyPlan = async () => {
    if (!user || !profile) return;
    setGeneratingPlan(true);
    
    try {
      // Get weak areas based on stats
      const weakAreas = [];
      if (!readingStats?.avg_band || readingStats.avg_band < targetBand) weakAreas.push('reading');
      if (!listeningStats?.avg_band || listeningStats.avg_band < targetBand) weakAreas.push('listening');
      
      const plan = await groqService.generateStudyPlan({
        currentBand,
        targetBand,
        weeksUntilTest: 4,
        weakAreas,
        availableHoursPerWeek: Math.round(parseFloat(totalHours) * 7 / 7) // Approximate from current week
      });

      // Save to database
      await createPlan({
        title: `${targetBand} Band Study Plan`,
        target_band: targetBand,
        current_band: currentBand,
        duration_weeks: 4,
        focus_areas: weakAreas,
        weekly_schedule: plan.weeklySchedule
      });
    } catch (err) {
      console.error('Failed to generate study plan:', err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';

  const openHala = () => setHalaOpen(true);
  const closeHala = () => setHalaOpen(false);

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-8">
      {/* Header with real user name */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold leading-8">Welcome back, {displayName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-accent" />
          {parseFloat(bandsAway) > 0
            ? `${bandsAway} bands away from your ${targetBand} goal`
            : `You've reached your ${targetBand} goal! 🎉`
          }
        </p>
      </div>

      {/* Streak Card */}
      {streak > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">{streak} day streak! 🔥</p>
              <p className="text-xs text-muted-foreground">Keep it up to reach your goal</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-orange-500">{dailyLearned}/{dailyGoal}</p>
              <p className="text-[10px] text-muted-foreground">words today</p>
            </div>
          </div>
        </div>
      )}

      {/* TODAY'S FOCUS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Today's Focus</h2>
          <div className="flex items-center gap-2">
            {!studyPlan && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs"
                onClick={generateStudyPlan}
                disabled={generatingPlan}
              >
                {generatingPlan ? (
                  <>
                    <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Plan
                  </>
                )}
              </Button>
            )}
            <span className="text-xs text-muted-foreground">~60 min total</span>
          </div>
        </div>

        {/* Primary CTA card */}
        {todayPlan[0] && (
          <Link to={todayPlan[0].to} className="block mb-3">
            <div className="bg-card rounded-xl shadow-card card-interactive p-5 border-l-4 border-l-primary">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  {(() => {
                    const IconComponent = todayPlan[0].icon;
                    return <IconComponent className="w-6 h-6" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{todayPlan[0].title}</p>
                  <p className="text-xs text-muted-foreground">{todayPlan[0].subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <Button variant="coral" size="sm" className="min-h-[44px] min-w-[80px]" tabIndex={-1}>
                    Start
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-1">{todayPlan[0].time || '20 min'}</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todayPlan.slice(1).map((item: any) => {
              const ItemIcon = item.icon;
              return (
                <Link key={item.title} to={item.to} className="block">
                  <div className="bg-card rounded-xl shadow-card card-interactive p-4 h-full">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color} mb-3`}>
                      <ItemIcon className="w-[18px] h-[18px]" />
                    </div>
                    <p className="text-sm font-semibold leading-tight">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time || '20 min'}
                      </span>
                      <span className="text-xs font-semibold text-primary">Start →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
      </div>

      {/* Goal Progress */}
      <Link to="/profile" className="block">
        <div className="bg-card rounded-xl p-5 shadow-card card-interactive">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--accent))" strokeWidth="6"
                  strokeDasharray={`${(bandProgress / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold leading-none">{currentBand.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Target: Band {targetBand}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dailyLearned} words learned today
              </p>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-accent rounded-full" style={{ width: `${bandProgress}%` }} />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        </div>
      </Link>

      {/* AI Recommendations */}
      <AiSuggestionEngine />

      {/* Weekly Activity */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">This Week</h2>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" /> {totalHours}h total
          </span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {weekDays.map((day, i) => {
            const dayData = weeklyData.find(d => d.day === day);
            const minutes = dayData?.minutes || 0;
            const maxH = 80;
            const h = minutes > 0 ? Math.max(6, (minutes / 80) * maxH) : 3;
            const isToday = i === (new Date().getDay() + 6) % 7;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: maxH }}>
                  <div
                    className={`w-full max-w-[28px] rounded transition-all duration-300 ${minutes > 0
                        ? isToday ? "bg-accent" : "bg-primary/60 hover:bg-primary/80"
                        : "bg-border"
                      }`}
                    style={{ height: h }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? "text-accent font-semibold" : "text-muted-foreground"}`}>{day}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          <span className="font-semibold text-foreground">{totalHours}h</span> practiced this week
        </p>
      </div>

      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={openHala}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-purple-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          title="Chat with Hala AI"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Hala Chat Modal */}
      <HalaChat isOpen={halaOpen} onClose={closeHala} context="general" />

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 px-4 pb-2" style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
        <Link to="/practice">
          <Button variant="coral" size="lg" className="w-full min-h-[48px] shadow-elevated">
            <Mic className="w-4 h-4 mr-1.5" />
            Continue Today's Practice
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
