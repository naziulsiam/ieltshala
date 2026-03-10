import { groq, DEFAULT_MODEL, FAST_MODEL, type ChatMessage, type AIResponse } from './groq';

// System prompt for Hala - the IELTS tutor persona
const HALA_SYSTEM_PROMPT = `You are Hala, an expert IELTS tutor from Bangladesh with 10+ years of experience. You are friendly, encouraging, and speak in a warm, approachable tone.

Your expertise:
- All 4 IELTS sections: Listening, Reading, Writing, Speaking
- Band scoring system (0-9)
- Common mistakes Bangladeshi students make
- Tips for achieving Band 7.0+

When helping students:
1. Give specific, actionable advice (not generic tips)
2. Use examples from real IELTS tests
3. Explain grammar/vocabulary concepts simply
4. Occasionally use Bangla translations for difficult words
5. Be encouraging but honest about weaknesses
6. Provide band-score-specific feedback

Response format:
- Keep responses concise (2-4 paragraphs)
- Use bullet points for lists
- Highlight key phrases in **bold**
- End with a supportive note

If the user is asking about:
- Writing: Provide specific vocabulary suggestions and grammar corrections
- Speaking: Give fluency tips and pronunciation advice
- Reading: Share skimming/scanning techniques
- Listening: Recommend practice strategies
- General: Provide study plans and motivation`;

export interface HalaConversation {
  id: string;
  messages: ChatMessage[];
  context?: 'general' | 'speaking' | 'writing' | 'vocabulary' | 'listening' | 'reading';
}

/**
 * Chat with Hala AI tutor
 */
export async function chatWithHala(
  messages: ChatMessage[],
  context?: HalaConversation['context']
): Promise<AIResponse> {
  const systemPrompt = context
    ? `${HALA_SYSTEM_PROMPT}\n\nCurrent context: The student is asking about ${context}. Focus your response on this area.`
    : HALA_SYSTEM_PROMPT;

  const response = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
  });

  return {
    content: response.choices[0]?.message?.content || 'I apologize, I could not generate a response.',
    usage: {
      prompt_tokens: response.usage?.prompt_tokens || 0,
      completion_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
    },
  };
}

/**
 * Quick response for simple questions (uses faster model)
 */
export async function quickHalaResponse(
  question: string,
  context?: HalaConversation['context']
): Promise<string> {
  const systemPrompt = context
    ? `${HALA_SYSTEM_PROMPT}\n\nCurrent context: ${context}`
    : HALA_SYSTEM_PROMPT;

  const response = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
}

/**
 * Generate study tips based on weak areas
 */
export async function generateStudyTips(
  weakAreas: string[],
  targetBand: number
): Promise<string[]> {
  const prompt = `Generate 3-4 specific study tips for an IELTS student targeting Band ${targetBand}.
Their weak areas are: ${weakAreas.join(', ')}.

Return ONLY a JSON array of strings, like this:
["Tip 1", "Tip 2", "Tip 3"]

Make tips specific, actionable, and targeted at Bangladeshi students. Focus on practical daily actions.`;

  try {
    const response = await groq.chat.completions.create({
      model: FAST_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 512,
    });

    const content = response.choices[0]?.message?.content || '[]';
    // Extract JSON from response (might have markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return content.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^- /, ''));
  } catch (error) {
    console.error('Error generating study tips:', error);
    return [
      'Practice speaking English daily for 15 minutes',
      'Read one IELTS passage and summarize it',
      'Learn 5 new academic vocabulary words',
    ];
  }
}

/**
 * Explain a grammar/vocabulary concept
 */
export async function explainConcept(
  concept: string,
  withBengaliTranslation: boolean = true
): Promise<string> {
  const prompt = withBengaliTranslation
    ? `Explain the English language concept: "${concept}"

Provide:
1. Simple explanation
2. 2-3 examples
3. Common mistakes to avoid
4. Bengali translation of key terms

Keep it concise and student-friendly.`
    : `Explain the English language concept: "${concept}"

Provide:
1. Simple explanation
2. 2-3 examples
3. Common mistakes to avoid

Keep it concise and student-friendly.`;

  const response = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content || 'I apologize, I could not explain this concept.';
}
