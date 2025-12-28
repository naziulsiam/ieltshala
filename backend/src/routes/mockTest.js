const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const emailVerified = require('../middleware/emailVerified');
const mockTestController = require('../controllers/mockTestController');

router.get('/', auth, emailVerified, mockTestController.getAllTests);
router.get('/:id', auth, emailVerified, mockTestController.getTestById);
router.post('/submit', auth, emailVerified, mockTestController.submitTest);
router.get('/history/me', auth, emailVerified, mockTestController.getHistory);

module.exports = router;
