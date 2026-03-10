import { groq, PREMIUM_MODEL, type AIResponse } from './groq';

export interface WritingFeedback {
  overallBand: number;
  taskResponse: number;
  coherence: number;
  lexicalResource: number;
  grammar: number;
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    type: 'grammar' | 'vocabulary' | 'coherence' | 'task_response';
  }>;
  suggestions: string[];
  strengths: string[];
  improvedVersion: string;
  examinerComments: {
    taskResponse: string;
    coherence: string;
    lexical: string;
    grammar: string;
  };
}

const WRITING_EVALUATION_PROMPT = `You are an experienced IELTS examiner. Evaluate this essay using official IELTS band descriptors.

Provide your evaluation in this exact JSON format:
{
  "overallBand": number (0-9, can be .5 increments),
  "taskResponse": number (0-9),
  "coherence": number (0-9),
  "lexicalResource": number (0-9),
  "grammar": number (0-9),
  "corrections": [
    {
      "original": "the error text",
      "corrected": "the correct version",
      "explanation": "why this is wrong and how to fix it",
      "type": "grammar" | "vocabulary" | "coherence" | "task_response"
    }
  ],
  "suggestions": ["3-4 specific improvement suggestions"],
  "strengths": ["2-3 things the student did well"],
  "improvedVersion": "a Band 7.5+ version of their essay incorporating corrections",
  "examinerComments": {
    "taskResponse": "detailed feedback on task achievement",
    "coherence": "feedback on essay structure and flow",
    "lexical": "feedback on vocabulary usage",
    "grammar": "feedback on grammar range and accuracy"
  }
}

Scoring guidelines:
- Band 9: Native-like, fully appropriate
- Band 8: Very occasional errors, sophisticated vocabulary
- Band 7: Occasional errors, good range, clear progression
- Band 6: Some errors but meaning clear, adequate range
- Band 5: Frequent errors, limited range, some confusion
- Band 4: Basic control, frequent errors impede meaning

Be strict but fair. Provide constructive criticism.`;

/**
 * Evaluate an IELTS Writing Task 2 essay
 */
export async function evaluateWriting(
  essay: string,
  taskType: 'task1' | 'task2',
  prompt: string
): Promise<WritingFeedback> {
  const fullPrompt = `${WRITING_EVALUATION_PROMPT}

Task Type: ${taskType === 'task1' ? 'Task 1 (Graph/Letter)' : 'Task 2 (Essay)'}
Task Prompt: ${prompt}

Student Essay:
${essay}

Provide your evaluation in the JSON format specified above.`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.3, // Lower temperature for consistent JSON
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const feedback: WritingFeedback = JSON.parse(content);
    return feedback;
  } catch (error) {
    console.error('Writing evaluation error:', error);
    // Return fallback feedback
    return getFallbackFeedback();
  }
}

/**
 * Get vocabulary suggestions for an essay
 */
export async function suggestVocabularyUpgrades(
  essay: string
): Promise<Array<{
  original: string;
  suggestion: string;
  reason: string;
}>> {
  const prompt = `Analyze this IELTS essay and suggest 5 vocabulary upgrades to improve the lexical resource score.

Essay:
${essay}

Return ONLY a JSON array in this format:
[
  {
    "original": "simple word/phrase",
    "suggestion": "academic alternative",
    "reason": "why this is better (Band 7+ vocabulary)"
  }
]

Focus on:
- Replacing common words with academic synonyms
- Improving collocations
- Adding idiomatic expressions
- Using more precise vocabulary`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    // Parse the response - might be wrapped in an object
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.upgrades || [];
  } catch (error) {
    console.error('Vocabulary suggestion error:', error);
    return [];
  }
}

/**
 * Generate a model answer for a given prompt
 */
export async function generateModelAnswer(
  prompt: string,
  taskType: 'task1' | 'task2',
  targetBand: number = 7.5
): Promise<string> {
  const fullPrompt = `Write a Band ${targetBand} model answer for this IELTS ${taskType === 'task1' ? 'Task 1' : 'Task 2'} prompt.

Prompt: ${prompt}

Requirements:
- Target Band ${targetBand} quality
- Academic register and vocabulary
- Clear paragraph structure
- Appropriate cohesive devices
- Task-appropriate content

Write only the essay, no additional commentary.`;

  try {
    const response = await groq.chat.completions.create({
      model: PREMIUM_MODEL,
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });

    return response.choices[0]?.message?.content || 'Could not generate model answer.';
  } catch (error) {
    console.error('Model answer generation error:', error);
    return 'Could not generate model answer. Please try again.';
  }
}

/**
 * Check word count and provide feedback
 */
export function checkWordCount(essay: string, taskType: 'task1' | 'task2'): {
  count: number;
  minRequired: number;
  isSufficient: boolean;
  feedback: string;
} {
  const words = essay.trim().split(/\s+/).filter(w => w.length > 0);
  const count = words.length;
  const minRequired = taskType === 'task1' ? 150 : 250;
  const isSufficient = count >= minRequired;

  let feedback = '';
  if (count < minRequired * 0.8) {
    feedback = `Too short! You need at least ${minRequired} words. Currently: ${count}`;
  } else if (count < minRequired) {
    feedback = `Almost there! Need ${minRequired - count} more words to meet the minimum.`;
  } else if (count > minRequired * 1.5) {
    feedback = `Good length, but consider being more concise.`;
  } else {
    feedback = `Perfect length!`;
  }

  return { count, minRequired, isSufficient, feedback };
}

// Fallback feedback when AI fails
function getFallbackFeedback(): WritingFeedback {
  return {
    overallBand: 6.0,
    taskResponse: 6.0,
    coherence: 6.0,
    lexicalResource: 6.0,
    grammar: 6.0,
    corrections: [
      {
        original: "essay content",
        corrected: "unable to evaluate",
        explanation: "There was an error processing your essay. Please try again.",
        type: "grammar",
      },
    ],
    suggestions: [
      "Try submitting your essay again",
      "Ensure you have a stable internet connection",
      "Check that your essay is not too long (max 5000 characters)",
    ],
    strengths: ["Attempted the task"],
    improvedVersion: "Please try again.",
    examinerComments: {
      taskResponse: "Unable to evaluate due to technical error.",
      coherence: "Unable to evaluate due to technical error.",
      lexical: "Unable to evaluate due to technical error.",
      grammar: "Unable to evaluate due to technical error.",
    },
  };
}
