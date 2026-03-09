import { Monitor, Wallet, MessageCircleX } from "lucide-react";

const problems = [
  {
    icon: Monitor,
    title: "No Paper-Based IELTS in BD",
    desc: "Computer-delivered tests require different prep. We simulate the exact interface.",
  },
  {
    icon: Wallet,
    title: "Expensive Coaching Centers",
    desc: "Quality IELTS coaching costs ৳15,000+. IELTShala Premium is just ৳499/month.",
  },
  {
    icon: MessageCircleX,
    title: "No Feedback on Writing/Speaking",
    desc: "Our AI gives instant, detailed feedback — practice 100x more than human tutoring allows.",
  },
];

const ProblemSection = () => (
  <section className="py-20 bg-sky">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        Why Bangladeshi Students <span className="text-accent">Struggle</span> with IELTS
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        We understand the unique challenges you face — and we built IELTShala to solve every one of them.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((p) => (
          <div
            key={p.title}
            className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
