import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

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
          <h1 className="text-2xl font-extrabold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Log in to continue your practice</p>
        </div>

        <div className="bg-background rounded-2xl border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Your password"
                  required
                />
              </div>
            </div>
            <Button variant="coral" size="xl" className="w-full" type="submit">
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-accent font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
