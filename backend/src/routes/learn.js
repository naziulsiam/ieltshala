const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const learnController = require('../controllers/learnController');

router.get('/:module', auth, learnController.getModuleContent);
router.get('/content/:id', auth, learnController.getContentById);
router.post('/complete', auth, learnController.markAsComplete);

module.exports = router;
