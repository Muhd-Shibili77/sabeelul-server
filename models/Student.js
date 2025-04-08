const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  class: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  performances: [{
    type: { type: String, enum: ['credit', 'minus'], required: true },
    marks: { type: Number, required: true },
    reason: { type: String, required: true },
    givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    date: { type: Date, default: Date.now }
  }],
  attendance: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Virtual for calculating total credit marks
studentSchema.virtual('totalCredit').get(function() {
  return this.performances
    .filter(p => p.type === 'credit')
    .reduce((sum, p) => sum + p.marks, 0);
});

// Virtual for calculating total minus marks
studentSchema.virtual('totalMinus').get(function() {
  return this.performances
    .filter(p => p.type === 'minus')
    .reduce((sum, p) => sum + p.marks, 0);
});

// Virtual for calculating net score
studentSchema.virtual('netScore').get(function() {
  return this.totalCredit - this.totalMinus;
});

// Ensure virtuals are included in toJSON output
studentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);