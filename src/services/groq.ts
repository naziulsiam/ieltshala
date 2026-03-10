import Groq from 'groq-sdk';

// GROQ API configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn(
    'GROQ API key not found. Please set VITE_GROQ_API_KEY environment variable.'
  );
}

export const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

// Available models on GROQ (as of 2024)
export const GROQ_MODELS = {
  // Fast, cheap, good for most tasks
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',
  // Better quality, still fast
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile',
  // Best quality, slower
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
  // Mixtral - good for creative tasks
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  // Gemma - Google's model
  GEMMA_2_9B: 'gemma2-9b-it',
} as const;

// Default model to use
export const DEFAULT_MODEL = GROQ_MODELS.LLAMA_3_1_70B;

// Fast model for simple tasks
export const FAST_MODEL = GROQ_MODELS.LLAMA_3_1_8B;

// Model for complex tasks
export const PREMIUM_MODEL = GROQ_MODELS.LLAMA_3_3_70B;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ============================================
// READING PASSAGE GENERATION
// ============================================

export interface ReadingPassageRequest {
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  questionType?: 'heading' | 'tfng' | 'summary' | 'mcq' | 'short' | 'diagram';
}

export interface ReadingPassage {
  title: string;
  content: string;
  wordCount: number;
  questions: Array<{
    num: number;
    question: string;
    answer?: string;
    type?: string;
  }>;
}

export async function generateReadingPassage(
  request: ReadingPassageRequest
): Promise<ReadingPassage> {
  const { topic = 'general', difficulty, wordCount, questionType = 'tfng' } = request;
  
  const prompt = `Generate an IELTS Academic Reading passage about "${topic}".
Difficulty: ${difficulty}
Target word count: ${wordCount}
Question type: ${questionType}

Requirements:
- Academic tone suitable for IELTS
- Clear paragraph structure
- Content that allows for ${questionType} questions
- Include factual information that can be tested

Respond in this JSON format:
{
  "title": "Passage title",
  "content": "Full passage text with paragraphs separated by newlines",
  "wordCount": actual word count,
  "questions": [
    {"num": 1, "question": "Question text", "answer": "Answer"}
  ]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [
        { role: 'system', content: 'You are an IELTS test preparation expert. Generate high-quality reading passages.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse generated passage');
  } catch (error) {
    console.error('Error generating reading passage:', error);
    // Return fallback
    return {
      title: 'The Impact of Technology on Education',
      content: `Technology has transformed education in recent decades. From traditional classrooms to digital learning environments, students now have unprecedented access to information and learning tools.

The integration of technology in education began with simple tools like calculators and overhead projectors. Today, students use laptops, tablets, and smartphones to access educational content from anywhere in the world. This shift has democratized education, making quality learning materials available to millions who previously lacked access.

However, the rapid adoption of technology also presents challenges. Not all students have equal access to devices and reliable internet connections, creating a digital divide. Additionally, concerns about screen time and its effects on young people's development continue to be debated among educators and parents.

Despite these concerns, most experts agree that technology, when used appropriately, enhances learning outcomes. Interactive simulations, video lectures, and adaptive learning software can personalize education to meet individual student needs in ways traditional methods cannot match.`,
      wordCount: 180,
      questions: [
        { num: 1, question: 'Technology has transformed education in recent years.', answer: 'True' },
        { num: 2, question: 'All students have equal access to educational technology.', answer: 'False' },
        { num: 3, question: 'Technology always has negative effects on learning outcomes.', answer: 'False' },
      ]
    };
  }
}

// ============================================
// LISTENING TEST GENERATION
// ============================================

export interface ListeningTestRequest {
  section: 1 | 2 | 3 | 4;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ListeningTest {
  title: string;
  section: number;
  type: string;
  transcript: string;
  questions: Array<{
    num: number;
    question: string;
    answer?: string;
    type?: string;
  }>;
}

export async function generateListeningTest(
  request: ListeningTestRequest
): Promise<ListeningTest> {
  const { section, difficulty } = request;
  
  const sectionTypes: Record<number, string> = {
    1: 'Form completion - conversation between two speakers in an everyday social context',
    2: 'Map/diagram labeling or matching - monologue in an everyday social context',
    3: 'Multiple choice or matching - conversation among up to four speakers in an educational context',
    4: 'Note completion or summary completion - academic monologue'
  };

  const prompt = `Generate an IELTS Listening Test for Section ${section}.
Difficulty: ${difficulty}
Type: ${sectionTypes[section]}

Create:
1. A title for the listening test
2. A transcript of the audio (natural conversation or monologue)
3. 5-6 questions appropriate for this section

Respond in this JSON format:
{
  "title": "Test title",
  "section": ${section},
  "type": "form/map/mcq/etc",
  "transcript": "Full transcript text",
  "questions": [
    {"num": 1, "question": "Question text", "answer": "Expected answer", "type": "form/mcq/etc"}
  ]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [
        { role: 'system', content: 'You are an IELTS test preparation expert. Generate realistic listening test content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse generated test');
  } catch (error) {
    console.error('Error generating listening test:', error);
    return {
      title: 'Library Registration',
      section: 1,
      type: 'form',
      transcript: `Librarian: Good morning. How can I help you today?

Student: Hi, I'd like to register for a library card please.

Librarian: Of course. I'll need to take some details. What's your full name?

Student: Sarah Johnson.

Librarian: And your address?

Student: 42 Oak Road, Cambridge.

Librarian: Thank you. And your phone number?

Student: It's 07983 445 921.

Librarian: Great. Which day would you prefer for returning books?

Student: Thursday would be best for me.`,
      questions: [
        { num: 1, question: 'Name', answer: 'Sarah Johnson', type: 'form' },
        { num: 2, question: 'Address', answer: '42 Oak Road', type: 'form' },
        { num: 3, question: 'Phone number', answer: '07983 445 921', type: 'form' },
        { num: 4, question: 'Preferred day', answer: 'Thursday', type: 'form' },
      ]
    };
  }
}

// ============================================
// STUDY PLAN GENERATION
// ============================================

export interface StudyPlanRequest {
  currentBand: number;
  targetBand: number;
  weeksUntilTest: number;
  weakAreas: string[];
  availableHoursPerWeek: number;
}

export interface StudyPlan {
  title: string;
  overview: string;
  weeklySchedule: Array<{
    week: number;
    focus: string;
    tasks: string[];
  }>;
  dailyPlans: Array<{
    day: string;
    tasks: Array<{
      type: string;
      duration: number;
      description: string;
    }>;
  }>;
}

export async function generateStudyPlan(
  request: StudyPlanRequest
): Promise<StudyPlan> {
  const { currentBand, targetBand, weeksUntilTest, weakAreas, availableHoursPerWeek } = request;
  
  const prompt = `Create a personalized IELTS study plan.

Student Profile:
- Current Band: ${currentBand}
- Target Band: ${targetBand}
- Weeks until test: ${weeksUntilTest}
- Weak areas: ${weakAreas.join(', ') || 'General improvement needed'}
- Available hours per week: ${availableHoursPerWeek}

Create a detailed study plan with:
1. A motivating title
2. Overview of the approach
3. Weekly schedule for ${weeksUntilTest} weeks
4. Sample daily plans for each day of the week

Respond in this JSON format:
{
  "title": "Study plan title",
  "overview": "Brief description of the plan",
  "weeklySchedule": [
    {"week": 1, "focus": "Focus area", "tasks": ["task1", "task2"]}
  ],
  "dailyPlans": [
    {"day": "Monday", "tasks": [{"type": "reading/listening/writing/speaking/vocabulary", "duration": 30, "description": "What to do"}]}
  ]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert IELTS tutor who creates personalized study plans.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse study plan');
  } catch (error) {
    console.error('Error generating study plan:', error);
    return {
      title: `${targetBand} Band Study Plan`,
      overview: `A ${weeksUntilTest}-week plan to improve from band ${currentBand} to ${targetBand}`,
      weeklySchedule: [
        { week: 1, focus: 'Diagnostic and Foundation', tasks: ['Take full mock test', 'Identify weak areas', 'Build vocabulary foundation'] },
        { week: 2, focus: 'Reading Skills', tasks: ['Practice reading passages', 'Work on time management', 'Review reading strategies'] },
        { week: 3, focus: 'Listening Skills', tasks: ['Listen to academic lectures', 'Practice note-taking', 'Work on different question types'] },
        { week: 4, focus: 'Writing and Speaking', tasks: ['Practice Task 1 and 2 essays', 'Record speaking responses', 'Get feedback'] },
      ],
      dailyPlans: [
        { day: 'Monday', tasks: [{ type: 'reading', duration: 45, description: 'Complete 2 reading passages' }, { type: 'vocabulary', duration: 15, description: 'Review 20 new words' }] },
        { day: 'Tuesday', tasks: [{ type: 'listening', duration: 30, description: 'Complete 1 listening test' }, { type: 'writing', duration: 40, description: 'Write Task 2 essay' }] },
        { day: 'Wednesday', tasks: [{ type: 'speaking', duration: 30, description: 'Practice Part 2 topics' }, { type: 'reading', duration: 30, description: 'Review wrong answers' }] },
        { day: 'Thursday', tasks: [{ type: 'listening', duration: 45, description: 'Section 3-4 practice' }, { type: 'vocabulary', duration: 15, description: 'Collocations practice' }] },
        { day: 'Friday', tasks: [{ type: 'writing', duration: 60, description: 'Full writing test' }, { type: 'speaking', duration: 30, description: 'Mock speaking test' }] },
        { day: 'Saturday', tasks: [{ type: 'mock', duration: 165, description: 'Full mock test' }] },
        { day: 'Sunday', tasks: [{ type: 'vocabulary', duration: 30, description: 'Weekly review' }, { type: 'reading', duration: 30, description: 'Light reading practice' }] },
      ]
    };
  }
}

// ============================================
// MAIN SERVICE EXPORT
// ============================================

export const groqService = {
  generateReadingPassage,
  generateListeningTest,
  generateStudyPlan,
  // Expose raw client for advanced usage
  client: groq,
  models: GROQ_MODELS,
  defaultModel: DEFAULT_MODEL,
  premiumModel: PREMIUM_MODEL,
  fastModel: FAST_MODEL,
};
