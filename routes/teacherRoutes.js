const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect, authMiddleware.restrictTo('teacher'));

router.route('/performance')
  .post(teacherController.addPerformance);

router.route('/attendance')
  .post(teacherController.markAttendance);

module.exports = router;