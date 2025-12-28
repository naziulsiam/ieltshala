const WritingEvaluation = require('../models/Writing');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Evaluate writing with AI
exports.evaluateWriting = async (req, res) => {
  try {
    const { taskType, topic, essay, wordCount } = req.body;

    if (!essay || essay.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Essay is too short',
      });
    }

    const minWords = taskType === 1 ? 150 : 250;
    if (wordCount < minWords) {
      return res.status(400).json({
        success: false,
        message: `Essay must be at least ${minWords} words`,
      });
    }

    const prompt = `You are an IELTS Writing examiner. Evaluate this Task ${taskType} essay.

Topic: "${topic}"

Essay (${wordCount} words):
"${essay}"

Provide evaluation in this JSON format:
{
  "scores": {
    "taskResponse": 7.0,
    "coherenceCohesion": 6.5,
    "lexicalResource": 7.0,
    "grammaticalRange": 6.5,
    "overall": 7.0
  },
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"],
  "grammarErrors": [{"original": "text", "corrected": "text", "explanation": "why"}],
  "improvedVersion": "Rewritten version with corrections",
  "detailedFeedback": "Detailed feedback paragraph"
}

Give realistic scores between 5.0 and 9.0.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
    });

    let evaluationData;
    try {
      const content = completion.choices[0]?.message?.content || '{}';
      evaluationData = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      evaluationData = {
        scores: { taskResponse: 6.0, coherenceCohesion: 6.0, lexicalResource: 6.0, grammaticalRange: 6.0, overall: 6.0 },
        strengths: ['Good attempt'],
        improvements: ['Keep practicing'],
        grammarErrors: [],
        improvedVersion: essay,
        detailedFeedback: 'Unable to generate detailed feedback.',
      };
    }

    const evaluation = await WritingEvaluation.create({
      userId: req.user.id,
      taskType,
      topic,
      essay,
      wordCount,
      scores: evaluationData.scores,
      strengths: evaluationData.strengths,
      improvements: evaluationData.improvements,
      grammarErrors: evaluationData.grammarErrors,
      improvedVersion: evaluationData.improvedVersion,
      detailedFeedback: evaluationData.detailedFeedback,
    });

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Writing evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate writing',
      error: error.message,
    });
  }
};

// Get user's writing evaluations
exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await WritingEvaluation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluations',
      error: error.message,
    });
  }
};

// Get single evaluation
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await WritingEvaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found',
      });
    }

    if (evaluation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch evaluation',
      error: error.message,
    });
  }
};
