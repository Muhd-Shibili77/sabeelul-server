import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  name: string;
  icon: string;
  subjects: string[];
  isDeleted: boolean;
  marks: {
    academicYear: string;
    item: string;
    score: number;
    description: string;
    date: Date;
  }[];
  penaltyMarks: {
    academicYear: string;
    reason: string;
    penaltyScore: number;
    description: string;
    date: Date;
  }[];
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
        description: {
          type: String,
        },
        date: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
    penaltyMarks: [
      {
        academicYear: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
        penaltyScore: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

const classModel: Model<IClass> = mongoose.model<IClass>("Class", classSchema);
export default classModel;