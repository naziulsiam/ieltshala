import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Lock, User, Loader2, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Rate limit error helper
function getRateLimitMessage(error: unknown): string | null {
  if (!error) return null;
  
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();
  
  // Check for various rate limit error patterns
  if (lowerMessage.includes('rate limit') || 
      lowerMessage.includes('too many requests') ||
      lowerMessage.includes('429') ||
      lowerMessage.includes('for security purposes')) {
    return message;
  }
  
  return null;
}

const Signup = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsRateLimited(false);
    setLoading(true);

    try {
      await signUpWithEmail(form.email, form.password);
      setSuccess(true);
    } catch (err: unknown) {
      const rateLimitMsg = getRateLimitMessage(err);
      if (rateLimitMsg) {
        setIsRateLimited(true);
        setError(`Rate limit reached. Supabase free tier allows only 3-5 signups per hour.\n\n${rateLimitMsg}`);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Failed to create account";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsRateLimited(false);
    setLoading(true);

    try {
      await signInWithGoogle();
      // Note: Google OAuth will redirect, so we don't navigate here
    } catch (err: unknown) {
      const rateLimitMsg = getRateLimitMessage(err);
      if (rateLimitMsg) {
        setIsRateLimited(true);
        setError(`Rate limit reached. Please try again later.\n\n${rateLimitMsg}`);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Failed to sign up with Google";
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-extrabold">
                <span className="text-primary">IELTS</span>
                <span className="text-accent">hala</span>
              </span>
            </div>
          </div>

          <div className="bg-background rounded-2xl border p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Check your email</h2>
            <p className="text-muted-foreground text-sm">
              We've sent a confirmation link to <span className="font-medium text-foreground">{form.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link to verify your account and start your IELTS journey.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-extrabold">
              <span className="text-primary">IELTS</span>
              <span className="text-accent">hala</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Start your IELTS journey for free</p>
        </div>

        <div className="bg-background rounded-2xl border p-8 shadow-sm space-y-6">
          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 border rounded-xl hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`text-sm p-3 rounded-lg whitespace-pre-line ${
              isRateLimited 
                ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              <div className="flex items-start gap-2">
                {isRateLimited ? (
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Rate Limit Info */}
          {isRateLimited && (
            <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">💡 Workarounds:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Wait 1 hour before trying again</li>
                <li>Use Google OAuth instead (higher limits)</li>
                <li>Try a different network/IP address</li>
                <li>Contact me to upgrade Supabase plan</li>
              </ul>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your name"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Create password (min 6 characters)"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>
            <Button 
              variant="coral" 
              size="xl" 
              className="w-full" 
              type="submit" 
              disabled={loading || isRateLimited}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
