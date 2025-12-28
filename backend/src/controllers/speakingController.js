const { SpeakingTopic, SpeakingEvaluation } = require('../models/Speaking');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Get all speaking topics
exports.getTopics = async (req, res) => {
  try {
    const { part, difficulty } = req.query;
    const filter = {};
    
    if (part) filter.part = part;
    if (difficulty) filter.difficulty = difficulty;

    const topics = await SpeakingTopic.find(filter);

    res.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error.message,
    });
  }
};

// Get single topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await SpeakingTopic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic',
      error: error.message,
    });
  }
};

// Evaluate speaking with AI
exports.evaluateSpeaking = async (req, res) => {
  try {
    const { topicId, transcript, audioUrl, duration } = req.body;

    if (!transcript || transcript.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Transcript is too short. Please speak more.',
      });
    }

    const topic = await SpeakingTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    // Evaluate with Groq AI
    const prompt = `You are an IELTS Speaking examiner. Evaluate this speaking response for the topic "${topic.title}".

Transcript: "${transcript}"

Duration: ${duration} seconds

Provide a detailed evaluation in the following JSON format:
{
  "scores": {
    "fluency": 7.0,
    "lexical": 6.5,
    "grammar": 7.0,
    "pronunciation": 6.5,
    "overall": 6.5
  },
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"],
  "detailedFeedback": "Detailed paragraph feedback",
  "sampleAnswer": "A band 7+ sample answer for this topic"
}

Give realistic band scores between 5.0 and 9.0. Be constructive and encouraging.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    let evaluationData;
    try {
      const content = completion.choices[0]?.message?.content || '{}';
      evaluationData = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      evaluationData = {
        scores: { fluency: 6.0, lexical: 6.0, grammar: 6.0, pronunciation: 6.0, overall: 6.0 },
        strengths: ['Good effort'],
        improvements: ['Keep practicing'],
        detailedFeedback: 'Unable to generate detailed feedback at this time.',
        sampleAnswer: 'Practice more to improve your speaking skills.',
      };
    }

    // Save evaluation
    const evaluation = await SpeakingEvaluation.create({
      userId: req.user.id,
      topicId,
      transcript,
      audioUrl,
      duration,
      scores: evaluationData.scores,
      strengths: evaluationData.strengths,
      improvements: evaluationData.improvements,
      detailedFeedback: evaluationData.detailedFeedback,
      sampleAnswer: evaluationData.sampleAnswer,
    });

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate speaking',
      error: error.message,
    });
  }
};

// Get user's evaluations
exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await SpeakingEvaluation.find({ userId: req.user.id })
      .populate('topicId', 'title part')
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

// Get single evaluation by ID
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await SpeakingEvaluation.findById(req.params.id)
      .populate('topicId', 'title description part');

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found',
      });
    }

    // Check if evaluation belongs to user
    if (evaluation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this evaluation',
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
