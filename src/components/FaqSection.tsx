import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is IELTShala officially affiliated with British Council/IDP?",
    a: "No, we're an independent prep platform. Our AI is trained on real IELTS patterns and band descriptors.",
  },
  {
    q: "Can I use this for paper-based IELTS?",
    a: "Currently Bangladesh only has computer-delivered IELTS. Our platform perfectly simulates this format.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "Our AI correlates 95% with official IELTS examiner scores. Thousands of students have verified this.",
  },
  {
    q: "What if I don't improve?",
    a: "We offer a 30-day money-back guarantee if you don't see improvement in your mock test scores.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use bank-level encryption. Your essays and voice recordings are never shared.",
  },
];

const FaqSection = () => (
  <section id="faq" className="py-20 bg-sky">
    <div className="container max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
        Common <span className="text-accent">Questions</span>
      </h2>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="bg-background border rounded-xl px-6"
          >
            <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
