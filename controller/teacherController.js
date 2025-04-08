const Student = require('../models/Student');

// Mark student attendance
exports.markAttendance = async (req, res) => {
  try {
    const { date, students } = req.body;
    
    const updatePromises = students.map(async ({ studentId, status }) => {
      const student = await Student.findById(studentId);
      if (student) {
        // Remove existing attendance for this date if any
        student.attendance = student.attendance.filter(a => 
          a.date.toISOString().split('T')[0] !== date
        );
        
        student.attendance.push({
          date,
          status,
          markedBy: req.user.id
        });
        
        await student.save();
      }
    });

    await Promise.all(updatePromises);
    
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.class })
      .select('name rollNumber performances attendance')
      .lean();

    const studentsWithPerformance = students.map(student => ({
      ...student,
      totalCredit: student.performances
        .filter(p => p.type === 'credit')
        .reduce((sum, p) => sum + p.marks, 0),
      totalMinus: student.performances
        .filter(p => p.type === 'minus')
        .reduce((sum, p) => sum + p.marks, 0)
    }));

    res.json(studentsWithPerformance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};