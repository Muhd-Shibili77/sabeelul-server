const User = require('../models/User');
const Performance = require('../models/Performance');

// Get all students with performance
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('class');
    
    const studentsWithPerformance = await Promise.all(students.map(async (student) => {
      const performances = await Performance.find({ student: student._id });
      
      const totalCredit = performances
        .filter(p => p.type === 'credit')
        .reduce((sum, p) => sum + p.marks, 0);
      
      const totalMinus = performances
        .filter(p => p.type === 'minus')
        .reduce((sum, p) => sum + p.marks, 0);
      
      return {
        ...student.toObject(),
        totalCredit,
        totalMinus,
        netScore: totalCredit - totalMinus
      };
    }));

    // Highlight best and worst performers
    const sortedStudents = studentsWithPerformance.sort((a, b) => b.netScore - a.netScore);
    const bestPerformer = sortedStudents[0];
    const worstPerformer = sortedStudents[sortedStudents.length - 1];

    res.status(200).json({
      students: studentsWithPerformance,
      bestPerformer,
      worstPerformer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, subjects } = req.body;
    // Add password hashing in authController
    const teacher = new User({ 
      name, 
      email, 
      password, 
      role: 'teacher', 
      subjects 
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};