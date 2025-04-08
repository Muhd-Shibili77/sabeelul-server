const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

router.route('/students')
  .get(adminController.getAllStudents);

router.route('/teachers')
  .post(adminController.createTeacher);

module.exports = router;