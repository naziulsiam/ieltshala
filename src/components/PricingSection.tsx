import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free Forever",
    monthly: 0,
    yearly: 0,
    popular: false,
    features: [
      "20 practice questions/day",
      "1 full mock test/week",
      "Basic vocabulary builder",
      "Limited AI feedback",
    ],
  },
  {
    name: "Premium",
    monthly: 499,
    yearly: 4199,
    popular: true,
    features: [
      "Unlimited practice questions",
      "Unlimited AI Writing feedback",
      "Unlimited AI Speaking practice",
      "Unlimited full mock tests",
      "Advanced analytics & predictions",
    ],
  },
  {
    name: "Crash Course",
    monthly: 999,
    yearly: 999,
    popular: false,
    oneTime: true,
    features: [
      "Everything in Premium",
      "2-week intensive study plan",
      "Daily AI check-ins",
      "Priority support",
    ],
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-sky">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          Affordable IELTS <span className="text-accent">Success</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start free, upgrade when you're ready. Pay with bKash, Nagad, or card.
        </p>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-accent" : "bg-border"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform ${
                yearly ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
            Yearly <span className="text-accent text-xs font-bold">Save 16%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 transition-all ${
                p.popular
                  ? "bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-accent"
                  : "bg-background border shadow-sm"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <div className="mb-6">
                {p.monthly === 0 ? (
                  <span className="text-4xl font-extrabold">৳0</span>
                ) : p.oneTime ? (
                  <>
                    <span className="text-4xl font-extrabold">৳{p.monthly}</span>
                    <span className={`text-sm ${p.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}> one-time</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-extrabold">৳{yearly ? Math.round(p.yearly / 12) : p.monthly}</span>
                    <span className={`text-sm ${p.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/month</span>
                    {yearly && (
                      <p className={`text-xs mt-1 ${p.popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>৳{p.yearly}/year</p>
                    )}
                  </>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 text-accent`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  variant={p.popular ? "coral" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {p.monthly === 0 ? "Start Free" : "Get Started"}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 text-sm text-muted-foreground flex-wrap">
          {["bKash", "Nagad", "Rocket", "Visa", "Mastercard"].map((pm) => (
            <span key={pm} className="px-3 py-1 bg-background border rounded-lg font-medium">{pm}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
