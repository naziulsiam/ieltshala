import { useState } from "react";
import { Flame, Clock, TrendingUp, Bell, Calendar, CreditCard, ChevronRight, Trophy, BookOpen, Zap, Target, Star, Award, Lock, LogOut, User, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserStats } from "@/hooks/useUserStats";

interface Badge {
  icon: typeof Trophy;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const badges: Badge[] = [
  { icon: Flame, title: "7-Day Streak", description: "Practice 7 days in a row", unlocked: true, rarity: "common" },
  { icon: Trophy, title: "First Mock Test", description: "Complete your first full mock", unlocked: true, rarity: "common" },
  { icon: BookOpen, title: "Vocab Master", description: "Learn 100 vocabulary words", unlocked: true, progress: 100, total: 100, rarity: "rare" },
  { icon: Zap, title: "Speed Reader", description: "Finish reading in under 15 min", unlocked: true, rarity: "rare" },
  { icon: Target, title: "Band 7 Achiever", description: "Score 7.0+ on any mock", unlocked: false, progress: 6.5, total: 7, rarity: "epic" },
  { icon: Star, title: "Perfect Listener", description: "Score 100% on listening", unlocked: false, progress: 85, total: 100, rarity: "epic" },
  { icon: Award, title: "30-Day Warrior", description: "Maintain a 30-day streak", unlocked: false, progress: 12, total: 30, rarity: "legendary" },
  { icon: Flame, title: "Writing Pro", description: "Get 7.0+ on 5 writing tasks", unlocked: false, progress: 2, total: 5, rarity: "legendary" },
];

const rarityConfig = {
  common: { gradient: "from-slate-400 to-slate-500", ring: "ring-slate-300", label: "Common" },
  rare: { gradient: "from-blue-400 to-blue-600", ring: "ring-blue-300", label: "Rare" },
  epic: { gradient: "from-purple-400 to-purple-600", ring: "ring-purple-300", label: "Epic" },
  legendary: { gradient: "from-amber-400 to-orange-500", ring: "ring-amber-300", label: "Legendary" },
};

const scores = [
  { skill: "Listening", score: 7.0, color: "bg-primary" },
  { skill: "Reading", score: 6.5, color: "bg-success" },
  { skill: "Writing", score: 6.0, color: "bg-accent" },
  { skill: "Speaking", score: 6.5, color: "bg-purple-500" },
];

const settings = [
  { icon: Bell, label: "Daily Reminder", value: "8:00 PM" },
  { icon: Calendar, label: "Test Date", value: "Apr 15, 2026" },
  { icon: Clock, label: "Weekly Goal", value: "10 hours" },
];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { stats, loading: statsLoading } = useUserStats();
  const navigate = useNavigate();
  
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    
    setUpdating(true);
    try {
      await updateProfile({ display_name: newName.trim() });
      setEditingName(false);
      setNewName("");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = () => {
    setNewName(profile?.display_name || "");
    setEditingName(true);
  };

  const cancelEditing = () => {
    setEditingName(false);
    setNewName("");
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-card rounded-xl" />
          <div className="h-40 bg-card rounded-xl" />
          <div className="h-32 bg-card rounded-xl" />
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'No email';
  const streak = stats?.streak || 0;
  const avatarUrl = profile?.avatar_url;
  const targetBand = profile?.target_band || 7.0;

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* Profile Header with Real Data */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-xl font-bold leading-tight bg-transparent border-b-2 border-accent focus:outline-none w-full"
                  placeholder="Your name"
                  autoFocus
                />
                <button 
                  onClick={handleUpdateName}
                  disabled={updating}
                  className="p-1 text-success hover:bg-success/10 rounded"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button 
                  onClick={cancelEditing}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold leading-tight">{displayName}</h1>
                <button 
                  onClick={startEditing}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">{email}</p>
            <div className="flex items-center gap-4 mt-1.5 text-xs">
              <span className="flex items-center gap-1 text-accent font-semibold">
                <Flame className="w-3.5 h-3.5" /> {streak}-day streak
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> Target: Band {targetBand}
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="mt-4 w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Achievements</h2>
          <span className="text-xs text-muted-foreground">
            {badges.filter((b) => b.unlocked).length}/{badges.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((badge) => {
            const cfg = rarityConfig[badge.rarity];
            return (
              <div
                key={badge.title}
                className={`relative flex flex-col items-center text-center p-3.5 rounded-xl transition-all ${badge.unlocked
                    ? "bg-card shadow-card ring-1 " + cfg.ring
                    : "bg-secondary/50 opacity-50"
                  }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 ${badge.unlocked
                      ? `bg-gradient-to-br ${cfg.gradient} text-primary-foreground`
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {badge.unlocked ? (
                    <badge.icon className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xs font-semibold leading-tight mb-0.5">{badge.title}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mb-2">{badge.description}</p>
                {badge.unlocked ? (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-primary-foreground`}>
                    {cfg.label}
                  </span>
                ) : badge.progress != null && badge.total != null ? (
                  <div className="w-full">
                    <div className="h-1 bg-border rounded-full overflow-hidden mb-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient}`}
                        style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{badge.progress}/{badge.total}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Scores */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h2 className="text-base font-semibold mb-3">Current Scores</h2>
        <div className="grid grid-cols-2 gap-3">
          {scores.map((s) => (
            <div key={s.skill} className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <span className="text-sm font-medium flex-1">{s.skill}</span>
              <span className="text-sm font-bold">{s.score}</span>
            </div>
          ))}
        </div>
        <Link to="/practice" className="mt-3 p-3 rounded-lg bg-accent/8 flex items-center gap-2 hover:bg-accent/15 transition-colors press">
          <TrendingUp className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-medium flex-1">
            Weakness: <span className="text-accent font-semibold">Writing Task Response (6.0)</span>
          </span>
          <span className="text-xs font-semibold text-primary flex items-center">Practice <ChevronRight className="w-3 h-3" /></span>
        </Link>
      </div>

      {/* Score Progress */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <h2 className="text-base font-semibold mb-3">Score Progress</h2>
        <div className="h-36 flex items-end gap-2">
          {[5.5, 5.5, 6.0, 6.0, 6.5, 6.5, 6.5].map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground">{s}</span>
              <div
                className="w-full max-w-[28px] bg-primary/70 hover:bg-primary rounded-t transition-colors"
                style={{ height: `${((s - 4) / 5) * 110}px` }}
              />
              <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {settings.map((s, i) => (
          <button key={s.label} className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/50 transition-colors press focus-ring text-left ${i < settings.length - 1 ? "border-b" : ""}`}>
            <s.icon className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm font-medium">{s.label}</span>
            <span className="text-xs text-muted-foreground">{s.value}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Subscription */}
      <div className="bg-card rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2.5 mb-3">
          <CreditCard className="w-[18px] h-[18px] text-primary" />
          <h2 className="text-base font-semibold">Subscription</h2>
        </div>
        <div className="flex items-center justify-between p-3.5 bg-secondary/50 rounded-lg mb-4">
          <div>
            <p className="text-sm font-semibold">Free Plan</p>
            <p className="text-[11px] text-muted-foreground">Limited daily practice</p>
          </div>
          <span className="text-[10px] font-semibold bg-secondary px-2.5 py-1 rounded-full text-muted-foreground">Active</span>
        </div>
        <Button variant="coral" className="w-full" size="lg">
          Upgrade to Premium — ৳499/mo
        </Button>
        <div className="flex justify-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
          <span>bKash</span><span>•</span><span>Nagad</span><span>•</span><span>Visa/MC</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
