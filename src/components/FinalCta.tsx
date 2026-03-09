import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinalCta = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <section className="py-24 bg-gradient-cta">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
          Start Your IELTS Journey Today
        </h2>
        <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
          Join 10,000+ Bangladeshi students achieving their dream scores. No credit card required for free plan.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-3 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 h-14 rounded-xl px-5 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button variant="coral" size="xl" type="submit">
            Get Started Free
          </Button>
        </form>

        <div className="flex items-center justify-center gap-6 text-primary-foreground/50 text-xs">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL Secure</span>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Data Privacy Protected</span>
          <span>bKash Verified</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
