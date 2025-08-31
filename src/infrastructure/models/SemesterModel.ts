import mongoose, { Schema, Document } from "mongoose";

export interface ISemester extends Document {
  semester: string;
  isLocked: boolean;
}

const semesterSchema = new Schema({
  semester: {
    type: String,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
},{ timestamps: true });

const SemesterModel = mongoose.model<ISemester>("Semester", semesterSchema);

export default SemesterModel;
