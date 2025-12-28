export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  language: 'en' | 'bn';
  streak: number;
  totalStudyHours: number;
  createdAt: Date;
}

export interface SpeakingEvaluation {
  transcript: string;
  scores: {
    fluency: number;
    pronunciation: number;
    grammar: number;
    coherence: number;
    overall: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    sampleAnswer: string;
  };
}

export interface WritingEvaluation {
  scores: {
    taskAchievement: number;
    coherence: number;
    lexicalResource: number;
    grammar: number;
    overall: number;
  };
  feedback: {
    corrections: Array<{ original: string; corrected: string; explanation: string }>;
    improvedVersion: string;
    strengths: string[];
    improvements: string[];
  };
}
