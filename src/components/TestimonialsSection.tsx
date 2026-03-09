import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahima K.",
    from: "Dhaka",
    to: "University of Toronto",
    quote: "IELTShala's AI speaking practice was a game-changer. I went from 6.0 to 7.5 in 3 weeks. The feedback on my writing structure was exactly what I needed.",
    overall: "7.5",
    scores: "L: 8.0 | R: 7.5 | W: 7.0 | S: 7.0",
  },
  {
    name: "Tareq M.",
    from: "Chittagong",
    to: "Express Entry Canada",
    quote: "I couldn't afford ৳20,000 coaching fees. For ৳499/month, I got better preparation than my friends who paid for expensive centers.",
    overall: "8.0",
    scores: "L: 8.5 | R: 8.0 | W: 7.5 | S: 7.5",
  },
  {
    name: "Farhana S.",
    from: "Sylhet",
    to: "Manchester University",
    quote: "The AI tutor 'Hala' answered my questions at 2 AM when I was panicking before my test. It's like having a personal IELTS teacher in your pocket.",
    overall: "7.0",
    scores: "Improved from 5.5 → 7.0",
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-20 bg-background">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        From Bangladesh to the <span className="text-accent">World</span>
      </h2>
      <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
        Real stories from students who achieved their dream scores with IELTShala.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="border rounded-2xl p-8 hover:shadow-md transition-shadow">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.from} → {t.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded-lg">
                  {t.overall}
                </span>
                <span className="text-xs text-muted-foreground">{t.scores}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
