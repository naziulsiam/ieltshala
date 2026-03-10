import { groq, PREMIUM_MODEL, DEFAULT_MODEL, FAST_MODEL } from './groq';

export interface SpeakingFeedback {
  overallBand: number;
  fluency: number;
  pronunciation: number;
  lexicalResource: number;
  grammar: number;
  transcript: string;
  detailedFeedback: {
    fluency: string;
    pronunciation: string;
    vocabulary: string;
    grammar: string;
  };
  fillerWords: {
    count: number;
    words: string[];
    suggestions: string;
  };
  grammarErrors: Array<{
    error: string;
    correction: string;
    explanation: string;
  }>;
  vocabularyUpgrades: Array<{
    used: string;
    upgrade: string;
    context: string;
  }>;
  improvedVersion: string;
  practiceTips: string[];
  phonemeIssues?: Array<{
    phoneme: string;
    word: string;
    tip: string;
    confidence: 'low' | 'medium' | 'high';
  }>;
}

const SPEAKING_EVALUATION_PROMPT = `You are an experienced IELTS Speaking examiner. Evaluate this spoken response using official IELTS band descriptors.

Analyze:
1. Fluency & Coherence - flow, pauses, fillers, organization
2. Lexical Resource - vocabulary range, word choice, idioms
3. Grammatical Range & Accuracy - sentence structures, errors
4. Pronunciation - clarity, intonation, stress (assessed from transcript indicators)

Provide evaluation in this JSON format:
{
  "overallBand": number (0-9),
  "fluency": number (0-9),
  "pronunciation": number (0-9),
  "lexicalResource": number (0-9),
  "grammar": number (0-9),
  "transcript": "clean transcript of what was said",
  "detailedFeedback": {
    "fluency": "specific feedback on fluency",
    "pronunciation": "feedback on pronunciation patterns",
    "vocabulary": "feedback on word choice",
    "grammar": "feedback on grammar usage"
  },
  "fillerWords": {
    "count": number,
    "words": ["um", "uh", "like", etc],
    "suggestions": "how to reduce fillers"
  },
  "grammarErrors": [
    {
      "error": "the incorrect phrase",
      "correction": "correct version",
      "explanation": "why it's wrong"
    }
  ],
  "vocabularyUpgrades": [
    {
      "used": "simple word used",
      "upgrade": "better alternative",
      "context": "how to use it"
    }
  ],
  "improvedVersion": "a Band 7+ version of their response",
  "practiceTips": ["3-4 specific practice recommendations"]
}

Be encouraging but honest. Focus on actionable improvements.`;

/**
 * Evaluate a speaking response (using transcript)
 * Note: For real audio transcription, you'd need to use Whisper or similar
 * For now, this works with manual transcripts or text input
 */
export async function evaluateSpeaking(
  transcript: string,
  topic: string,
  part: 'part1' | 'part2' | 'part3'
): Promise<SpeakingFeedback> {
  const fullPrompt = `${SPEAKING_EVALUATION_PROMPT}

IELTS Speaking Part: ${part.toUpperCase()}
Topic: ${topic}

Transcript:
"${transcript}"

Provide your evaluation in the JSON format specified above.`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const feedback: SpeakingFeedback = JSON.parse(content);
    return feedback;
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    return getFallbackSpeakingFeedback(transcript);
  }
}

/**
 * Transcribe audio using a transcription service
 * Note: This is a placeholder - you'd integrate with Whisper or similar
 * For now, it returns a mock transcription
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // In production, you'd send this to a transcription API
  // For now, we'll return a placeholder that prompts the user to type
  
  // Example integration with Whisper API would be:
  /*
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  return data.text;
  */
  
  // For now, return empty to indicate manual entry needed
  return '';
}

/**
 * Analyze pronunciation patterns from transcript
 * Note: Real pronunciation analysis requires audio processing
 * This provides text-based analysis of likely pronunciation issues
 */
export async function analyzePronunciation(
  transcript: string,
  userNativeLanguage: string = 'Bengali'
): Promise<Array<{
  phoneme: string;
  word: string;
  tip: string;
  confidence: 'low' | 'medium' | 'high';
}>> {
  const prompt = `Analyze this IELTS speaking transcript for likely pronunciation challenges for a ${userNativeLanguage} native speaker.

Transcript: "${transcript}"

Identify 3-5 specific pronunciation issues they likely have based on common ${userNativeLanguage} speaker patterns.

Return JSON array:
[
  {
    "phoneme": "sound symbol (e.g., /θ/, /ð/, /ɜː/)",
    "word": "example word from transcript",
    "tip": "specific tip to improve this sound",
    "confidence": "high" | "medium" | "low"
  }
]

Focus on:
- Sounds that don't exist in ${userNativeLanguage}
- Common substitution errors
- Word stress patterns
- Intonation issues`;

  try {
    const response = await groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.phonemeIssues || [];
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    return [];
  }
}

/**
 * Generate a model speaking response
 */
export async function generateModelSpeakingResponse(
  topic: string,
  part: 'part1' | 'part2' | 'part3',
  targetBand: number = 7.5
): Promise<string> {
  const prompts = {
    part1: `Provide a natural, conversational response to this Part 1 question as if answering in an IELTS test. Target Band ${targetBand}.

Question: ${topic}

Requirements:
- 2-3 sentences
- Natural, spoken English
- Some idiomatic expressions
- Fluent but not overly formal`,
    
    part2: `Provide a model Part 2 (Long Turn) response. Target Band ${targetBand}.

Cue Card: ${topic}

Requirements:
- Speak for 1-2 minutes
- Clear structure (introduction, main points, conclusion)
- Rich vocabulary and varied grammar
- Personal examples and details
- Natural spoken English style`,
    
    part3: `Provide a model Part 3 (Discussion) response. Target Band ${targetBand}.

Question: ${topic}

Requirements:
- Academic but natural tone
- Abstract ideas with examples
- Balanced argument
- Sophisticated vocabulary
- Complex sentence structures`,
  };

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [{ role: 'user', content: prompts[part] }],
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || 'Could not generate model response.';
  } catch (error) {
    console.error('Model response generation error:', error);
    return 'Could not generate model response. Please try again.';
  }
}

/**
 * Analyze speech patterns (filler words, pauses, etc.)
 */
export function analyzeSpeechPatterns(transcript: string): {
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillers: string[];
  longPauses: number;
  suggestions: string[];
} {
  const words = transcript.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Common filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so', 'well'];
  const fillers: string[] = [];
  
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = transcript.match(regex);
    if (matches) {
      fillers.push(...matches.map(m => m.toLowerCase()));
    }
  });
  
  // Estimate long pauses from "..." or ", , ," patterns
  const pauseIndicators = (transcript.match(/\.{3,}/g) || []).length;
  const longPauses = pauseIndicators;
  
  // Estimate WPM (assuming average speaking time based on word count)
  // Part 1: ~20 seconds, Part 2: ~120 seconds, Part 3: ~45 seconds
  const estimatedDuration = wordCount < 30 ? 20 : wordCount < 200 ? 120 : 45;
  const wpm = Math.round((wordCount / estimatedDuration) * 60);
  
  const suggestions: string[] = [];
  if (fillers.length > 5) {
    suggestions.push('Try to reduce filler words. Pause silently instead of saying "um" or "uh"."');
  }
  if (wpm > 180) {
    suggestions.push('You\'re speaking quite fast. Slow down slightly for better clarity.');
  } else if (wpm < 120) {
    suggestions.push('Try to speak a bit more fluently. Practice will help increase your pace naturally.');
  }
  if (longPauses > 3) {
    suggestions.push('Work on reducing long pauses. Use connecting phrases like "That\'s an interesting question..."');
  }
  
  return {
    wordCount,
    wpm,
    fillerCount: fillers.length,
    fillers,
    longPauses,
    suggestions,
  };
}

// Fallback feedback when AI fails
function getFallbackSpeakingFeedback(transcript: string): SpeakingFeedback {
  const patterns = analyzeSpeechPatterns(transcript);
  
  return {
    overallBand: 6.0,
    fluency: 6.0,
    pronunciation: 6.0,
    lexicalResource: 6.0,
    grammar: 6.0,
    transcript: transcript,
    detailedFeedback: {
      fluency: 'Your speech shows natural flow with some hesitation. Practice will help improve fluency.',
      pronunciation: 'Pronunciation is generally clear. Focus on word stress and intonation patterns.',
      vocabulary: 'Good range of vocabulary. Try to incorporate more academic words and collocations.',
      grammar: 'Basic grammar structures are correct. Work on using more complex sentences.',
    },
    fillerWords: {
      count: patterns.fillerCount,
      words: patterns.fillers,
      suggestions: 'Try to replace fillers with brief pauses. This sounds more confident.',
    },
    grammarErrors: [],
    vocabularyUpgrades: [],
    improvedVersion: transcript,
    practiceTips: [
      'Record yourself daily and listen back',
      'Practice with IELTS speaking topics for 10 minutes daily',
      'Shadow native speakers in podcasts or videos',
    ],
  };
}
