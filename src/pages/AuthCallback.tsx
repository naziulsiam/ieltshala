import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return;
    processedRef.current = true;

    const handleAuthCallback = async () => {
      try {
        // Check if we have a hash fragment (OAuth callback)
        const hash = window.location.hash;
        const query = window.location.search;
        
        console.log("Auth callback triggered");
        console.log("Hash:", hash ? "present" : "none");
        console.log("Query:", query ? "present" : "none");

        // Wait a moment for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Session found, redirecting to dashboard");
          // Successful authentication - redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // No session found - check for error in URL
          const url = new URL(window.location.href);
          const errorCode = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (errorCode) {
            throw new Error(errorDescription || `Authentication error: ${errorCode}`);
          }
          
          // No session and no error - might need more time or something went wrong
          console.log("No session found, waiting...");
          
          // Try one more time after a delay
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              navigate("/dashboard", { replace: true });
            } else {
              setError("Unable to complete authentication. Please try again.");
            }
          }, 2000);
        }
      } catch (err: unknown) {
        console.error("Auth callback error:", err);
        const errorMessage = err instanceof Error ? err.message : "Authentication failed";
        setError(errorMessage);
      }
    };

    handleAuthCallback();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
        <div className="bg-background rounded-2xl border p-8 shadow-sm text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-accent font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground text-sm mt-2">Please wait while we verify your account</p>
      </div>
    </div>
  );
};

export default AuthCallback;
