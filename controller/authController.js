const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Unified login function
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    let user;
    switch(role) {
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      case 'teacher':
        user = await Teacher.findOne({ email });
        break;
      case 'student':
        user = await Student.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};