const groq = require('../config/groq');
const openai = require('../config/openai');
const fs = require('fs');

class AIService {
  async evaluateSpeaking(audioPath, language = 'en') {
    try {
      // Step 1: Transcribe audio using OpenAI Whisper (still needed for audio)
      console.log('🎙️ Transcribing audio with Whisper...');
      
      let transcript;
      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(audioPath),
          model: 'whisper-1',
          language: 'en',
        });
        transcript = transcription.text;
      } catch (error) {
        console.log('⚠️ Whisper not available, using demo transcript');
        transcript = "This is a demo transcript. Add OpenAI API key for real audio transcription.";
      }

      console.log('✅ Transcript:', transcript.substring(0, 100) + '...');

      // Step 2: Evaluate using Groq (FREE!)
      console.log('🤖 Evaluating with Groq AI...');
      
      const evaluationPrompt = language === 'bn'
        ? `আপনি একজন IELTS স্পিকিং পরীক্ষক। নিম্নলিখিত উত্তরটি মূল্যায়ন করুন।

ট্রান্সক্রিপ্ট: "${transcript}"

নিম্নলিখিত বিষয়গুলির জন্য 0-9 স্কোর দিন এবং বাংলায় ফিডব্যাক দিন।

JSON ফর্ম্যাটে উত্তর দিন।`
        : `You are an expert IELTS Speaking examiner with 10 years of experience. Evaluate the following speaking response in detail.

Transcript: "${transcript}"

Provide scores from 0 to 9 for:
1. Fluency and Coherence
2. Pronunciation
3. Grammatical Range and Accuracy
4. Lexical Resource

Also provide:
- Strengths: 3 specific positive points
- Improvements: 3 specific areas for improvement
- Sample Answer: A band 7+ level sample answer to the same question

Respond ONLY in valid JSON format with this exact structure:
{
  "scores": {
    "fluency": number,
    "pronunciation": number,
    "grammar": number,
    "lexical": number
  },
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "sampleAnswer": string,
  "overallBand": number
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert IELTS Speaking examiner. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const evaluation = JSON.parse(completion.choices[0].message.content);
      console.log('✅ Groq evaluation complete!');

      return {
        transcript,
        scores: {
          fluency: evaluation.scores?.fluency || 7,
          pronunciation: evaluation.scores?.pronunciation || 7,
          grammar: evaluation.scores?.grammar || 7,
          coherence: evaluation.scores?.lexical || 7,
          overall: evaluation.overallBand || Math.round(
            ((evaluation.scores?.fluency || 7) + 
             (evaluation.scores?.pronunciation || 7) + 
             (evaluation.scores?.grammar || 7) + 
             (evaluation.scores?.lexical || 7)) / 4 * 10
          ) / 10,
        },
        feedback: {
          strengths: evaluation.strengths || ['Good attempt', 'Clear communication', 'Relevant response'],
          improvements: evaluation.improvements || ['Practice more', 'Expand vocabulary', 'Work on fluency'],
          sampleAnswer: evaluation.sampleAnswer || 'Sample answer will be provided here.',
        },
      };
    } catch (error) {
      console.error('❌ AI Speaking evaluation error:', error);
      throw new Error('Failed to evaluate speaking: ' + error.message);
    }
  }

  async evaluateWriting(content, taskType, language = 'en') {
    try {
      console.log('✍️ Evaluating writing with Groq AI...');
      
      const evaluationPrompt = language === 'bn'
        ? `আপনি একজন IELTS রাইটিং পরীক্ষক। টাস্ক ${taskType} মূল্যায়ন করুন।

${content}

JSON ফর্ম্যাটে স্কোর এবং ফিডব্যাক দিন।`
        : `You are an expert IELTS Writing examiner. Evaluate this Task ${taskType} essay.

Essay:
${content}

Provide scores from 0 to 9 for:
1. Task Achievement/Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Also provide:
- Grammar corrections: array of {original, corrected, explanation}
- An improved version of the essay
- Strengths: 3 positive points
- Improvements: 3 areas to improve

Respond ONLY in valid JSON format with this structure:
{
  "scores": {
    "taskAchievement": number,
    "coherence": number,
    "lexicalResource": number,
    "grammar": number
  },
  "corrections": [{original: string, corrected: string, explanation: string}],
  "improvedVersion": string,
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "overallBand": number
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert IELTS Writing examiner. Always respond with valid JSON.' },
          { role: 'user', content: evaluationPrompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const evaluation = JSON.parse(completion.choices[0].message.content);
      console.log('✅ Groq writing evaluation complete!');

      return {
        scores: {
          taskAchievement: evaluation.scores?.taskAchievement || 7,
          coherence: evaluation.scores?.coherence || 7,
          lexicalResource: evaluation.scores?.lexicalResource || 7,
          grammar: evaluation.scores?.grammar || 7,
          overall: evaluation.overallBand || 7,
        },
        feedback: {
          corrections: evaluation.corrections || [],
          improvedVersion: evaluation.improvedVersion || content,
          strengths: evaluation.strengths || ['Good effort', 'Clear structure', 'Relevant content'],
          improvements: evaluation.improvements || ['Expand vocabulary', 'Improve grammar', 'Add more details'],
        },
      };
    } catch (error) {
      console.error('❌ AI Writing evaluation error:', error);
      throw new Error('Failed to evaluate writing: ' + error.message);
    }
  }
}

module.exports = new AIService();
