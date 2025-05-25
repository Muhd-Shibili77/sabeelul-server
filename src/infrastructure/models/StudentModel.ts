import e from "express";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  admissionNo: string;
  name: string;
  phone: number;
  address: string;
  email: string;
  password: string;
  classId: string;
  guardianName: string;
  profileImage: string;
  isDeleted?: boolean;
  extraMarks?: {
    academicYear: string;
    programId?: mongoose.Types.ObjectId;
    customProgramName?: string;
    mark: number;
    date: Date;
    description: string;
  }[];
  mentorMarks?: {
    academicYear: string;
    semester: string;
    mark: number;
    date: Date;
  }[];
  cceMarks?: {
    academicYear: string;
    semester: string;
    className: string;
    subjects: {
      subjectName: string;
      phase: string;
      mark: number;
      date: Date;
    }[];
  }[];
  penaltyMarks?: {
    academicYear: string;
    reason: string;
    penaltyScore: number;
    description: string;
    date: Date;
  }[];
}

const studentSchema = new Schema(
  {
    admissionNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    guardianName: { type: String, required: true },
    profileImage: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },

    extraMarks: [
      {
        academicYear: { type: String },
        programId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExtraMarkItem",
          default: null,
        },
        customProgramName: { type: String, default: null },
        mark: { type: Number, required: true },
        date: { type: Date, default: () => new Date() },
        description: { type: String },
      },
    ],

    mentorMarks: [
      {
        academicYear: { type: String },
        semester: {
          type: String,
          enum: ["Rabee’ Semester", "Ramadan Semester"],
        },
        mark: { type: Number },
        date: { type: Date, default: () => new Date() },
      },
    ],

    cceMarks: [
      {
        academicYear: { type: String },
        semester: {
          type: String,
          enum: ["Rabee’ Semester", "Ramadan Semester"],
        },
        className: { type: String },
        subjects: [
          {
            subjectName: { type: String },
            phase: { type: String },
            mark: { type: Number },
            date: { type: Date, default: () => new Date() },
          },
        ],
      },
    ],

    penaltyMarks: [
      {
        academicYear: { type: String, required: true },
        reason: { type: String, required: true },
        penaltyScore: { type: Number, required: true },
        description: { type: String },
        date: { type: Date, default: () => new Date() },
      },
    ],
  },
  { timestamps: true }
);

const StudentModel: Model<IStudent> = mongoose.model<IStudent>(
  "Student",
  studentSchema
);

export default StudentModel;
