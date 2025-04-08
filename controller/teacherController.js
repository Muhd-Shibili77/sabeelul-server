const Performance = require('../models/Performance');
const Attendance = require('../models/Attendance');

// Add performance marks
exports.addPerformance = async (req, res) => {
  try {
    const { studentId, type, marks, reason } = req.body;
    const performance = new Performance({
      student: studentId,
      teacher: req.user.id,
      type,
      marks,
      reason
    });
    await performance.save();
    res.status(201).json(performance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { date, students } = req.body; // students = [{ studentId, status }]
    const attendanceRecords = students.map(student => ({
      student: student.studentId,
      teacher: req.user.id,
      date: new Date(date),
      status: student.status
    }));
    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};