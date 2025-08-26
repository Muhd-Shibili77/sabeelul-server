import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPKV extends Document {
  studentId: string;
  PKVmarks: {
    academicYear: string;
    semester: string;
    marks: {
      phase: string;
      mark: number;
      date: Date;
    }[];
  }[];
}

const PKVSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    PKVmarks: [
      {
        academicYear: { type: String },
        semester: {
          type: String,
          enum: ["Rabee Semester", "Ramadan Semester"],
        },
        marks: [
          {
            phase: { type: String },
            mark: { type: Number },
            date: { type: Date, default: () => new Date() },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const PKVModel: Model<IPKV> = mongoose.model<IPKV>("PKV", PKVSchema);

export default PKVModel;
