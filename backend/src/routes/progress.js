const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const emailVerified = require('../middleware/emailVerified');
const progressController = require('../controllers/progressController');

router.get('/overview', auth, emailVerified, progressController.getOverview);
router.get('/chart-data', auth, emailVerified, progressController.getChartData);
router.post('/log', auth, emailVerified, progressController.logActivity);

module.exports = router;
