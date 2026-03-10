import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PenTool, RotateCcw, Sparkles, ArrowLeft, X, Clock,
  BarChart3, FileText, MessageSquare, ChevronRight, CheckCircle2,
  Image, TrendingUp, Timer, Target, Copy, Columns2, Lightbulb,
  PieChart, Table, RefreshCw, Map, Mail, Heart, Eye,
  Scale, CircleDot, HelpCircle, GripVertical, BookOpen, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ─── Question Type Categories ─── */
const task1Types = [
  { id: "line", icon: TrendingUp, label: "Line Graph", count: 8 },
  { id: "bar", icon: BarChart3, label: "Bar Chart", count: 7 },
  { id: "pie", icon: PieChart, label: "Pie Chart", count: 5 },
  { id: "table", icon: Table, label: "Table", count: 4 },
  { id: "process", icon: RefreshCw, label: "Process", count: 6 },
  { id: "map", icon: Map, label: "Map", count: 3 },
  { id: "formal", icon: Mail, label: "Formal Letter", count: 5 },
  { id: "informal", icon: Heart, label: "Informal Letter", count: 4 },
];

const task2Types = [
  { id: "opinion", icon: MessageSquare, label: "Opinion", count: 10 },
  { id: "discussion", icon: Eye, label: "Discussion", count: 8 },
  { id: "advantages", icon: Scale, label: "Advantages / Disadvantages", count: 6 },
  { id: "problem", icon: CircleDot, label: "Problem & Solution", count: 7 },
  { id: "twopart", icon: HelpCircle, label: "Two-Part Question", count: 5 },
];

/* ─── Writing Topics ─── */
interface WritingTopic {
  id: string;
  type: "task1" | "task2";
  subType: string;
  title: string;
  prompt: string;
  category: string;
  estimatedTime: string;
  status: "new" | "attempted" | "scored";
  lastScore?: number;
}

const writingTopics: WritingTopic[] = [
  { id: "1", type: "task1", subType: "bar", title: "Bar Chart — CO₂ Emissions", prompt: "The bar chart shows CO₂ emissions per capita in five countries between 2000 and 2020. Summarise the information by selecting and reporting the main features.", category: "Data", estimatedTime: "20 min", status: "scored", lastScore: 6.5 },
  { id: "2", type: "task1", subType: "line", title: "Line Graph — Population Growth", prompt: "The line graph shows population growth in three cities from 1990 to 2020. Summarise the information.", category: "Data", estimatedTime: "20 min", status: "attempted" },
  { id: "3", type: "task1", subType: "process", title: "Process — Water Treatment", prompt: "The diagram illustrates the process of treating water for domestic use. Summarise the information.", category: "Process", estimatedTime: "20 min", status: "new" },
  { id: "4", type: "task1", subType: "pie", title: "Pie Chart — Energy Sources", prompt: "The pie charts compare the proportion of energy generated from different sources in two countries.", category: "Data", estimatedTime: "20 min", status: "new" },
  { id: "5", type: "task1", subType: "map", title: "Map — Town Development", prompt: "The maps show changes in the town of Ashford between 1950 and 2020.", category: "Map", estimatedTime: "20 min", status: "new" },
  { id: "6", type: "task2", subType: "opinion", title: "Opinion — Technology & Education", prompt: "Some people believe technology has made education more accessible. To what extent do you agree or disagree?", category: "Opinion", estimatedTime: "40 min", status: "scored", lastScore: 6.0 },
  { id: "7", type: "task2", subType: "discussion", title: "Discussion — Work-Life Balance", prompt: "Some argue that remote work improves quality of life, while others believe it blurs professional boundaries. Discuss both views and give your opinion.", category: "Discussion", estimatedTime: "40 min", status: "new" },
  { id: "8", type: "task2", subType: "problem", title: "Problem & Solution — Pollution", prompt: "Air pollution in major cities is a growing concern. What are the main causes of this problem, and what measures could be taken to address it?", category: "Problem/Solution", estimatedTime: "40 min", status: "new" },
  { id: "9", type: "task2", subType: "opinion", title: "Opinion — Crime & Punishment", prompt: "Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternative ways. Discuss both views.", category: "Opinion", estimatedTime: "40 min", status: "new" },
  { id: "10", type: "task2", subType: "advantages", title: "Advantages — Online Learning", prompt: "Online learning has become increasingly popular. Discuss the advantages and disadvantages of this trend.", category: "Advantages", estimatedTime: "40 min", status: "attempted" },
  { id: "11", type: "task2", subType: "twopart", title: "Two-Part — Youth Unemployment", prompt: "In many countries, young people find it difficult to get a job. What are the reasons for this? What solutions can you suggest?", category: "Two-Part", estimatedTime: "40 min", status: "new" },
];

/* ─── Annotated Sample Answer ─── */
const sampleParagraphs = [
  {
    type: "Introduction" as const,
    sentences: 3,
    text: "Crime reduction is a complex issue that requires multifaceted solutions beyond simply extending prison sentences. While incarceration serves as a deterrent, research consistently demonstrates that longer sentences alone do not significantly reduce recidivism rates. This essay will argue that a combination of prevention and rehabilitation is more effective than punitive measures.",
    annotations: [
      { phrase: "multifaceted solutions", type: "vocab" as const, tooltip: "Band 7+ vocabulary — shows range and precision" },
      { phrase: "recidivism rates", type: "vocab" as const, tooltip: "Academic collocation — demonstrates topic-specific vocabulary" },
      { phrase: "This essay will argue", type: "cohesion" as const, tooltip: "Clear thesis statement — signals essay direction to examiner" },
      { phrase: "While incarceration serves as a deterrent", type: "grammar" as const, tooltip: "Complex subordinate clause — demonstrates grammatical range" },
    ],
  },
  {
    type: "Body 1" as const,
    sentences: 5,
    text: "Proponents of lengthier imprisonment argue that keeping offenders behind bars for extended periods protects society and discourages potential criminals. However, this perspective overlooks the root causes of criminal behaviour, such as poverty, lack of education, and substance abuse. Moreover, overcrowded prisons often become breeding grounds for further criminal activity, undermining the very purpose of incarceration. Studies from multiple countries indicate that rehabilitation-focused systems yield lower reoffending rates. For instance, Norway's rehabilitative approach has resulted in a recidivism rate of just 20%, compared to over 70% in more punitive systems.",
    annotations: [
      { phrase: "However", type: "cohesion" as const, tooltip: "Discourse marker — creates contrast between ideas (Band 7 coherence)" },
      { phrase: "Moreover", type: "cohesion" as const, tooltip: "Additive connector — builds on previous argument logically" },
      { phrase: "For instance", type: "cohesion" as const, tooltip: "Exemplification — supports argument with specific evidence" },
      { phrase: "breeding grounds for further criminal activity", type: "vocab" as const, tooltip: "Idiomatic expression — elevates Lexical Resource score" },
      { phrase: "undermining the very purpose", type: "grammar" as const, tooltip: "Present participle clause — complex grammar structure" },
    ],
  },
  {
    type: "Body 2" as const,
    sentences: 5,
    text: "Alternative approaches to crime reduction have demonstrated considerable promise in addressing the underlying factors that drive criminal behaviour. Community-based programmes that provide education, vocational training, and mental health support have proven effective in reducing crime rates in several jurisdictions. Furthermore, restorative justice practices, which bring offenders face-to-face with their victims, have been shown to foster genuine remorse and behavioural change. These approaches not only reduce the financial burden on taxpayers but also contribute to building safer, more cohesive communities. It is therefore essential that governments allocate resources to prevention rather than solely relying on incarceration.",
    annotations: [
      { phrase: "Furthermore", type: "cohesion" as const, tooltip: "Progressive connector — advances the argument systematically" },
      { phrase: "It is therefore essential that", type: "grammar" as const, tooltip: "Impersonal 'it' construction — formal academic register" },
      { phrase: "Not only... but also", type: "grammar" as const, tooltip: "Correlative conjunction — demonstrates grammatical sophistication" },
      { phrase: "foster genuine remorse", type: "vocab" as const, tooltip: "Precise verb choice — 'foster' is more academic than 'create'" },
    ],
  },
  {
    type: "Conclusion" as const,
    sentences: 2,
    text: "In conclusion, while prison sentences play a necessary role in the justice system, a comprehensive approach combining prevention, education, and rehabilitation would prove far more effective in reducing crime rates sustainably. Governments must recognise that addressing the root causes of criminal behaviour is ultimately more beneficial than merely increasing the duration of punishment.",
    annotations: [
      { phrase: "In conclusion", type: "cohesion" as const, tooltip: "Conclusion signpost — clear paragraph function marker" },
      { phrase: "ultimately more beneficial than merely", type: "vocab" as const, tooltip: "Comparative structure with adverb — shows sophistication" },
    ],
  },
];

const upgradeSteps = [
  { title: "Strengthen your thesis", detail: "State your position clearly in the introduction. Use 'This essay will argue that...' or 'I strongly believe...' to signal your stance.", current: "Vague thesis", target: "Clear, arguable position" },
  { title: "Add cohesive devices", detail: "Use 'However', 'Moreover', 'Furthermore', 'In contrast' to connect paragraphs and ideas logically.", current: "Basic linking words", target: "Varied discourse markers" },
  { title: "Include specific evidence", detail: "Reference real-world examples, statistics, or case studies. E.g., 'Norway's recidivism rate of 20%'.", current: "General statements", target: "Concrete examples & data" },
];

const annotationColors = {
  vocab: { bg: "bg-accent/15", text: "text-accent", border: "border-accent/30", label: "Vocabulary" },
  cohesion: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", label: "Cohesion" },
  grammar: { bg: "bg-success/15", text: "text-success", border: "border-success/30", label: "Grammar" },
};

/* ─── Band-Level Sample Essays ─── */
const bandEssays: Record<string, { text: string; highlights: string[]; examinerComments: { paragraph: number; text: string }[] }> = {
  "6.0": {
    text: `Crime is a big problem in society and many people think longer prison sentences can help reduce it. I partly agree with this view but I also think there are other ways to reduce crime.

On one hand, longer prison sentences can be good because criminals are kept away from society for longer. This means they cannot commit more crimes during that time. Also, the fear of going to prison for a long time might stop some people from doing bad things.

On the other hand, there are problems with long sentences. Prisons are already very full and it costs a lot of money. Also, when criminals come out of prison, they often do not have jobs or support, so they might commit crimes again. Education and job training programs could be better ways to help them.

In conclusion, I think longer sentences can help but they are not the only answer. Governments should also invest in education and support programs to reduce crime.`,
    highlights: ["big problem", "can be good", "bad things", "very full", "a lot of money"],
    examinerComments: [
      { paragraph: 0, text: "Thesis is present but vague — 'partly agree' needs more specificity" },
      { paragraph: 1, text: "Ideas are relevant but underdeveloped — lacks concrete examples" },
      { paragraph: 2, text: "Good attempt at counterargument but vocabulary is basic" },
      { paragraph: 3, text: "Conclusion restates position but doesn't synthesize arguments" },
    ],
  },
  "6.5": {
    text: `Reducing crime is a significant challenge that governments worldwide face. While some advocate for longer prison sentences as the primary solution, I believe that a combination of punishment and prevention strategies would be more effective.

Supporters of extended imprisonment argue that keeping offenders incarcerated for longer periods protects the public and acts as a deterrent. There is some merit to this argument, as potential criminals may think twice before committing offences if they face severe consequences. However, this approach alone has limitations.

Conversely, alternative approaches such as education programs, community service, and rehabilitation have shown promising results in several countries. For example, some Scandinavian nations have lower crime rates despite shorter prison sentences, largely due to their focus on rehabilitation. These programs help offenders reintegrate into society and find employment.

In conclusion, while longer prison sentences may play a role in crime reduction, they should be complemented by preventive measures. A balanced approach that combines appropriate punishment with rehabilitation and education is likely to be most effective.`,
    highlights: ["significant challenge", "primary solution", "some merit", "promising results", "balanced approach"],
    examinerComments: [
      { paragraph: 0, text: "Clearer thesis than Band 6 — position is stated but could be stronger" },
      { paragraph: 1, text: "Better development with 'deterrent' concept but still fairly general" },
      { paragraph: 2, text: "Good use of example (Scandinavia) — this elevates Task Response" },
      { paragraph: 3, text: "Stronger conclusion with 'balanced approach' — shows synthesis" },
    ],
  },
  "7.0": {
    text: sampleParagraphs.map((p) => p.text).join("\n\n"),
    highlights: ["multifaceted solutions", "recidivism rates", "breeding grounds", "foster genuine remorse", "ultimately more beneficial"],
    examinerComments: [
      { paragraph: 0, text: "Strong thesis with clear position — 'multifaceted solutions' shows lexical range" },
      { paragraph: 1, text: "Well-developed with statistics (Norway 20%) — excellent Task Response" },
      { paragraph: 2, text: "Sophisticated grammar: 'Not only... but also', impersonal 'it' constructions" },
      { paragraph: 3, text: "Concise conclusion that synthesizes without repeating — Band 7 Coherence" },
    ],
  },
  "7.5": {
    text: `The question of whether lengthening prison sentences constitutes the most effective approach to crime reduction has generated considerable debate among criminologists and policymakers alike. While incarceration undeniably serves a punitive function, I would contend that a more nuanced, multi-pronged strategy yields substantially better outcomes in terms of long-term public safety.

Advocates of extended sentencing frequently cite the incapacitation effect — the straightforward logic that offenders behind bars cannot victimise the public. Additionally, the prospect of protracted imprisonment may function as a powerful deterrent, particularly for premeditated offences. Nevertheless, empirical evidence paints a more complex picture; a meta-analysis by the National Institute of Justice found no significant correlation between sentence length and reduced reoffending rates, suggesting that the deterrent effect plateaus beyond a certain threshold.

In contrast, rehabilitative and preventive interventions have demonstrated measurable efficacy across diverse contexts. Norway's open-prison model, which prioritises vocational training and psychological support, boasts a recidivism rate of approximately 20%, dwarfing the outcomes of more punitive systems such as the United States, where reoffending exceeds 70%. Furthermore, community-based initiatives — including restorative justice conferencing and early-intervention programmes for at-risk youth — address the socioeconomic root causes that propel individuals toward criminality in the first instance.

In summation, while custodial sentences remain a necessary component of any criminal justice framework, an overreliance on punitive measures is both fiscally imprudent and empirically unsupported. Governments would be well-advised to channel resources toward evidence-based rehabilitation and prevention, thereby fostering safer, more equitable societies.`,
    highlights: ["multi-pronged strategy", "incapacitation effect", "empirical evidence", "measurable efficacy", "fiscally imprudent"],
    examinerComments: [
      { paragraph: 0, text: "Exceptional thesis — 'nuanced, multi-pronged strategy' shows sophisticated vocabulary" },
      { paragraph: 1, text: "Outstanding: cites meta-analysis with source — academic register throughout" },
      { paragraph: 2, text: "Precise comparative data strengthens argument — 'dwarfing' is excellent word choice" },
      { paragraph: 3, text: "Masterful conclusion — 'fiscally imprudent' and 'empirically unsupported' are Band 8-level" },
    ],
  },
  "8.0": {
    text: `The efficacy of extended incarceration as a crime-reduction mechanism has been the subject of rigorous scholarly inquiry, with findings that challenge widely held assumptions about punitive deterrence. This essay will argue that, whilst imprisonment serves an indispensable societal function, an exclusive reliance on protracted sentencing is not only counterproductive but may, paradoxically, exacerbate the very problem it purports to solve.

The theoretical underpinning of longer sentences rests on two premises: incapacitation and deterrence. The former — physically preventing offenders from reoffending during their period of confinement — possesses intuitive appeal yet fails to account for the criminogenic environment within overcrowded penal institutions, where first-time offenders are frequently socialised into more sophisticated criminal networks. The latter premise, deterrence, has been systematically undermined by longitudinal studies; Nagin's (2013) comprehensive review in Crime and Justice concluded that the certainty of apprehension, rather than the severity of punishment, constitutes the primary deterrent to criminal behaviour.

Conversely, jurisdictions that have embraced holistic, evidence-based approaches to criminal justice have achieved demonstrably superior outcomes. Finland's progressive penal reforms of the 1970s, which shifted emphasis from retribution to rehabilitation, precipitated a sustained decline in both incarceration and recidivism rates without compromising public safety. Similarly, the 'Justice Reinvestment' model pioneered in Texas redirected funding from prison expansion toward community-based substance abuse treatment and mental health services, yielding a 12% reduction in crime alongside significant fiscal savings. These case studies illuminate a fundamental truth: that crime is overwhelmingly a symptom of deeper structural inequities — poverty, educational deprivation, and inadequate mental health provision — which punitive measures alone cannot address.

In conclusion, the empirical evidence overwhelmingly supports a paradigmatic shift away from reflexive punitiveness toward a more sophisticated, preventive model of criminal justice. Governments must recognise that sustainable crime reduction requires addressing its antecedents rather than merely warehousing its consequences.`,
    highlights: ["rigorous scholarly inquiry", "criminogenic environment", "systematically undermined", "paradigmatic shift", "warehousing its consequences"],
    examinerComments: [
      { paragraph: 0, text: "Exceptional: 'paradoxically, exacerbate' — near-native sophistication and irony" },
      { paragraph: 1, text: "Academic citations (Nagin, 2013) with precise analysis — full Band 9 Task Response" },
      { paragraph: 2, text: "Multiple case studies (Finland, Texas) with data — extraordinary development" },
      { paragraph: 3, text: "Powerful closing metaphor 'warehousing its consequences' — memorable and precise" },
    ],
  },
};

const stealPhrases = [
  { phrase: "multifaceted solutions", band: "7.0", use: "When introducing complex topics" },
  { phrase: "empirical evidence paints a more complex picture", band: "7.5", use: "When challenging assumptions" },
  { phrase: "breeding grounds for further criminal activity", band: "7.0", use: "When describing negative environments" },
  { phrase: "precipitated a sustained decline", band: "8.0", use: "When describing positive change" },
  { phrase: "fiscally imprudent and empirically unsupported", band: "7.5", use: "When arguing against a policy" },
  { phrase: "overwhelmingly a symptom of deeper structural inequities", band: "8.0", use: "When identifying root causes" },
  { phrase: "the certainty of apprehension rather than severity", band: "8.0", use: "When making nuanced distinctions" },
  { phrase: "foster genuine remorse and behavioural change", band: "7.0", use: "When discussing rehabilitation" },
];

/* ─── Draggable Compare Slider ─── */
const DraggableCompareSlider = ({ leftText, rightText, leftLabel, rightLabel }: {
  leftText: string; rightText: string; leftLabel: string; rightLabel: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(10, Math.min(90, pos)));
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleMove]);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-xl border border-border select-none" style={{ minHeight: 300 }}>
      {/* Left panel */}
      <div className="absolute inset-0 p-5 overflow-y-auto" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <p className="text-[10px] font-bold text-destructive uppercase mb-2 sticky top-0 bg-card pb-1">{leftLabel}</p>
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{leftText}</div>
      </div>
      {/* Right panel */}
      <div className="absolute inset-0 p-5 bg-success/5 overflow-y-auto" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
        <p className="text-[10px] font-bold text-success uppercase mb-2 sticky top-0 bg-success/5 pb-1">{rightLabel}</p>
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{rightText}</div>
      </div>
      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize z-10 group"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg cursor-col-resize group-hover:scale-110 transition-transform">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

interface Correction {
  type: "error" | "suggestion" | "good";
  original: string;
  corrected: string;
  explanation: string;
  category: string;
}

const corrections: Correction[] = [
  { type: "error", original: "technology have made", corrected: "technology has made", explanation: "Subject-verb agreement: 'technology' is singular.", category: "Grammar" },
  { type: "error", original: "online banking allow", corrected: "online banking allows", explanation: "Subject-verb agreement: singular noun requires singular verb.", category: "Grammar" },
  { type: "error", original: "more easier", corrected: "easier", explanation: "Double comparative: 'easier' is already comparative.", category: "Grammar" },
  { type: "error", original: "many peoples", corrected: "many people", explanation: "'People' is already plural.", category: "Grammar" },
  { type: "suggestion", original: "information overload makes it difficult to focus", corrected: "information overload can impede concentration", explanation: "Use more academic vocabulary for higher Lexical Resource.", category: "Vocabulary" },
  { type: "suggestion", original: "the benefits far outweigh the negatives", corrected: "the advantages significantly outweigh the disadvantages", explanation: "More formal and precise for academic writing.", category: "Vocabulary" },
  { type: "good", original: "On the one hand... On the other hand", corrected: "On the one hand... On the other hand", explanation: "Excellent use of contrasting discourse markers.", category: "Coherence" },
  { type: "good", original: "while technology has its drawbacks", corrected: "while technology has its drawbacks", explanation: "Good concessive clause — shows nuanced thinking.", category: "Task Response" },
];

const bandScores = [
  { label: "Task Response", score: 7.0, max: 9, icon: "✓" },
  { label: "Coherence & Cohesion", score: 6.0, max: 9, icon: "⚠️" },
  { label: "Lexical Resource", score: 6.5, max: 9, icon: "✓" },
  { label: "Grammar Range", score: 6.5, max: 9, icon: "✓" },
];

const typeConfig = {
  error: { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive", label: "Error" },
  suggestion: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning", label: "Suggestion" },
  good: { bg: "bg-success/10", text: "text-success", dot: "bg-success", label: "Well Done" },
};

const suggestions = [
  { text: 'Use "however" instead of "but" for a more formal tone', category: "Coherence" },
  { text: "Add specific examples or statistics to support your argument", category: "Task Response" },
  { text: 'Replace "good" and "bad" with more precise academic vocabulary', category: "Vocabulary" },
  { text: "Vary your sentence structures — mix simple and complex sentences", category: "Grammar" },
];

const sampleEssay = `Some people believe that technology has made our lives more complex, while others argue that it has simplified everyday tasks. In my opinion, technology has both positive and negative effects, but overall it has made life easier.

On the one hand, technology have made many tasks simpler. For example, online banking allow people to manage their finances from home. Similarly, communication is more easier through social media and messaging apps.

On the other hand, technology can be overwhelming. The constant notifications and information overload makes it difficult to focus. Furthermore, many peoples become too dependent on their devices.

In conclusion, while technology has its drawbacks, the benefits far outweigh the negatives. It is important that we use technology wisely and not let it control our lives.`;

const sampleAnswer = sampleParagraphs.map((p) => p.text).join("\n\n");

const sampleDifferences = upgradeSteps;

/* ─── Writing Editor (Star Feature) ─── */
const WritingEditor = ({ topic, onBack }: { topic: WritingTopic; onBack: () => void }) => {
  const [essay, setEssay] = useState(sampleEssay);
  const [scored, setScored] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [showRewrite, setShowRewrite] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [filter, setFilter] = useState<"all" | "error" | "suggestion" | "good">("all");
  const [scoringStep, setScoringStep] = useState("");
  const [timeLeft, setTimeLeft] = useState(topic.type === "task1" ? 20 * 60 : 40 * 60);
  const [copied, setCopied] = useState(false);
  const [selectedBand, setSelectedBand] = useState("7.0");
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const minWords = topic.type === "task1" ? 150 : 250;
  const overallBand = scored ? (bandScores.reduce((a, b) => a + b.score, 0) / bandScores.length).toFixed(1) : null;
  const isLowTime = timeLeft < 5 * 60;

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleScore = () => {
    setScoring(true);
    setScoringStep("Analyzing essay structure...");
    setTimeout(() => setScoringStep("Checking grammar & vocabulary..."), 800);
    setTimeout(() => setScoringStep("Evaluating coherence..."), 1600);
    setTimeout(() => setScoringStep("Calculating band score..."), 2400);
    setTimeout(() => { setScoring(false); setScoringStep(""); setScored(true); }, 3200);
  };

  const handleRewrite = () => {
    setRewriting(true);
    setTimeout(() => { setRewriting(false); setShowRewrite(true); }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = filter === "all" ? corrections : corrections.filter((c) => c.type === filter);

  const highlightEssay = (text: string) => {
    if (!scored) return text;
    let result = text;
    corrections.forEach((c) => {
      const cfg = typeConfig[c.type];
      result = result.replace(c.original, `<mark class="${cfg.bg} ${cfg.text} px-0.5 rounded cursor-pointer" title="${c.explanation}">${c.original}</mark>`);
    });
    return result;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-28 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">{topic.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {topic.type === "task1" ? "Task 1" : "Task 2"} • {topic.category}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 border border-border">
            <Target className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground">Band 7.0</span>
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${isLowTime ? "bg-destructive/10 border-destructive/30 animate-pulse" : "bg-card border-border"
            }`}>
            <Timer className={`w-3.5 h-3.5 ${isLowTime ? "text-destructive" : "text-muted-foreground"}`} />
            <span className={`text-xs font-semibold ${isLowTime ? "text-destructive" : "text-foreground"}`}>{fmt(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-accent/5 rounded-xl p-4 border border-accent/15 mb-6">
        <p className="text-xs font-semibold text-accent mb-1.5">Question</p>
        <p className="text-sm text-foreground leading-relaxed">{topic.prompt}</p>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Essay Editor */}
        <div className="flex-1 space-y-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <span className="text-sm font-semibold text-foreground">Your Essay</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${wordCount < minWords ? "text-destructive" : "text-success"}`}>
                  {wordCount}/{minWords} words
                </span>
                {wordCount >= minWords && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
              </div>
            </div>

            {/* Compare mode: side by side */}
            {compareMode ? (
              <DraggableCompareSlider
                leftText={essay}
                rightText={bandEssays[selectedBand]?.text || sampleAnswer}
                leftLabel="Your Essay"
                rightLabel={`Band ${selectedBand} Sample`}
              />
            ) : scored ? (
              <div className="p-5 text-sm leading-relaxed min-h-[300px]" dangerouslySetInnerHTML={{ __html: highlightEssay(essay) }} />
            ) : (
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="w-full p-5 text-sm leading-relaxed min-h-[350px] resize-y focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="Start writing your essay here..."
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!scored ? (
              <Button size="lg" onClick={handleScore} disabled={scoring} className="flex-1 sm:flex-none min-h-[48px]">
                {scoring ? (
                  <><span className="animate-spin mr-2">⏳</span> {scoringStep}</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1" /> Submit for AI Check</>
                )}
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={handleRewrite} disabled={rewriting}>
                  {rewriting ? <><span className="animate-spin mr-2">⏳</span> Rewriting...</> : <><RefreshCw className="w-4 h-4 mr-1" /> Rewrite with AI Help</>}
                </Button>
                <Button variant="outline" size="lg" onClick={() => setCompareMode(!compareMode)}>
                  <Columns2 className="w-4 h-4 mr-1" /> {compareMode ? "Exit Compare" : "Compare Side-by-Side"}
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setScored(false); setShowRewrite(false); setShowSample(false); setCompareMode(false); }}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Try Again
                </Button>
              </>
            )}
          </div>

          {/* AI Rewrite */}
          {showRewrite && !compareMode && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-accent/5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">AI-Improved Version</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full ml-auto">Est. Band 7.5</span>
              </div>
              <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {sampleAnswer}
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-3.5 h-3.5 mr-1" /> {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Feedback Panel */}
        {scored && (
          <div className="w-full lg:w-[400px] shrink-0 space-y-4">
            {/* Overall Score */}
            <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-4">
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Overall Score</h3>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-accent">{overallBand}</span>
                    <span className="text-lg text-muted-foreground font-medium">/9</span>
                  </div>
                </div>
                {/* Overall progress bar */}
                <div className="h-3 bg-secondary rounded-full overflow-hidden mb-4">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-700" style={{ width: `${(parseFloat(overallBand || "0") / 9) * 100}%` }} />
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  {bandScores.map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          {s.label}
                          <span className="text-xs">{s.icon}</span>
                        </span>
                        <span className={`font-bold ${s.score >= 7 ? "text-success" : s.score >= 6.5 ? "text-warning" : "text-destructive"}`}>{s.score}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{
                          width: `${(s.score / s.max) * 100}%`,
                          backgroundColor: s.score >= 7 ? "hsl(var(--success))" : s.score >= 6.5 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowSample(!showSample)}
                  className="w-full mt-4 text-sm font-semibold text-primary hover:underline underline-offset-2 text-center"
                >
                  {showSample ? "Hide Detailed Feedback" : "View Detailed Feedback ↓"}
                </button>
              </div>

              {/* Enhanced Sample Answer with Band Comparison */}
              {showSample && (
                <div className="border-t border-border">
                  <div className="px-5 py-4 space-y-4">
                    {/* Band Selector Toggle */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-accent" />
                        <h4 className="text-sm font-bold text-foreground">Band Comparison</h4>
                      </div>
                      <div className="flex gap-1.5">
                        {["6.0", "6.5", "7.0", "7.5", "8.0"].map((band) => (
                          <button
                            key={band}
                            onClick={() => setSelectedBand(band)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all press ${selectedBand === band
                                ? parseFloat(band) >= 7.5 ? "bg-success text-success-foreground" : parseFloat(band) >= 7 ? "bg-primary text-primary-foreground" : parseFloat(band) >= 6.5 ? "bg-warning text-warning-foreground" : "bg-destructive/80 text-destructive-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                              }`}
                          >
                            {band}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Word count & structure */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        {(bandEssays[selectedBand]?.text || "").trim().split(/\s+/).length} words
                      </span>
                      <span className="text-[10px] text-muted-foreground">Band {selectedBand} Model</span>
                    </div>

                    {/* Highlighted differences */}
                    {bandEssays[selectedBand] && (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {bandEssays[selectedBand].text.split("\n\n").map((para, pi) => {
                          let html = para;
                          // Highlight key phrases for this band
                          bandEssays[selectedBand].highlights.forEach((phrase) => {
                            html = html.replace(
                              phrase,
                              `<span class="bg-primary/15 text-primary px-0.5 rounded border-b border-dashed border-primary/30 font-medium">${phrase}</span>`
                            );
                          });
                          const comment = bandEssays[selectedBand].examinerComments.find((c) => c.paragraph === pi);
                          return (
                            <div key={pi} className="relative">
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">
                                    {pi === 0 ? "Introduction" : pi === bandEssays[selectedBand].text.split("\n\n").length - 1 ? "Conclusion" : `Body ${pi}`}
                                  </p>
                                  <p className="text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
                                </div>
                              </div>
                              {/* Examiner margin comment */}
                              {comment && (
                                <div className="mt-2 ml-3 pl-3 border-l-2 border-warning/40">
                                  <p className="text-[11px] text-warning italic flex items-start gap-1.5">
                                    <Quote className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span><span className="font-semibold not-italic">Examiner:</span> {comment.text}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* What changes between bands */}
                    {selectedBand !== "6.0" && (
                      <div className="bg-primary/5 rounded-xl p-3 border border-primary/15">
                        <p className="text-[10px] font-bold text-primary uppercase mb-2">
                          What changed from Band {(parseFloat(selectedBand) - 0.5).toFixed(1)} → {selectedBand}
                        </p>
                        <div className="space-y-1.5">
                          {bandEssays[selectedBand].highlights.map((phrase, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-foreground font-medium">"{phrase}"</span>
                              <span className="text-muted-foreground">— upgraded vocabulary</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steal These Phrases */}
                    <div className="bg-accent/5 rounded-xl p-4 border border-accent/15">
                      <h4 className="text-xs font-bold text-accent mb-3 flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" /> Steal These Phrases
                      </h4>
                      <div className="space-y-2">
                        {stealPhrases
                          .filter((p) => parseFloat(p.band) <= parseFloat(selectedBand))
                          .map((p, i) => (
                            <div key={i} className="flex items-center gap-2 group">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">"{p.phrase}"</p>
                                <p className="text-[10px] text-muted-foreground">{p.use} • Band {p.band}+</p>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(p.phrase);
                                  setCopiedPhrase(p.phrase);
                                  setTimeout(() => setCopiedPhrase(null), 1500);
                                }}
                                className="p-1.5 rounded-md hover:bg-secondary transition-colors shrink-0 press"
                              >
                                {copiedPhrase === p.phrase ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                                )}
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Upgrade Path */}
                    <div className="bg-accent/5 rounded-xl p-4 border border-accent/15">
                      <h4 className="text-xs font-bold text-accent mb-3 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> To reach Band {selectedBand}, incorporate these:
                      </h4>
                      <div className="space-y-3">
                        {upgradeSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{step.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{step.detail}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] line-through text-destructive/60">{step.current}</span>
                                <span className="text-[10px] text-muted-foreground">→</span>
                                <span className="text-[10px] font-semibold text-success">{step.target}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
                        <Copy className="w-3.5 h-3.5 mr-1" /> {copied ? "Copied!" : "Copy Essay"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setCompareMode(true)}>
                        <Columns2 className="w-3.5 h-3.5 mr-1" /> Drag Compare
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Corrections */}
              <div className="border-t border-border">
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
                  {(["all", "error", "suggestion", "good"] as const).map((f) => {
                    const count = f === "all" ? corrections.length : corrections.filter((c) => c.type === f).length;
                    return (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors press ${filter === f
                            ? f === "all" ? "bg-secondary text-foreground" : `${typeConfig[f].bg} ${typeConfig[f].text}`
                            : "bg-secondary/50 text-muted-foreground"
                          }`}
                      >
                        {f === "all" ? "All" : typeConfig[f].label} ({count})
                      </button>
                    );
                  })}
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-border">
                  {filtered.map((c, i) => {
                    const cfg = typeConfig[c.type];
                    return (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className={`text-[11px] font-bold ${cfg.text}`}>{cfg.label}</span>
                          <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground ml-auto">{c.category}</span>
                        </div>
                        {c.type !== "good" ? (
                          <div className="space-y-0.5 mb-1.5">
                            <p className="text-xs line-through text-destructive/70">{c.original}</p>
                            <p className="text-xs font-medium text-success">→ {c.corrected}</p>
                          </div>
                        ) : (
                          <p className="text-xs font-medium text-success mb-1.5">"{c.original}"</p>
                        )}
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{c.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div className="border-t border-border px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  <h4 className="text-sm font-bold text-foreground">Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <div>
                        <p className="text-foreground">{s.text}</p>
                        <p className="text-[10px] text-muted-foreground">{s.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 h-10" onClick={handleRewrite} disabled={rewriting}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Rewrite with AI Help
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Topic Browser ─── */
const WritingPractice = () => {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<WritingTopic | null>(null);
  const [activeTab, setActiveTab] = useState<"task1" | "task2">("task2");
  const [activeSubType, setActiveSubType] = useState<string | null>(null);

  if (activeTopic) {
    return <WritingEditor topic={activeTopic} onBack={() => setActiveTopic(null)} />;
  }

  const currentTypes = activeTab === "task1" ? task1Types : task2Types;
  const allTopics = writingTopics.filter((t) => t.type === activeTab);
  const filtered = activeSubType ? allTopics.filter((t) => t.subType === activeSubType) : allTopics;

  return (
    <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6 pb-28 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors press">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold leading-8 text-foreground">Writing Practice</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Task 1 & 2 • AI Scoring & Feedback</p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center gap-3 bg-accent/5 rounded-xl p-4 border border-accent/15">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Focus: Task 2 — Opinion Essays</p>
          <p className="text-xs text-muted-foreground mt-0.5">Coherence score (6.0) needs work • Target: Band 7.0</p>
        </div>
        <Button size="sm" className="h-8 text-xs shrink-0" onClick={() => setActiveTopic(writingTopics.find((t) => t.id === "9")!)}>
          Start
        </Button>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {(["task1", "task2"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setActiveSubType(null); }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all press focus-ring shrink-0 whitespace-nowrap ${activeTab === tab
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-secondary border border-border"
              }`}
          >
            {tab === "task1" ? "Task 1: Graph / Letter" : "Task 2: Essay"}
          </button>
        ))}
      </div>

      {/* Question Type Grid */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {activeTab === "task1" ? "Task 1 Types" : "Task 2 Essay Types"}
        </h2>
        <div className={`grid gap-3 ${activeTab === "task1" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
          {currentTypes.map((qt) => {
            const Icon = qt.icon;
            const isActive = activeSubType === qt.id;
            return (
              <button
                key={qt.id}
                onClick={() => setActiveSubType(isActive ? null : qt.id)}
                className={`rounded-xl p-3.5 text-left transition-all duration-200 press focus-ring border group ${isActive
                    ? "bg-accent/5 border-accent/30 shadow-sm"
                    : "bg-card border-border hover:border-accent/20 hover:shadow-card"
                  }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-colors ${isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                  }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-foreground">{qt.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{qt.count} topics</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            {activeSubType ? currentTypes.find((t) => t.id === activeSubType)?.label : "All Topics"} ({filtered.length})
          </h2>
          {activeSubType && (
            <button onClick={() => setActiveSubType(null)} className="text-xs font-medium text-primary hover:underline underline-offset-2">
              Show All
            </button>
          )}
        </div>
        <div className="space-y-3">
          {filtered.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className="w-full bg-card rounded-xl border border-border p-4 text-left hover:shadow-elevated transition-all duration-200 press focus-ring group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <PenTool className="w-5 h-5 text-accent group-hover:text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{topic.title}</p>
                    <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full shrink-0">{topic.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{topic.prompt}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.estimatedTime}</span>
                    {topic.status === "scored" && (
                      <span className="text-xs font-bold text-accent">Band {topic.lastScore}</span>
                    )}
                    {topic.status === "attempted" && (
                      <span className="text-[10px] font-semibold bg-warning/10 text-warning px-2 py-0.5 rounded-full">Draft</span>
                    )}
                    {topic.status === "new" && (
                      <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:underline underline-offset-2">
                        Start <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Submissions */}
      {writingTopics.filter((t) => t.status === "scored").length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Recent Scores</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {writingTopics.filter((t) => t.status === "scored").map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className="shrink-0 bg-card rounded-xl border border-border p-4 w-[180px] text-left hover:shadow-card transition-all press focus-ring"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                    {topic.type === "task1" ? "Task 1" : "Task 2"}
                  </span>
                  <span className="text-lg font-extrabold text-accent">{topic.lastScore}</span>
                </div>
                <p className="text-xs font-semibold text-foreground line-clamp-2">{topic.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Tap to review</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingPractice;
