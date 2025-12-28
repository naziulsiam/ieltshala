const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const emailVerified = require('../middleware/emailVerified');
const vocabularyController = require('../controllers/vocabularyController');

router.get('/daily', auth, emailVerified, vocabularyController.getDailyWords);
router.get('/flashcards', auth, emailVerified, vocabularyController.getFlashcards);
router.post('/progress', auth, emailVerified, vocabularyController.updateProgress);
router.get('/stats', auth, emailVerified, vocabularyController.getStats);

module.exports = router;
