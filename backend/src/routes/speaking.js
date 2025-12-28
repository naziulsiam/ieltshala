const express = require('express');
const router = express.Router();
const speakingController = require('../controllers/speakingController');
const auth = require('../middleware/auth');
const emailVerified = require('../middleware/emailVerified');

router.get('/topics', auth, emailVerified, speakingController.getTopics);
router.get('/topics/:id', auth, emailVerified, speakingController.getTopicById);
router.post('/evaluate', auth, emailVerified, speakingController.evaluateSpeaking);
router.get('/evaluations', auth, emailVerified, speakingController.getEvaluations);
router.get('/evaluations/:id', auth, emailVerified, speakingController.getEvaluationById);

module.exports = router;
