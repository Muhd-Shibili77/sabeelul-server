const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjects, assignedClasses } = req.body;
    
    const teacher = new Teacher({
      name,
      email,
      password,
      subjects,
      assignedClasses
    });

    await teacher.save();
    
    res.status(201).json({
      message: 'Teacher created successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects,
        assignedClasses: teacher.assignedClasses
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all students with performance
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('performances.givenBy', 'name')
      .lean();

    const studentsWithPerformance = students.map(student => ({
      ...student,
      totalCredit: student.performances
        .filter(p => p.type === 'credit')
        .reduce((sum, p) => sum + p.marks, 0),
      totalMinus: student.performances
        .filter(p => p.type === 'minus')
        .reduce((sum, p) => sum + p.marks, 0),
      netScore: student.totalCredit - student.totalMinus
    }));

    // Sort by net score
    const sortedStudents = studentsWithPerformance.sort((a, b) => b.netScore - a.netScore);
    
    res.json({
      students: sortedStudents,
      bestPerformer: sortedStudents[0],
      worstPerformer: sortedStudents[sortedStudents.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};