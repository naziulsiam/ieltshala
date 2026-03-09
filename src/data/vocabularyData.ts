// ─── Types ───────────────────────────────────────────────────────────────────

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: string;
  definition: string;
  example: string;
  bengali: string;
  bengaliTranslit: string;
  synonyms: string[];
  collocations: string[];
  category: string;
  subCategory: string;
}

export interface SubCategory {
  name: string;
  wordCount: number;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  totalWords: number;
  subCategories: SubCategory[];
}

export interface WordList {
  id: string;
  name: string;
  description: string;
  icon: string;
  wordCount: number;
  subLists?: { name: string; wordCount: number }[];
}

export interface LearningMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "education", name: "Education", emoji: "🎓", totalWords: 450, subCategories: [
    { name: "Academic Study", wordCount: 120 }, { name: "University Life", wordCount: 90 },
    { name: "Research & Analysis", wordCount: 110 }, { name: "Learning Methods", wordCount: 80 }, { name: "Teaching & Assessment", wordCount: 50 },
  ]},
  { id: "environment", name: "Environment", emoji: "🌍", totalWords: 380, subCategories: [
    { name: "Climate Change", wordCount: 100 }, { name: "Pollution & Waste", wordCount: 80 },
    { name: "Conservation", wordCount: 90 }, { name: "Energy & Resources", wordCount: 70 }, { name: "Natural Disasters", wordCount: 40 },
  ]},
  { id: "technology", name: "Technology", emoji: "💻", totalWords: 320, subCategories: [
    { name: "Digital Communication", wordCount: 90 }, { name: "Artificial Intelligence", wordCount: 70 },
    { name: "Internet & Security", wordCount: 80 }, { name: "Innovation & Development", wordCount: 80 },
  ]},
  { id: "health", name: "Health", emoji: "🏥", totalWords: 290, subCategories: [
    { name: "Medical Treatment", wordCount: 100 }, { name: "Mental Health", wordCount: 70 },
    { name: "Fitness & Nutrition", wordCount: 70 }, { name: "Healthcare Systems", wordCount: 50 },
  ]},
  { id: "work", name: "Work", emoji: "💼", totalWords: 410, subCategories: [
    { name: "Employment", wordCount: 110 }, { name: "Business & Finance", wordCount: 100 },
    { name: "Professional Skills", wordCount: 90 }, { name: "Workplace Culture", wordCount: 70 }, { name: "Entrepreneurship", wordCount: 40 },
  ]},
  { id: "travel", name: "Travel", emoji: "✈️", totalWords: 250, subCategories: [
    { name: "Tourism", wordCount: 90 }, { name: "Transportation", wordCount: 70 },
    { name: "Culture & Customs", wordCount: 50 }, { name: "Accommodation", wordCount: 40 },
  ]},
  { id: "government", name: "Government & Politics", emoji: "🏛️", totalWords: 280, subCategories: [
    { name: "Political Systems", wordCount: 100 }, { name: "Law & Justice", wordCount: 90 }, { name: "International Relations", wordCount: 90 },
  ]},
  { id: "arts", name: "Arts & Culture", emoji: "🎨", totalWords: 240, subCategories: [
    { name: "Visual Arts", wordCount: 80 }, { name: "Performing Arts", wordCount: 80 }, { name: "Literature", wordCount: 80 },
  ]},
  { id: "urban", name: "Urban Life", emoji: "🏙️", totalWords: 200, subCategories: [
    { name: "City Planning", wordCount: 70 }, { name: "Housing", wordCount: 65 }, { name: "Public Services", wordCount: 65 },
  ]},
  { id: "family", name: "Family & Society", emoji: "👨‍👩‍👧", totalWords: 260, subCategories: [
    { name: "Relationships", wordCount: 90 }, { name: "Social Issues", wordCount: 90 }, { name: "Demographics", wordCount: 80 },
  ]},
  { id: "abstract", name: "Abstract Concepts", emoji: "🧠", totalWords: 300, subCategories: [
    { name: "Philosophy", wordCount: 100 }, { name: "Ethics", wordCount: 100 }, { name: "Logic & Reasoning", wordCount: 100 },
  ]},
  { id: "science", name: "Science & Discovery", emoji: "🔬", totalWords: 340, subCategories: [
    { name: "Biology", wordCount: 90 }, { name: "Physics & Chemistry", wordCount: 90 },
    { name: "Space & Astronomy", wordCount: 80 }, { name: "Scientific Method", wordCount: 80 },
  ]},
];

// ─── Word Lists ──────────────────────────────────────────────────────────────

export const wordLists: WordList[] = [
  { id: "awl", name: "Academic Word List (AWL)", description: "570 essential academic words", icon: "🎓", wordCount: 570,
    subLists: Array.from({ length: 10 }, (_, i) => ({ name: `Sub-list ${i + 1}`, wordCount: 57 })),
  },
  { id: "band6", name: "Band 6.0 Essential", description: "800 core words for Band 6", icon: "📗", wordCount: 800 },
  { id: "band7", name: "Band 7.0 Advanced", description: "1200 words for Band 7+", icon: "📘", wordCount: 1200 },
  { id: "band8", name: "Band 8.0+ Mastery", description: "1000 elite vocabulary items", icon: "📕", wordCount: 1000 },
  { id: "essay-opinion", name: "Opinion & Argumentation", description: "Task 2 essay words", icon: "✍️", wordCount: 150 },
  { id: "essay-cause", name: "Cause & Effect", description: "Linking and transition words", icon: "🔗", wordCount: 120 },
  { id: "essay-compare", name: "Comparison & Contrast", description: "Comparative vocabulary", icon: "⚖️", wordCount: 100 },
  { id: "essay-problem", name: "Problem & Solution", description: "Problem-solving vocabulary", icon: "💡", wordCount: 130 },
  { id: "syn-good", name: "'Good' Alternatives", description: "Replace overused words", icon: "👍", wordCount: 20 },
  { id: "syn-bad", name: "'Bad' Alternatives", description: "Sophisticated replacements", icon: "👎", wordCount: 20 },
  { id: "syn-important", name: "'Important' Alternatives", description: "Academic alternatives", icon: "⭐", wordCount: 20 },
  { id: "syn-change", name: "'Increase/Decrease' Alternatives", description: "Precise vocabulary", icon: "📊", wordCount: 30 },
  { id: "col-verb-noun", name: "Verb + Noun Collocations", description: "Natural word pairings", icon: "🔤", wordCount: 200 },
  { id: "col-adj-noun", name: "Adjective + Noun Collocations", description: "Descriptive combinations", icon: "📝", wordCount: 250 },
  { id: "col-adv-adj", name: "Adverb + Adjective Collocations", description: "Modifier patterns", icon: "✨", wordCount: 150 },
];

// ─── Learning Modes ──────────────────────────────────────────────────────────

export const learningModes: LearningMode[] = [
  { id: "flashcard", name: "Flashcard Mode", icon: "🃏", description: "Flip cards with spaced repetition", color: "bg-primary/10 text-primary" },
  { id: "listen", name: "Listen & Learn", icon: "🎧", description: "Audio first, guess the meaning", color: "bg-accent/10 text-accent" },
  { id: "fillin", name: "Fill in the Blank", icon: "✏️", description: "Complete sentences with correct word", color: "bg-success/10 text-success" },
  { id: "match", name: "Match Master", icon: "🧩", description: "Match words to definitions", color: "bg-purple/10 text-purple" },
  { id: "spelling", name: "Spelling Bee", icon: "🐝", description: "Hear the word, type the spelling", color: "bg-warning/10 text-warning" },
  { id: "speed", name: "Speed Review", icon: "⚡", description: "60-second rapid fire challenge", color: "bg-destructive/10 text-destructive" },
];

// ─── Words Database ──────────────────────────────────────────────────────────

export const allWords: VocabWord[] = [
  // Education
  { id: "w1", word: "Aberration", phonetic: "/ˌæb.əˈreɪ.ʃən/", partOfSpeech: "Noun", level: "C1", definition: "A departure from what is normal or expected", example: "The new policy was seen as an aberration from the company's usual approach.", bengali: "বিচ্যুতি", bengaliTranslit: "Bichchhuti", synonyms: ["anomaly", "deviation", "irregularity", "abnormality"], collocations: ["temporary aberration", "statistical aberration", "rare aberration"], category: "education", subCategory: "Academic Study" },
  { id: "w2", word: "Paradigm", phonetic: "/ˈpær.ə.daɪm/", partOfSpeech: "Noun", level: "C1", definition: "A typical example or pattern of something; a model", example: "A paradigm shift in education is needed to meet modern demands.", bengali: "দৃষ্টান্ত", bengaliTranslit: "Drishtanto", synonyms: ["model", "pattern", "standard", "framework"], collocations: ["paradigm shift", "new paradigm", "dominant paradigm"], category: "education", subCategory: "Academic Study" },
  { id: "w3", word: "Curriculum", phonetic: "/kəˈrɪk.jə.ləm/", partOfSpeech: "Noun", level: "B2", definition: "The subjects comprising a course of study", example: "The national curriculum includes both sciences and humanities.", bengali: "পাঠ্যক্রম", bengaliTranslit: "Pathyokrom", synonyms: ["syllabus", "programme", "course of study"], collocations: ["national curriculum", "curriculum development", "core curriculum"], category: "education", subCategory: "Academic Study" },
  { id: "w4", word: "Pedagogy", phonetic: "/ˈped.ə.ɡɒdʒ.i/", partOfSpeech: "Noun", level: "C1", definition: "The method and practice of teaching", example: "Modern pedagogy emphasises student-centred learning.", bengali: "শিক্ষাবিজ্ঞান", bengaliTranslit: "Shikkhabiggan", synonyms: ["teaching", "instruction", "didactics", "education"], collocations: ["critical pedagogy", "progressive pedagogy", "effective pedagogy"], category: "education", subCategory: "Teaching & Assessment" },
  { id: "w5", word: "Empirical", phonetic: "/ɪmˈpɪr.ɪ.kəl/", partOfSpeech: "Adjective", level: "C1", definition: "Based on observation or experience rather than theory", example: "The study provides empirical evidence for the hypothesis.", bengali: "পরীক্ষামূলক", bengaliTranslit: "Porikkhhamulok", synonyms: ["experimental", "observed", "practical", "factual"], collocations: ["empirical evidence", "empirical research", "empirical data"], category: "education", subCategory: "Research & Analysis" },
  { id: "w6", word: "Hypothesis", phonetic: "/haɪˈpɒθ.ə.sɪs/", partOfSpeech: "Noun", level: "B2", definition: "A proposed explanation based on limited evidence", example: "The researcher tested the hypothesis through experiments.", bengali: "অনুমান", bengaliTranslit: "Onuman", synonyms: ["theory", "thesis", "proposition", "assumption"], collocations: ["test a hypothesis", "null hypothesis", "working hypothesis"], category: "education", subCategory: "Research & Analysis" },
  { id: "w7", word: "Cognitive", phonetic: "/ˈkɒɡ.nɪ.tɪv/", partOfSpeech: "Adjective", level: "C1", definition: "Relating to mental processes of perception and learning", example: "Cognitive development in children follows predictable stages.", bengali: "জ্ঞানীয়", bengaliTranslit: "Gyaneeyo", synonyms: ["mental", "intellectual", "cerebral"], collocations: ["cognitive skills", "cognitive development", "cognitive ability"], category: "education", subCategory: "Learning Methods" },
  { id: "w8", word: "Dissertation", phonetic: "/ˌdɪs.əˈteɪ.ʃən/", partOfSpeech: "Noun", level: "B2", definition: "A long essay on a particular subject for a university degree", example: "She completed her dissertation on climate policy impacts.", bengali: "গবেষণা-সন্দর্ভ", bengaliTranslit: "Gobeshona-sondorbho", synonyms: ["thesis", "treatise", "paper", "study"], collocations: ["doctoral dissertation", "write a dissertation", "dissertation topic"], category: "education", subCategory: "University Life" },
  // Environment
  { id: "w9", word: "Sustainability", phonetic: "/səˌsteɪ.nəˈbɪl.ɪ.ti/", partOfSpeech: "Noun", level: "B2", definition: "The ability to maintain at a certain rate or level without depleting resources", example: "Sustainability should be at the heart of urban planning.", bengali: "টেকসইতা", bengaliTranslit: "Tekosoita", synonyms: ["viability", "durability", "maintainability"], collocations: ["environmental sustainability", "sustainability goals", "long-term sustainability"], category: "environment", subCategory: "Conservation" },
  { id: "w10", word: "Biodiversity", phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sɪ.ti/", partOfSpeech: "Noun", level: "B2", definition: "The variety of plant and animal life in an area", example: "Deforestation threatens the biodiversity of tropical regions.", bengali: "জীববৈচিত্র্য", bengaliTranslit: "Jiboboichitro", synonyms: ["biological diversity", "ecosystem variety"], collocations: ["biodiversity loss", "rich biodiversity", "biodiversity conservation"], category: "environment", subCategory: "Conservation" },
  { id: "w11", word: "Emission", phonetic: "/ɪˈmɪʃ.ən/", partOfSpeech: "Noun", level: "B2", definition: "The production and discharge of something, especially gas", example: "Carbon emissions must be reduced to combat climate change.", bengali: "নির্গমন", bengaliTranslit: "Nirgomon", synonyms: ["discharge", "release", "output", "exhaust"], collocations: ["carbon emissions", "reduce emissions", "emission standards"], category: "environment", subCategory: "Climate Change" },
  { id: "w12", word: "Deforestation", phonetic: "/diːˌfɒr.ɪˈsteɪ.ʃən/", partOfSpeech: "Noun", level: "B2", definition: "The clearing of trees in a forested area", example: "Deforestation in the Amazon has accelerated in recent years.", bengali: "বন উজাড়", bengaliTranslit: "Bon Ujar", synonyms: ["forest clearing", "logging", "land clearing"], collocations: ["illegal deforestation", "tropical deforestation", "prevent deforestation"], category: "environment", subCategory: "Climate Change" },
  { id: "w13", word: "Renewable", phonetic: "/rɪˈnjuː.ə.bəl/", partOfSpeech: "Adjective", level: "B2", definition: "A source of energy that is not depleted when used", example: "Wind and solar are the most popular renewable energy sources.", bengali: "নবায়নযোগ্য", bengaliTranslit: "Nobayonjogyo", synonyms: ["sustainable", "replenishable", "inexhaustible"], collocations: ["renewable energy", "renewable resources", "renewable sources"], category: "environment", subCategory: "Energy & Resources" },
  { id: "w14", word: "Contamination", phonetic: "/kənˌtæm.ɪˈneɪ.ʃən/", partOfSpeech: "Noun", level: "B2", definition: "The action of making something impure by polluting", example: "Water contamination poses a serious health risk.", bengali: "দূষণ", bengaliTranslit: "Dushon", synonyms: ["pollution", "tainting", "corruption", "impurity"], collocations: ["water contamination", "soil contamination", "prevent contamination"], category: "environment", subCategory: "Pollution & Waste" },
  // Technology
  { id: "w15", word: "Ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", partOfSpeech: "Adjective", level: "C1", definition: "Present, appearing, or found everywhere", example: "Mobile phones have become ubiquitous in modern society.", bengali: "সর্বব্যাপী", bengaliTranslit: "Sorbobbyapi", synonyms: ["omnipresent", "pervasive", "universal", "widespread"], collocations: ["ubiquitous technology", "ubiquitous computing", "become ubiquitous"], category: "technology", subCategory: "Digital Communication" },
  { id: "w16", word: "Algorithm", phonetic: "/ˈæl.ɡə.rɪð.əm/", partOfSpeech: "Noun", level: "C1", definition: "A process or set of rules followed in calculations or problem-solving", example: "Social media algorithms determine what content you see.", bengali: "গাণিতিক ধারা", bengaliTranslit: "Ganitik Dhara", synonyms: ["procedure", "formula", "method", "process"], collocations: ["search algorithm", "complex algorithm", "algorithm design"], category: "technology", subCategory: "Artificial Intelligence" },
  { id: "w17", word: "Obsolete", phonetic: "/ˈɒb.sə.liːt/", partOfSpeech: "Adjective", level: "B2", definition: "No longer produced or used; out of date", example: "Rapid technological change makes devices obsolete within years.", bengali: "অপ্রচলিত", bengaliTranslit: "Oprocolit", synonyms: ["outdated", "antiquated", "archaic", "defunct"], collocations: ["become obsolete", "render obsolete", "obsolete technology"], category: "technology", subCategory: "Innovation & Development" },
  { id: "w18", word: "Encryption", phonetic: "/ɪnˈkrɪp.ʃən/", partOfSpeech: "Noun", level: "C1", definition: "The process of converting information into a code for security", example: "End-to-end encryption protects private messages.", bengali: "সংকেতায়ন", bengaliTranslit: "Shonketayon", synonyms: ["encoding", "ciphering", "scrambling"], collocations: ["data encryption", "encryption key", "strong encryption"], category: "technology", subCategory: "Internet & Security" },
  // Health
  { id: "w19", word: "Sedentary", phonetic: "/ˈsed.ən.tər.i/", partOfSpeech: "Adjective", level: "C1", definition: "Characterised by much sitting and little physical exercise", example: "A sedentary lifestyle can lead to various health problems.", bengali: "নিষ্ক্রিয়", bengaliTranslit: "Nishkriyo", synonyms: ["inactive", "desk-bound", "stationary"], collocations: ["sedentary lifestyle", "sedentary job", "sedentary behaviour"], category: "health", subCategory: "Fitness & Nutrition" },
  { id: "w20", word: "Diagnosis", phonetic: "/ˌdaɪ.əɡˈnəʊ.sɪs/", partOfSpeech: "Noun", level: "B2", definition: "The identification of the nature of an illness by examination", example: "Early diagnosis of cancer significantly improves survival rates.", bengali: "রোগনির্ণয়", bengaliTranslit: "Rognirnoyo", synonyms: ["identification", "determination", "analysis", "assessment"], collocations: ["medical diagnosis", "early diagnosis", "accurate diagnosis"], category: "health", subCategory: "Medical Treatment" },
  { id: "w21", word: "Epidemic", phonetic: "/ˌep.ɪˈdem.ɪk/", partOfSpeech: "Noun", level: "B2", definition: "A widespread occurrence of an infectious disease in a community", example: "The obesity epidemic is a major public health concern.", bengali: "মহামারী", bengaliTranslit: "Mohamari", synonyms: ["outbreak", "plague", "pandemic", "contagion"], collocations: ["global epidemic", "epidemic proportions", "combat the epidemic"], category: "health", subCategory: "Healthcare Systems" },
  { id: "w22", word: "Therapeutic", phonetic: "/ˌθer.əˈpjuː.tɪk/", partOfSpeech: "Adjective", level: "C1", definition: "Administered or applied for reasons of health; healing", example: "Art can have a therapeutic effect on mental well-being.", bengali: "চিকিৎসামূলক", bengaliTranslit: "Chikitsamulok", synonyms: ["healing", "curative", "remedial", "restorative"], collocations: ["therapeutic benefits", "therapeutic approach", "therapeutic value"], category: "health", subCategory: "Mental Health" },
  // Work
  { id: "w23", word: "Resilient", phonetic: "/rɪˈzɪl.i.ənt/", partOfSpeech: "Adjective", level: "C1", definition: "Able to withstand or recover quickly from difficulties", example: "The economy proved resilient during the financial crisis.", bengali: "স্থিতিস্থাপক", bengaliTranslit: "Sthitisthapok", synonyms: ["tough", "adaptable", "flexible", "strong"], collocations: ["resilient economy", "emotionally resilient", "resilient workforce"], category: "work", subCategory: "Professional Skills" },
  { id: "w24", word: "Entrepreneur", phonetic: "/ˌɒn.trə.prəˈnɜːr/", partOfSpeech: "Noun", level: "B2", definition: "A person who sets up a business, taking on financial risk", example: "She is a successful entrepreneur who founded three companies.", bengali: "উদ্যোক্তা", bengaliTranslit: "Uddokta", synonyms: ["businessperson", "founder", "innovator"], collocations: ["serial entrepreneur", "social entrepreneur", "aspiring entrepreneur"], category: "work", subCategory: "Entrepreneurship" },
  { id: "w25", word: "Redundancy", phonetic: "/rɪˈdʌn.dən.si/", partOfSpeech: "Noun", level: "C1", definition: "The state of no longer being needed in a job", example: "The factory closure led to 500 redundancies.", bengali: "অপ্রয়োজনীয়তা", bengaliTranslit: "Oproyojoniyta", synonyms: ["dismissal", "layoff", "termination"], collocations: ["compulsory redundancy", "voluntary redundancy", "mass redundancies"], category: "work", subCategory: "Employment" },
  { id: "w26", word: "Lucrative", phonetic: "/ˈluː.krə.tɪv/", partOfSpeech: "Adjective", level: "C1", definition: "Producing a great deal of profit", example: "Software development remains a highly lucrative career.", bengali: "লাভজনক", bengaliTranslit: "Labhjonok", synonyms: ["profitable", "rewarding", "gainful", "remunerative"], collocations: ["lucrative career", "lucrative business", "lucrative deal"], category: "work", subCategory: "Business & Finance" },
  // Travel
  { id: "w27", word: "Itinerary", phonetic: "/aɪˈtɪn.ər.ər.i/", partOfSpeech: "Noun", level: "B2", definition: "A planned route or journey", example: "Our travel itinerary includes visits to five European cities.", bengali: "ভ্রমণসূচি", bengaliTranslit: "Bhromonsuchi", synonyms: ["schedule", "plan", "route", "programme"], collocations: ["travel itinerary", "detailed itinerary", "planned itinerary"], category: "travel", subCategory: "Tourism" },
  { id: "w28", word: "Indigenous", phonetic: "/ɪnˈdɪdʒ.ɪ.nəs/", partOfSpeech: "Adjective", level: "C1", definition: "Originating or occurring naturally in a particular place", example: "The festival celebrates indigenous culture and traditions.", bengali: "আদিবাসী", bengaliTranslit: "Adibashi", synonyms: ["native", "aboriginal", "original", "local"], collocations: ["indigenous people", "indigenous culture", "indigenous species"], category: "travel", subCategory: "Culture & Customs" },
  // Government & Politics
  { id: "w29", word: "Bureaucracy", phonetic: "/bjʊəˈrɒk.rə.si/", partOfSpeech: "Noun", level: "C1", definition: "A system of government with many complicated rules", example: "Excessive bureaucracy can slow down decision-making.", bengali: "আমলাতন্ত্র", bengaliTranslit: "Amlatontro", synonyms: ["red tape", "administration", "officialdom"], collocations: ["government bureaucracy", "reduce bureaucracy", "excessive bureaucracy"], category: "government", subCategory: "Political Systems" },
  { id: "w30", word: "Sovereignty", phonetic: "/ˈsɒv.rɪn.ti/", partOfSpeech: "Noun", level: "C1", definition: "Supreme power or authority of a state to govern itself", example: "Nations guard their sovereignty fiercely in international negotiations.", bengali: "সার্বভৌমত্ব", bengaliTranslit: "Sarbobhoumotvho", synonyms: ["autonomy", "independence", "self-governance"], collocations: ["national sovereignty", "state sovereignty", "sovereignty rights"], category: "government", subCategory: "International Relations" },
  // Arts & Culture
  { id: "w31", word: "Aesthetic", phonetic: "/iːsˈθet.ɪk/", partOfSpeech: "Adjective", level: "C1", definition: "Concerned with beauty or the appreciation of beauty", example: "The building's aesthetic appeal draws thousands of visitors.", bengali: "নান্দনিক", bengaliTranslit: "Nandonik", synonyms: ["artistic", "beautiful", "tasteful", "elegant"], collocations: ["aesthetic value", "aesthetic appeal", "aesthetic sense"], category: "arts", subCategory: "Visual Arts" },
  { id: "w32", word: "Repertoire", phonetic: "/ˈrep.ə.twɑːr/", partOfSpeech: "Noun", level: "C1", definition: "A stock of plays, dances, or items that a performer knows", example: "The orchestra has an impressive repertoire of classical works.", bengali: "সংকলন", bengaliTranslit: "Shonkolon", synonyms: ["collection", "range", "stock", "catalogue"], collocations: ["wide repertoire", "musical repertoire", "expand repertoire"], category: "arts", subCategory: "Performing Arts" },
  // Abstract Concepts
  { id: "w33", word: "Ephemeral", phonetic: "/ɪˈfem.ər.əl/", partOfSpeech: "Adjective", level: "C1", definition: "Lasting for a very short time", example: "Fashion trends are ephemeral, but classic style is eternal.", bengali: "ক্ষণস্থায়ী", bengaliTranslit: "Khonosthayi", synonyms: ["fleeting", "transient", "momentary", "short-lived"], collocations: ["ephemeral beauty", "ephemeral nature", "ephemeral pleasures"], category: "abstract", subCategory: "Philosophy" },
  { id: "w34", word: "Ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", partOfSpeech: "Adjective", level: "B2", definition: "Open to more than one interpretation; not clear", example: "The politician's statement was deliberately ambiguous.", bengali: "দ্ব্যর্থক", bengaliTranslit: "Dbyorthok", synonyms: ["vague", "unclear", "equivocal", "indefinite"], collocations: ["ambiguous statement", "morally ambiguous", "ambiguous language"], category: "abstract", subCategory: "Logic & Reasoning" },
  { id: "w35", word: "Benevolent", phonetic: "/bɪˈnev.əl.ənt/", partOfSpeech: "Adjective", level: "C1", definition: "Well-meaning and kindly", example: "The charity relies on the benevolent donations of its supporters.", bengali: "দয়ালু", bengaliTranslit: "Doyalu", synonyms: ["kind", "compassionate", "generous", "charitable"], collocations: ["benevolent ruler", "benevolent society", "benevolent act"], category: "abstract", subCategory: "Ethics" },
  // Science
  { id: "w36", word: "Phenomenon", phonetic: "/fɪˈnɒm.ɪ.nən/", partOfSpeech: "Noun", level: "B2", definition: "A fact or situation that is observed to exist or happen", example: "Global warming is a well-documented phenomenon.", bengali: "ঘটনা", bengaliTranslit: "Ghotona", synonyms: ["occurrence", "event", "fact", "happening"], collocations: ["natural phenomenon", "cultural phenomenon", "rare phenomenon"], category: "science", subCategory: "Scientific Method" },
  { id: "w37", word: "Hypothesis", phonetic: "/haɪˈpɒθ.ə.sɪs/", partOfSpeech: "Noun", level: "B2", definition: "A proposed explanation made on the basis of limited evidence", example: "Scientists must test each hypothesis rigorously.", bengali: "প্রকল্প", bengaliTranslit: "Prokolpo", synonyms: ["theory", "conjecture", "supposition"], collocations: ["scientific hypothesis", "test a hypothesis", "null hypothesis"], category: "science", subCategory: "Scientific Method" },
  // Family & Society
  { id: "w38", word: "Demographic", phonetic: "/ˌdem.əˈɡræf.ɪk/", partOfSpeech: "Adjective", level: "C1", definition: "Relating to the structure of populations", example: "Demographic changes are reshaping the workforce.", bengali: "জনসংখ্যাতাত্ত্বিক", bengaliTranslit: "Jonoshonkhyatattik", synonyms: ["population-related", "statistical"], collocations: ["demographic change", "demographic data", "demographic shift"], category: "family", subCategory: "Demographics" },
  { id: "w39", word: "Stereotype", phonetic: "/ˈster.i.ə.taɪp/", partOfSpeech: "Noun", level: "B2", definition: "A widely held but oversimplified image of a particular group", example: "We should challenge harmful stereotypes in the media.", bengali: "গতানুগতিক ধারণা", bengaliTranslit: "Gotanugatik Dharona", synonyms: ["cliché", "generalisation", "preconception"], collocations: ["gender stereotype", "cultural stereotype", "break stereotypes"], category: "family", subCategory: "Social Issues" },
  // Urban Life
  { id: "w40", word: "Infrastructure", phonetic: "/ˈɪn.frə.strʌk.tʃər/", partOfSpeech: "Noun", level: "B2", definition: "The basic physical structures needed for society to function", example: "The government invested heavily in transport infrastructure.", bengali: "পরিকাঠামো", bengaliTranslit: "Porikathamo", synonyms: ["foundation", "framework", "facilities"], collocations: ["public infrastructure", "transport infrastructure", "infrastructure development"], category: "urban", subCategory: "City Planning" },
  // More varied words
  { id: "w41", word: "Exacerbate", phonetic: "/ɪɡˈzæs.ə.beɪt/", partOfSpeech: "Verb", level: "C1", definition: "Make a problem, bad situation, or negative feeling worse", example: "The policy could exacerbate inequality in education.", bengali: "আরও খারাপ করা", bengaliTranslit: "Aro Kharap Kora", synonyms: ["worsen", "aggravate", "intensify", "compound"], collocations: ["exacerbate the problem", "exacerbate tensions", "exacerbate inequality"], category: "education", subCategory: "Academic Study" },
  { id: "w42", word: "Mitigate", phonetic: "/ˈmɪt.ɪ.ɡeɪt/", partOfSpeech: "Verb", level: "C1", definition: "Make less severe, serious, or painful", example: "Governments should mitigate the effects of climate change.", bengali: "প্রশমিত করা", bengaliTranslit: "Proshomit Kora", synonyms: ["alleviate", "reduce", "diminish", "lessen"], collocations: ["mitigate risks", "mitigate the effects", "mitigate climate change"], category: "environment", subCategory: "Climate Change" },
  { id: "w43", word: "Proliferation", phonetic: "/prəˌlɪf.əˈreɪ.ʃən/", partOfSpeech: "Noun", level: "C1", definition: "Rapid increase in the number or amount of something", example: "The proliferation of social media has transformed communication.", bengali: "দ্রুত বৃদ্ধি", bengaliTranslit: "Druto Briddhi", synonyms: ["expansion", "spread", "multiplication", "growth"], collocations: ["rapid proliferation", "nuclear proliferation", "proliferation of technology"], category: "technology", subCategory: "Digital Communication" },
  { id: "w44", word: "Detrimental", phonetic: "/ˌdet.rɪˈmen.təl/", partOfSpeech: "Adjective", level: "C1", definition: "Tending to cause harm", example: "Pollution is detrimental to public health and the environment.", bengali: "ক্ষতিকর", bengaliTranslit: "Kkhotikor", synonyms: ["harmful", "damaging", "injurious", "deleterious"], collocations: ["detrimental effect", "detrimental impact", "prove detrimental"], category: "environment", subCategory: "Pollution & Waste" },
  { id: "w45", word: "Pragmatic", phonetic: "/præɡˈmæt.ɪk/", partOfSpeech: "Adjective", level: "C1", definition: "Dealing with things sensibly and realistically", example: "We need a pragmatic approach to solving this crisis.", bengali: "বাস্তববাদী", bengaliTranslit: "Bastobobadi", synonyms: ["practical", "realistic", "sensible", "rational"], collocations: ["pragmatic approach", "pragmatic solution", "pragmatic decision"], category: "abstract", subCategory: "Logic & Reasoning" },
  { id: "w46", word: "Unprecedented", phonetic: "/ʌnˈpres.ɪ.den.tɪd/", partOfSpeech: "Adjective", level: "B2", definition: "Never done or known before", example: "The pandemic caused unprecedented disruption to daily life.", bengali: "অভূতপূর্ব", bengaliTranslit: "Obhutpurbo", synonyms: ["unparalleled", "unmatched", "extraordinary", "novel"], collocations: ["unprecedented growth", "unprecedented challenges", "at an unprecedented rate"], category: "abstract", subCategory: "Philosophy" },
  { id: "w47", word: "Autonomous", phonetic: "/ɔːˈtɒn.ə.məs/", partOfSpeech: "Adjective", level: "C1", definition: "Having the freedom to govern itself or control its own affairs", example: "The region was granted autonomous status by the government.", bengali: "স্বায়ত্তশাসিত", bengaliTranslit: "Swayottoshasit", synonyms: ["independent", "self-governing", "sovereign", "self-ruling"], collocations: ["autonomous region", "autonomous vehicle", "fully autonomous"], category: "government", subCategory: "Political Systems" },
  { id: "w48", word: "Volatile", phonetic: "/ˈvɒl.ə.taɪl/", partOfSpeech: "Adjective", level: "C1", definition: "Liable to change rapidly and unpredictably", example: "The stock market has been particularly volatile this quarter.", bengali: "অস্থির", bengaliTranslit: "Osthir", synonyms: ["unstable", "unpredictable", "fluctuating", "erratic"], collocations: ["volatile market", "highly volatile", "volatile situation"], category: "work", subCategory: "Business & Finance" },
  { id: "w49", word: "Photosynthesis", phonetic: "/ˌfəʊ.təˈsɪn.θə.sɪs/", partOfSpeech: "Noun", level: "B2", definition: "The process by which green plants use sunlight to synthesise nutrients", example: "Photosynthesis is essential for life on Earth.", bengali: "সালোকসংশ্লেষণ", bengaliTranslit: "Salokosongshleshon", synonyms: ["light synthesis"], collocations: ["process of photosynthesis", "photosynthesis rate", "artificial photosynthesis"], category: "science", subCategory: "Biology" },
  { id: "w50", word: "Gentrification", phonetic: "/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/", partOfSpeech: "Noun", level: "C1", definition: "The process of renovating an area so it conforms to middle-class taste", example: "Gentrification has displaced many long-term residents.", bengali: "অভিজাতকরণ", bengaliTranslit: "Obhijatokoron", synonyms: ["urban renewal", "redevelopment", "regeneration"], collocations: ["urban gentrification", "gentrification process", "effects of gentrification"], category: "urban", subCategory: "Housing" },
  { id: "w51", word: "Articulate", phonetic: "/ɑːˈtɪk.jə.lət/", partOfSpeech: "Adjective", level: "C1", definition: "Having or showing the ability to speak fluently and coherently", example: "She is an articulate speaker who captivates audiences.", bengali: "স্পষ্টভাষী", bengaliTranslit: "Sposhtobhashi", synonyms: ["eloquent", "fluent", "expressive", "well-spoken"], collocations: ["articulate speaker", "clearly articulate", "articulate ideas"], category: "work", subCategory: "Professional Skills" },
  { id: "w52", word: "Disparity", phonetic: "/dɪˈspær.ə.ti/", partOfSpeech: "Noun", level: "C1", definition: "A great difference between things", example: "There is a growing disparity between rich and poor nations.", bengali: "বৈষম্য", bengaliTranslit: "Boishomyo", synonyms: ["inequality", "imbalance", "gap", "discrepancy"], collocations: ["income disparity", "gender disparity", "growing disparity"], category: "family", subCategory: "Social Issues" },
  { id: "w53", word: "Catalyst", phonetic: "/ˈkæt.əl.ɪst/", partOfSpeech: "Noun", level: "C1", definition: "A person or thing that precipitates an event or change", example: "The invention of the internet was a catalyst for globalisation.", bengali: "অনুঘটক", bengaliTranslit: "Onughotok", synonyms: ["stimulus", "trigger", "spark", "impetus"], collocations: ["act as a catalyst", "catalyst for change", "powerful catalyst"], category: "science", subCategory: "Physics & Chemistry" },
  { id: "w54", word: "Nostalgia", phonetic: "/nɒˈstæl.dʒə/", partOfSpeech: "Noun", level: "B2", definition: "A sentimental longing for the past", example: "The old photographs filled her with nostalgia.", bengali: "নস্টালজিয়া", bengaliTranslit: "Nostalgia", synonyms: ["longing", "wistfulness", "sentimentality", "reminiscence"], collocations: ["sense of nostalgia", "feel nostalgia", "wave of nostalgia"], category: "abstract", subCategory: "Ethics" },
  { id: "w55", word: "Meticulous", phonetic: "/məˈtɪk.jə.ləs/", partOfSpeech: "Adjective", level: "C1", definition: "Showing great attention to detail; very careful and precise", example: "The archaeologist's meticulous work uncovered rare artefacts.", bengali: "নিখুঁত", bengaliTranslit: "Nikhut", synonyms: ["thorough", "painstaking", "precise", "scrupulous"], collocations: ["meticulous attention", "meticulous planning", "meticulous research"], category: "work", subCategory: "Professional Skills" },
  { id: "w56", word: "Deteriorate", phonetic: "/dɪˈtɪə.ri.ə.reɪt/", partOfSpeech: "Verb", level: "C1", definition: "Become progressively worse", example: "Air quality continues to deteriorate in major cities.", bengali: "অবনতি হওয়া", bengaliTranslit: "Obonoti Howa", synonyms: ["decline", "degrade", "worsen", "degenerate"], collocations: ["rapidly deteriorate", "deteriorate further", "conditions deteriorate"], category: "environment", subCategory: "Pollution & Waste" },
  { id: "w57", word: "Alleviate", phonetic: "/əˈliː.vi.eɪt/", partOfSpeech: "Verb", level: "C1", definition: "Make suffering, deficiency, or a problem less severe", example: "The new medicine helped alleviate her chronic pain.", bengali: "উপশম করা", bengaliTranslit: "Uposhom Kora", synonyms: ["ease", "relieve", "reduce", "mitigate"], collocations: ["alleviate poverty", "alleviate pain", "alleviate suffering"], category: "health", subCategory: "Medical Treatment" },
  { id: "w58", word: "Scrutinise", phonetic: "/ˈskruː.tɪ.naɪz/", partOfSpeech: "Verb", level: "C1", definition: "Examine or inspect closely and thoroughly", example: "The committee will scrutinise the budget proposal carefully.", bengali: "নিরীক্ষা করা", bengaliTranslit: "Niriksha Kora", synonyms: ["examine", "inspect", "analyse", "investigate"], collocations: ["scrutinise closely", "scrutinise the evidence", "publicly scrutinised"], category: "government", subCategory: "Law & Justice" },
  { id: "w59", word: "Commute", phonetic: "/kəˈmjuːt/", partOfSpeech: "Verb", level: "B2", definition: "Travel regularly between one's place of work and home", example: "Millions of people commute to the city centre daily.", bengali: "দৈনিক যাতায়াত করা", bengaliTranslit: "Doinik Jatayat Kora", synonyms: ["travel", "journey", "shuttle"], collocations: ["daily commute", "long commute", "commute to work"], category: "travel", subCategory: "Transportation" },
  { id: "w60", word: "Versatile", phonetic: "/ˈvɜː.sə.taɪl/", partOfSpeech: "Adjective", level: "B2", definition: "Able to adapt or be adapted to many different functions or activities", example: "She is a versatile performer who excels in multiple genres.", bengali: "বহুমুখী", bengaliTranslit: "Bohumukhi", synonyms: ["adaptable", "flexible", "multifaceted", "all-round"], collocations: ["versatile player", "incredibly versatile", "versatile skills"], category: "arts", subCategory: "Performing Arts" },
];

// ─── Helper: Get Word of the Day ─────────────────────────────────────────────

export function getWordOfTheDay(): VocabWord {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return allWords[dayOfYear % allWords.length];
}

// ─── Helper: Filter words ────────────────────────────────────────────────────

export function getWordsByCategory(categoryId: string): VocabWord[] {
  return allWords.filter((w) => w.category === categoryId);
}

export function getWordsBySubCategory(categoryId: string, subCat: string): VocabWord[] {
  return allWords.filter((w) => w.category === categoryId && w.subCategory === subCat);
}

export function searchWords(query: string): VocabWord[] {
  const q = query.toLowerCase();
  return allWords.filter(
    (w) =>
      w.word.toLowerCase().includes(q) ||
      w.definition.toLowerCase().includes(q) ||
      w.bengali.includes(q) ||
      w.bengaliTranslit.toLowerCase().includes(q) ||
      w.synonyms.some((s) => s.toLowerCase().includes(q))
  );
}
