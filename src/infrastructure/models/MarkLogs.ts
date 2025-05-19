import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMarkLogs extends Document {
  userId: string;
  marks: {
    academicYear: string;
    item: string;
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
        academicYear: {
          type: String,
          required: true,
        },
        item: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        scoreType:{
            type:String
        }
      },
    ],
  },
  { timestamps: true }
);
const markLogsModel: Model<IMarkLogs> = mongoose.model<IMarkLogs>('MarkLogs', markLogsSchema);
export default markLogsModel;

