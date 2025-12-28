const { SpeakingTopic } = require('../models/Speaking');
const WritingEvaluation = require('../models/Writing');
const { Vocabulary } = require('../models/Vocabulary');
const { MockTest } = require('../models/MockTest');
const User = require('../models/User');

// ============= SPEAKING TOPICS =============
exports.createSpeakingTopic = async (req, res) => {
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

    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSpeakingTopic = async (req, res) => {
  try {
    const topic = await SpeakingTopic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSpeakingTopic = async (req, res) => {
  try {
    const topic = await SpeakingTopic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSpeakingTopics = async (req, res) => {
  try {
    const topics = await SpeakingTopic.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= VOCABULARY =============
exports.createVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.create(req.body);
    res.status(201).json({ success: true, data: vocabulary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkCreateVocabulary = async (req, res) => {
  try {
    const { words } = req.body; // Array of word objects
    const vocabulary = await Vocabulary.insertMany(words);
    res.status(201).json({ success: true, data: vocabulary, count: vocabulary.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVocabulary = async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!word) return res.status(404).json({ success: false, message: 'Word not found' });
    res.json({ success: true, data: word });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVocabulary = async (req, res) => {
  try {
    const word = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!word) return res.status(404).json({ success: false, message: 'Word not found' });
    res.json({ success: true, message: 'Word deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllVocabulary = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const words = await Vocabulary.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Vocabulary.countDocuments();
    
    res.json({ 
      success: true, 
      data: words,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= MOCK TESTS =============
exports.createMockTest = async (req, res) => {
  try {
    const mockTest = await MockTest.create(req.body);
    res.status(201).json({ success: true, data: mockTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMockTest = async (req, res) => {
  try {
    const test = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMockTest = async (req, res) => {
  try {
    const test = await MockTest.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= USERS =============
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= DASHBOARD STATS =============
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSpeakingTopics = await SpeakingTopic.countDocuments();
    const totalVocabulary = await Vocabulary.countDocuments();
    const totalMockTests = await MockTest.countDocuments();
    
    const recentUsers = await User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSpeakingTopics,
        totalVocabulary,
        totalMockTests,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= LEARN CONTENT =============
const LearnContent = require('../models/LearnContent');

exports.createLearnContent = async (req, res) => {
  try {
    const content = await LearnContent.create(req.body);
    res.status(201).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLearnContent = async (req, res) => {
  try {
    const content = await LearnContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLearnContent = async (req, res) => {
  try {
    const content = await LearnContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllLearnContent = async (req, res) => {
  try {
    const { module } = req.query;
    const filter = module ? { module } : {};
    const content = await LearnContent.find(filter).sort({ module: 1, order: 1 });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
