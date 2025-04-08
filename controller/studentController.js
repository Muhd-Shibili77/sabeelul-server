const Performance = require('../models/Performance');
const Attendance = require('../models/Attendance');

// Get student performance
exports.getMyPerformance = async (req, res) => {
  try {
    const performances = await Performance.find({ student: req.user.id });
    
    const totalCredit = performances
      .filter(p => p.type === 'credit')
      .reduce((sum, p) => sum + p.marks, 0);
    
    const totalMinus = performances
      .filter(p => p.type === 'minus')
      .reduce((sum, p) => sum + p.marks, 0);
    
    res.status(200).json({
      totalCredit,
      totalMinus,
      netScore: totalCredit - totalMinus,
      performances
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user.id });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};