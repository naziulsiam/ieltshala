import { useState } from "react";
import { Headphones, BookOpen, PenTool, Mic } from "lucide-react";

const features = [
  {
    id: "listening",
    icon: Headphones,
    emoji: "🎧",
    title: "Listening",
    desc: "Practice with authentic British, Australian & American accents. AI-generated questions match real exam difficulty.",
    visual: "Audio waveform with adaptive difficulty",
  },
  {
    id: "reading",
    icon: BookOpen,
    emoji: "📖",
    title: "Reading",
    desc: "Academic & General Training passages with all question types. Time yourself and get strategies for T/F/NG questions.",
    visual: "Split-screen reading with highlighting",
  },
  {
    id: "writing",
    icon: PenTool,
    emoji: "✍️",
    title: "Writing",
    desc: "Get instant AI scoring (Band 0-9) with detailed feedback on Task Response, Coherence, Lexical Resource & Grammar.",
    visual: "Essay editor with AI suggestions",
  },
  {
    id: "speaking",
    icon: Mic,
    emoji: "🗣️",
    title: "Speaking",
    desc: "Talk to our AI 24/7. Get pronunciation feedback, fluency scores, and practice Part 2 cue cards without pressure.",
    visual: "Voice wave animation & speaking timer",
  },
];

const FeaturesSection = () => {
  const [active, setActive] = useState(0);
  const f = features[active];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          AI-Powered Practice for <span className="text-accent">All 4 Modules</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Everything you need to ace every section of the IELTS exam.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {features.map((feat, i) => (
            <button
              key={feat.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                i === active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <span>{feat.emoji}</span> {feat.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <f.icon className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{f.desc}</p>
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {f.visual}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">{f.emoji}</span>
              <p className="text-sm text-muted-foreground font-medium">{f.visual}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
