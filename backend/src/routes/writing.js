const express = require('express');
const router = express.Router();
const writingController = require('../controllers/writingController');
const auth = require('../middleware/auth');
const emailVerified = require('../middleware/emailVerified');

router.post('/evaluate', auth, emailVerified, writingController.evaluateWriting);
router.get('/evaluations', auth, emailVerified, writingController.getEvaluations);
router.get('/evaluations/:id', auth, emailVerified, writingController.getEvaluationById);

module.exports = router;
