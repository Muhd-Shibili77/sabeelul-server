const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Error handler for async functions
const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Protect routes - verify JWT
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let currentUser;
  switch (decoded.role) {
    case 'admin':
      currentUser = await Admin.findById(decoded.id);
      break;
    case 'teacher':
      currentUser = await Teacher.findById(decoded.id);
      break;
    case 'student':
      currentUser = await Student.findById(decoded.id);
      break;
    default:
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid user role!'
      });
  }

  if (!currentUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token no longer exists!'
    });
  }

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: 'fail',
      message: 'User recently changed password! Please log in again.'
    });
  }

  // Grant access to protected route
  req.user = currentUser;
  req.user.role = decoded.role; // Ensure role is set
  next();
});

// Role-based authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action!'
      });
    }
    next();
  };
};

// Check ownership (for student/teacher accessing their own data)
exports.checkOwnership = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'Document not found'
      });
    }

    // Admins can access anything
    if (req.user.role === 'admin') return next();
    
    // Teachers can access their own data or their students' data
    if (req.user.role === 'teacher') {
      if (model.modelName === 'Teacher' && doc._id.equals(req.user._id)) {
        return next();
      }
      if (model.modelName === 'Student' && doc.assignedTeacher?.equals(req.user._id)) {
        return next();
      }
    }

    // Students can only access their own data
    if (req.user.role === 'student' && doc._id.equals(req.user._id)) {
      return next();
    }

    res.status(403).json({
      status: 'fail',
      message: 'You do not own this resource!'
    });
  });
};