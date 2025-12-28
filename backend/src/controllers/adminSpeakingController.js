const { SpeakingTopic } = require('../models/Speaking');

// Create new speaking topic
exports.createTopic = async (req, res) => {
  try {
    const { title, titleBn, description, descriptionBn, part, difficulty, sampleQuestions } = req.body;

    const topic = await SpeakingTopic.create({
      title,
      titleBn,
      description,
      descriptionBn,
      part,
      difficulty,
      sampleQuestions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create topic',
      error: error.message,
    });
  }
};

// Update topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await SpeakingTopic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
      message: 'Failed to update topic',
      error: error.message,
    });
  }
};

// Delete topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await SpeakingTopic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete topic',
      error: error.message,
    });
  }
};

// Get all topics (admin view with all details)
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await SpeakingTopic.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

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
