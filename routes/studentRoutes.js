const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware.protect);

// Teacher-specific routes
router.use(authMiddleware.restrictTo('teacher'));
router.post('/performance', studentController.addPerformance);
router.get('/class/:class', studentController.getStudentsByClass);

// Admin-specific routes
router.use(authMiddleware.restrictTo('admin'));
router.get('/', studentController.getAllStudents);

module.exports = router;
