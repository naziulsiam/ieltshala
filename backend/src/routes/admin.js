const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

// Dashboard Stats
router.get('/stats', auth, admin, adminController.getDashboardStats);

// Speaking Topics
router.post('/speaking/topics', auth, admin, adminController.createSpeakingTopic);
router.put('/speaking/topics/:id', auth, admin, adminController.updateSpeakingTopic);
router.delete('/speaking/topics/:id', auth, admin, adminController.deleteSpeakingTopic);
router.get('/speaking/topics', auth, admin, adminController.getAllSpeakingTopics);

// Vocabulary
router.post('/vocabulary', auth, admin, adminController.createVocabulary);
router.post('/vocabulary/bulk', auth, admin, adminController.bulkCreateVocabulary);
router.put('/vocabulary/:id', auth, admin, adminController.updateVocabulary);
router.delete('/vocabulary/:id', auth, admin, adminController.deleteVocabulary);
router.get('/vocabulary', auth, admin, adminController.getAllVocabulary);

// Mock Tests
router.post('/mock-tests', auth, admin, adminController.createMockTest);
router.put('/mock-tests/:id', auth, admin, adminController.updateMockTest);
router.delete('/mock-tests/:id', auth, admin, adminController.deleteMockTest);
router.get('/mock-tests', auth, admin, adminController.getAllMockTests);

// Users
router.get('/users', auth, admin, adminController.getAllUsers);
router.put('/users/:id/role', auth, admin, adminController.updateUserRole);
router.delete('/users/:id', auth, admin, adminController.deleteUser);

module.exports = router;

// Learn Content
router.post('/learn-content', auth, admin, adminController.createLearnContent);
router.put('/learn-content/:id', auth, admin, adminController.updateLearnContent);
router.delete('/learn-content/:id', auth, admin, adminController.deleteLearnContent);
router.get('/learn-content', auth, admin, adminController.getAllLearnContent);
