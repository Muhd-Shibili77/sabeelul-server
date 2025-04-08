const Student = require('../models/Student');

// Add performance marks to student
exports.addPerformance = async (req, res) => {
  try {
    const { studentId, type, marks, reason } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.performances.push({
      type,
      marks,
      reason,
      givenBy: req.user.id
    });

    await student.save();

    res.status(201).json({
      message: 'Performance added successfully',
      student: {
        id: student._id,
        name: student.name,
        totalCredit: student.totalCredit,
        totalMinus: student.totalMinus,
        netScore: student.netScore
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get student performance
exports.getStudentPerformance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('performances.givenBy', 'name')
      .populate('attendance.markedBy', 'name');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      student: {
        id: student._id,
        name: student.name,
        class: student.class,
        rollNumber: student.rollNumber,
        totalCredit: student.totalCredit,
        totalMinus: student.totalMinus,
        netScore: student.netScore,
        performances: student.performances,
        attendance: student.attendance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};