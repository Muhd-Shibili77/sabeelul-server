import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMarkLogs extends Document {
  userId: string;
  marks: {
    markId: string;
    academicYear: string;
    title: string;
    score: number;
    date: Date;
    scoreType: String;
  }[];
}

const markLogsSchema = new Schema<IMarkLogs>(
  {
    userId: {
      type: String,
      required: true,
    },
    marks: [
      {
        markId: {
          type: String, // Unique ID to link with the original mark
          required: true,
        },
        academicYear: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        scoreType: {
          type: String,
          enum: ['Mentor', 'CCE', 'Penalty', 'Credit'],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const markLogsModel: Model<IMarkLogs> = mongoose.model<IMarkLogs>('MarkLogs', markLogsSchema);
export default markLogsModel;

