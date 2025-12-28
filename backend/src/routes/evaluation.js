const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Evaluate Writing Task
router.post('/writing', async (req, res) => {
  try {
    const { essay, taskType, prompt } = req.body;

    if (!essay || !taskType) {
      return res.status(400).json({ error: 'Essay and task type are required' });
    }

    const wordCount = essay.trim().split(/\s+/).length;
    const minWords = taskType === 1 ? 150 : 250;

    if (wordCount < minWords) {
      return res.status(400).json({ 
        error: `Essay is too short. Minimum ${minWords} words required. You have ${wordCount} words.` 
      });
    }

    const systemPrompt = taskType === 1 
      ? `You are an IELTS Writing Task 1 examiner. Evaluate the essay based on:
1. Task Achievement (0-9)
2. Coherence and Cohesion (0-9)
3. Lexical Resource (0-9)
4. Grammatical Range and Accuracy (0-9)

Provide a detailed evaluation with band score for each criterion, overall band score, strengths, weaknesses, and specific suggestions for improvement.`
      : `You are an IELTS Writing Task 2 examiner. Evaluate the essay based on:
1. Task Response (0-9)
2. Coherence and Cohesion (0-9)
3. Lexical Resource (0-9)
4. Grammatical Range and Accuracy (0-9)

Provide a detailed evaluation with band score for each criterion, overall band score, strengths, weaknesses, and specific suggestions for improvement.`;

    const userPrompt = `Task Type: ${taskType}
Prompt: ${prompt}
Word Count: ${wordCount}

Essay:
${essay}

Please provide a comprehensive IELTS evaluation.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',  // Updated model
      temperature: 0.3,
      max_tokens: 2000,
    });

    const evaluation = completion.choices[0].message.content;

    res.json({
      success: true,
      evaluation,
      wordCount,
      taskType
    });

  } catch (error) {
    console.error('Writing evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate essay. Please try again.',
      details: error.message 
    });
  }
});

// Evaluate Speaking Response
router.post('/speaking', async (req, res) => {
  try {
    const { transcript, part, question } = req.body;

    if (!transcript || !part) {
      return res.status(400).json({ error: 'Transcript and part number are required' });
    }

    const systemPrompt = `You are an IELTS Speaking examiner. Evaluate the speaking response based on:
1. Fluency and Coherence (0-9)
2. Lexical Resource (0-9)
3. Grammatical Range and Accuracy (0-9)
4. Pronunciation (0-9)

Consider that this is Part ${part} of the IELTS Speaking test. Provide band score for each criterion, overall band score, strengths, weaknesses, and specific suggestions.`;

    const userPrompt = `Part: ${part}
Question: ${question}

Response:
${transcript}

Please provide a comprehensive IELTS Speaking evaluation.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',  // Updated model
      temperature: 0.3,
      max_tokens: 1500,
    });

    const evaluation = completion.choices[0].message.content;

    res.json({
      success: true,
      evaluation,
      part
    });

  } catch (error) {
    console.error('Speaking evaluation error:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate speaking response. Please try again.',
      details: error.message 
    });
  }
});

module.exports = router;
