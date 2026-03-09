import { CheckCircle2 } from "lucide-react";

const chatMessages = [
  { from: "user", text: "Why did I get 6.0 on this essay?" },
  { from: "hala", text: "Your Task Response is strong, but you need more complex sentences. Try: \"While it is argued that...\"" },
  { from: "user", text: "Thanks! Can we practice speaking?" },
  { from: "hala", text: "Of course! Let's start Part 2. Here's your cue card: Describe a place you visited recently." },
];

const benefits = [
  "Instant answers to any IELTS question",
  "Personalized essay improvements",
  "Speaking confidence building",
  "Study plan adjustments on-the-go",
];

const AiTutorSection = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        Meet <span className="text-accent">Hala</span> — Your 24/7 IELTS Coach
      </h2>
      <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
        An AI tutor that never sleeps, never judges, and always has time for you.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Chat mockup */}
        <div className="bg-secondary rounded-2xl p-6 space-y-4 shadow-sm">
          {chatMessages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.from === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-background text-foreground border rounded-bl-md"
                }`}
              >
                {m.from === "hala" && (
                  <span className="text-accent font-semibold text-xs block mb-1">Hala 🤖</span>
                )}
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="space-y-5">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-foreground font-medium">{b}</span>
            </div>
          ))}
          <p className="text-sm text-muted-foreground pt-4 border-t">
            Hala is powered by advanced AI trained specifically on IELTS band descriptors and examiner standards.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AiTutorSection;
