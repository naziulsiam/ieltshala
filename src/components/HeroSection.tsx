import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroMockup from "@/assets/hero-mockup.png";
import VideoModal from "@/components/VideoModal";

const stats = [
  { icon: Users, value: "10,000+", label: "students enrolled" },
  { icon: Star, value: "4.9★", label: "rating" },
  { icon: TrendingUp, value: "+1.5", label: "avg band improvement" },
];

const HeroSection = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-hero">
        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold animate-fade-in-up">
              🇧🇩 #1 IELTS Prep App in Bangladesh
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary-foreground animate-fade-in-up delay-100">
              Master IELTS with Your Personal{" "}
              <span className="text-accent">AI Tutor</span>
            </h1>

            <p className="text-lg text-primary-foreground/75 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
              Bangladesh's first AI-powered IELTS platform. Practice all 4 modules,
              get instant AI feedback on Writing & Speaking, and achieve your target
              band score — guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
              <Link to="/signup">
                <Button variant="coral-pulse" size="xl">
                  Start Free Practice
                </Button>
              </Link>
              <Button variant="outline-light" size="xl" onClick={() => setVideoOpen(true)}>
                <Play className="w-5 h-5 mr-1" />
                Watch How It Works
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 animate-fade-in-up delay-400">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-primary-foreground/80">
                  <s.icon className="w-4 h-4 text-accent" />
                  <span className="font-bold">{s.value}</span>
                  <span className="text-sm text-primary-foreground/60">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 relative flex justify-center animate-fade-in-up delay-300">
            <div className="relative">
              <img
                src={heroMockup}
                alt="IELTShala App showing AI Writing feedback"
                className="w-72 md:w-96 drop-shadow-2xl"
                loading="eager"
              />
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-bold text-lg shadow-lg float-up">
                7.5
              </div>
              <div className="absolute top-1/3 -left-8 bg-background text-foreground px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium float-delayed">
                ✅ AI Corrected
              </div>
              <div className="absolute bottom-12 -right-6 bg-background text-foreground px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium float-up">
                🔥 12-day streak
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
};

export default HeroSection;
