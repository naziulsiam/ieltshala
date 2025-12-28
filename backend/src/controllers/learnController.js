const LearnContent = require('../models/LearnContent');

// Get all learn content for a module
exports.getModuleContent = async (req, res) => {
  try {
    const { module } = req.params;
    const { category } = req.query;

    const filter = { module, isPublished: true };
    if (category) filter.category = category;

    const content = await LearnContent.find(filter)
      .sort({ order: 1 })
      .select('-content -contentBn'); // Don't send full content in list

    // Group by category
    const grouped = content.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message,
    });
  }
};

// Get single learn content by ID
exports.getContentById = async (req, res) => {
  try {
    const content = await LearnContent.findById(req.params.id)
      .populate('relatedPracticeId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message,
    });
  }
};

// Track user progress on learn content
exports.markAsComplete = async (req, res) => {
  try {
    const { contentId } = req.body;
    
    // You can implement a UserProgress model to track this
    // For now, just return success
    
    res.json({
      success: true,
      message: 'Content marked as complete',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark content',
      error: error.message,
    });
  }
};
