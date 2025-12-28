const { MockTest, MockTestResult } = require('../models/MockTest');

exports.getAllTests = async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const tests = await MockTest.find(filter).select('-questions.correctAnswer');

    res.json({
      success: true,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message,
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id).select('-questions.correctAnswer');
    
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    res.json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test',
      error: error.message,
    });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers, timeTaken } = req.body;

    const test = await MockTest.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    let correctCount = 0;
    const detailedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        userAnswer: answer,
        isCorrect,
      };
    });

    const score = (correctCount / test.questions.length) * 100;
    
    let bandScore = 0;
    if (score >= 90) bandScore = 9;
    else if (score >= 80) bandScore = 8;
    else if (score >= 70) bandScore = 7;
    else if (score >= 60) bandScore = 6.5;
    else if (score >= 50) bandScore = 6;
    else if (score >= 40) bandScore = 5.5;
    else bandScore = 5;

    const result = await MockTestResult.create({
      userId: req.user.id,
      testId,
      answers: detailedAnswers,
      score,
      bandScore,
      timeTaken,
    });

    res.json({
      success: true,
      data: {
        resultId: result._id,
        score,
        bandScore,
        correctCount,
        totalQuestions: test.questions.length,
        answers: detailedAnswers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const results = await MockTestResult.find({ userId: req.user.id })
      .populate('testId', 'title titleBn type')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message,
    });
  }
};
