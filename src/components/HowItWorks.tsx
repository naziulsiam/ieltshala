import { Target, Zap, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Target,
    step: "01",
    title: "Set Your Goal",
    desc: "Tell us your target score and test date. We'll create a personalized study plan.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Practice Daily",
    desc: "20-30 minutes of targeted practice. AI adapts to your weak areas automatically.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Take Mock Tests",
    desc: "Full-length computer-delivered simulations. Know exactly when you're ready for the real test.",
  },
];

const HowItWorks = () => (
  <section className="py-20 bg-sky">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        Your Path to <span className="text-accent">IELTS Success</span>
      </h2>
      <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
        Three simple steps to achieve your dream band score.
      </p>
      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-border" />
        {steps.map((s) => (
          <div key={s.step} className="relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative z-10">
              {s.step}
            </div>
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
